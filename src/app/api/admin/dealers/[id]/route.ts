export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

async function guard(session: any) {
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const g = await guard(session);
  if (g) return g;

  const dealer = await prisma.dealer.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, email: true, createdAt: true } },
      package: true,
      subscription: true,
      vehicles: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!dealer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(dealer);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const g = await guard(session);
  if (g) return g;

  const body = await req.json();

  const dealer = await prisma.dealer.findUnique({
    where: { id: params.id },
    include: { user: true },
  });
  if (!dealer) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Handle password change
  if (body.newPassword) {
    const hashed = await bcrypt.hash(body.newPassword, 12);
    await prisma.user.update({ where: { id: dealer.userId }, data: { password: hashed } });
  }

  // Handle email change
  if (body.email && body.email !== dealer.user.email) {
    await prisma.user.update({ where: { id: dealer.userId }, data: { email: body.email } });
  }

  // Handle package upgrade/downgrade + extend subscription
  if (body.packageId) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    await prisma.subscription.upsert({
      where: { dealerId: params.id },
      update: { endDate, active: true },
      create: { dealerId: params.id, endDate, active: true },
    });
  }

  const updated = await prisma.dealer.update({
    where: { id: params.id },
    data: {
      businessName: body.businessName ?? undefined,
      contactName: body.contactName ?? undefined,
      phone: body.phone ?? undefined,
      location: body.location ?? undefined,
      province: body.province ?? undefined,
      description: body.description ?? undefined,
      status: body.status ?? undefined,
      blocked: body.blocked ?? undefined,
      packageId: body.packageId ?? undefined,
    },
    include: {
      user: { select: { id: true, email: true } },
      package: true,
      subscription: true,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const g = await guard(session);
  if (g) return g;

  const dealer = await prisma.dealer.findUnique({ where: { id: params.id } });
  if (!dealer) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.user.delete({ where: { id: dealer.userId } });
  return NextResponse.json({ success: true });
}
