import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.coerce.number().min(1990).max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(1),
  mileage: z.coerce.number().min(0),
  transmission: z.enum(["Manual", "Automatic"]),
  fuelType: z.enum(["Petrol", "Diesel", "Hybrid", "Electric"]),
  bodyType: z.string().min(1),
  color: z.string().min(1),
  description: z.string().min(10),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dealerId = (session.user as any).dealerId;
  if (!dealerId) return NextResponse.json({ error: "Not a dealer" }, { status: 403 });

  const dealer = await prisma.dealer.findUnique({
    where: { id: dealerId },
    include: { package: true, subscription: true, _count: { select: { vehicles: { where: { status: { in: ["PENDING", "ACTIVE"] } } } } } },
  });

  if (!dealer || dealer.blocked) return NextResponse.json({ error: "Account blocked" }, { status: 403 });
  if (dealer.status !== "APPROVED") return NextResponse.json({ error: "Account pending approval" }, { status: 403 });

  const limit = dealer.package?.vehicleLimit ?? 0;
  if (dealer._count.vehicles >= limit) {
    return NextResponse.json({ error: `Vehicle limit reached (${limit} max for your package)` }, { status: 400 });
  }

  try {
    const data = schema.parse(await req.json());
    const vehicle = await prisma.vehicle.create({
      data: { ...data, dealerId, status: "PENDING" },
    });
    return NextResponse.json(vehicle);
  } catch (err: any) {
    if (err.name === "ZodError") return NextResponse.json({ error: err.errors }, { status: 422 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
