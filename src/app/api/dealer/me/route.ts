export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dealerId = (session.user as any).dealerId;
  if (!dealerId) return NextResponse.json({ error: "Not a dealer" }, { status: 403 });

  const dealer = await prisma.dealer.findUnique({
    where: { id: dealerId },
    include: {
      user: { select: { email: true } },
      package: true,
      subscription: true,
      vehicles: { orderBy: { createdAt: "desc" } },
    },
  });

  return NextResponse.json(dealer);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dealerId = (session.user as any).dealerId;
  const body = await req.json();

  const updated = await prisma.dealer.update({
    where: { id: dealerId },
    data: {
      businessName: body.businessName ?? undefined,
      contactName: body.contactName ?? undefined,
      phone: body.phone ?? undefined,
      location: body.location ?? undefined,
      province: body.province ?? undefined,
      description: body.description ?? undefined,
    },
  });

  return NextResponse.json(updated);
}
