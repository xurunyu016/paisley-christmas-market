import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { clearSessionCookie, getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
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
        include: { zone: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return NextResponse.json({ user });
}

// GDPR Article 17: Right to Erasure
export async function DELETE() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  if (session.role === 'admin') {
    return NextResponse.json(
      { error: 'Demo administrator account cannot be deleted to preserve platform access.' },
      { status: 403 }
    );
  }

  // 删除关联申请并彻底清除用户个人记录
  await prisma.traderApplication.deleteMany({ where: { userId: session.id } });
  await prisma.user.delete({ where: { id: session.id } });
  await clearSessionCookie();

  return NextResponse.json({ message: 'Your account and personal data have been permanently erased.' });
}