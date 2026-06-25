export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: "ACTIVE" },
    include: { dealer: { select: { businessName: true, location: true, phone: true, status: true, blocked: true } } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(vehicles);
}
