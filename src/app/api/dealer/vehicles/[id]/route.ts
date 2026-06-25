import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dealerId = (session.user as any).dealerId;

  const vehicle = await prisma.vehicle.findUnique({ where: { id: params.id } });
  if (!vehicle || vehicle.dealerId !== dealerId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.vehicle.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dealerId = (session.user as any).dealerId;
  const body = await req.json();

  const vehicle = await prisma.vehicle.findUnique({ where: { id: params.id } });
  if (!vehicle || vehicle.dealerId !== dealerId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.vehicle.update({
    where: { id: params.id },
    data: {
      make: body.make ?? undefined,
      model: body.model ?? undefined,
      year: body.year ?? undefined,
      price: body.price ?? undefined,
      mileage: body.mileage ?? undefined,
      transmission: body.transmission ?? undefined,
      fuelType: body.fuelType ?? undefined,
      bodyType: body.bodyType ?? undefined,
      color: body.color ?? undefined,
      description: body.description ?? undefined,
    },
  });

  return NextResponse.json(updated);
}
