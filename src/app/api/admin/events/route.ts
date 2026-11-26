import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { eventSchema } from '@/lib/validations';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid event' }, { status: 400 });
  }

  const event = await prisma.festiveEvent.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      eventDate: new Date(parsed.data.eventDate),
      category: parsed.data.category,
      zoneId: parsed.data.zoneId,
    },
  });

  return NextResponse.json({ event }, { status: 201 });
}