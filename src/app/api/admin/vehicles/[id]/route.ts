export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function adminGuard(session: any) {
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const g = await adminGuard(session);
  if (g) return g;

  const { status, featured } = await req.json();

  const vehicle = await prisma.vehicle.update({
    where: { id: params.id },
    data: {
      status: status ?? undefined,
      featured: featured ?? undefined,
    },
  });

  return NextResponse.json(vehicle);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const g = await adminGuard(session);
  if (g) return g;

  await prisma.vehicle.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
