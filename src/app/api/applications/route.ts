import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { applicationSchema } from '@/lib/validations';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = applicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Please check your form entries' },
        { status: 400 }
      );
    }

    const session = await getSession();
    const data = parsed.data;

    const application = await prisma.traderApplication.create({
      data: {
        businessName: data.businessName,
        contactName: data.contactName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        category: data.category,
        chaletSize: data.chaletSize,
        zoneId: data.zoneId,
        description: data.description,
        hygieneCertRef: data.hygieneCertRef || null,
        gdprConsent: data.gdprConsent,
        status: 'pending',
        userId: session?.id ?? null,
      },
      include: { zone: { select: { name: true } } },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error('Application POST error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}