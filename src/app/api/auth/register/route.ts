export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  businessName: z.string().min(2),
  contactName: z.string().min(2),
  phone: z.string().min(10),
  location: z.string().min(2),
  province: z.string().min(2),
  description: z.string().optional(),
  packageId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

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
            description: data.description,
            packageId: data.packageId,
            status: "PENDING",
          },
        },
      },
      include: { dealer: true },
    });

    return NextResponse.json({ success: true, dealerId: user.dealer?.id });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data", issues: err.errors }, { status: 422 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
