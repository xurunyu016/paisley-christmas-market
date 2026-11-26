import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await context.params;
  const body = await req.json();
  const status = body.status as string;
  const adminNotes = (body.adminNotes as string) || null;
  const publishAsStall = Boolean(body.publishAsStall);

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const updated = await prisma.traderApplication.update({
    where: { id },
    data: { status, adminNotes },
  });

  // 亮点功能：管理员审批通过并勾选自动发布时，直接在前台创建对应的木屋摊位
  if (status === 'approved' && publishAsStall) {
    const count = await prisma.stall.count();
    await prisma.stall.create({
      data: {
        name: updated.businessName,
        category: updated.category,
        description: updated.description,
        chaletNumber: `P-${String(count + 1).padStart(2, '0')}`,
        priceRange: '££',
        zoneId: updated.zoneId,
      },
    });
  }

  return NextResponse.json({ application: updated });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await context.params;
  await prisma.traderApplication.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}