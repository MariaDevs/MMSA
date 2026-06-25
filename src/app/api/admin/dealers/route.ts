export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

function adminOnly(session: any) {
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const guard = adminOnly(session);
  if (guard) return guard;

  const dealers = await prisma.dealer.findMany({
    include: {
      user: { select: { id: true, email: true, createdAt: true } },
      package: true,
      subscription: true,
      _count: { select: { vehicles: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(dealers);
}

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  businessName: z.string().min(2),
  contactName: z.string().min(2),
  phone: z.string().min(10),
  location: z.string().min(2),
  province: z.string(),
  description: z.string().optional(),
  packageId: z.string().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const guard = adminOnly(session);
  if (guard) return guard;

  try {
    const data = createSchema.parse(await req.json());

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

    const hashed = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        role: "DEALER",
        dealer: {
          create: {
            businessName: data.businessName,
            contactName: data.contactName,
            phone: data.phone,
            location: data.location,
            province: data.province,
            description: data.description ?? "",
            packageId: data.packageId,
            status: data.status ?? "APPROVED",
          },
        },
      },
      include: { dealer: true },
    });

    return NextResponse.json(user.dealer);
  } catch (err: any) {
    if (err.name === "ZodError") return NextResponse.json({ error: err.errors }, { status: 422 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
