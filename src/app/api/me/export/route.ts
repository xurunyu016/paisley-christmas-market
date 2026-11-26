import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GDPR Article 15 & 20: Right of Access & Data Portability
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      businessName: true,
      consentGiven: true,
      consentAt: true,
      createdAt: true,
      applications: {
        include: { zone: { select: { name: true, address: true } } },
      },
    },
  });

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    dataController: 'Paisley WinterFest Events Ltd (Fictional Client PoC)',
    gdprBasis: 'Article 15 & 20 — Subject Access & Data Portability',
    personalData: user,
  };

  return new NextResponse(JSON.stringify(exportPayload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="paisley-market-my-data-${session.id}.json"`,
    },
  });
}