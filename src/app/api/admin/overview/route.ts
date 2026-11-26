import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Administrator access required' }, { status: 403 });
  }

  const [zones, stalls, applications, events, userCount] = await Promise.all([
    prisma.marketZone.findMany({ orderBy: { name: 'asc' } }),
    prisma.stall.findMany({ include: { zone: { select: { name: true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.traderApplication.findMany({
      include: { zone: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.festiveEvent.findMany({
      include: { zone: { select: { name: true } } },
      orderBy: { eventDate: 'asc' },
    }),
    prisma.user.count(),
  ]);

  return NextResponse.json({
    zones,
    stalls,
    applications,
    events,
    stats: {
      totalZones: zones.length,
      totalStalls: stalls.length,
      pendingApplications: applications.filter((a: { status: string }) => a.status === 'pending').length,
      totalEvents: events.length,
      registeredUsers: userCount,
    },
  });
}