import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const vehicles = await prisma.vehicle.findMany({
    include: { dealer: { select: { businessName: true, location: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(vehicles);
}
