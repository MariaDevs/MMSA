export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildPayFastData, getPayFastUrl } from "@/lib/payfast";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dealerId = (session.user as any).dealerId;
  if (!dealerId) return NextResponse.json({ error: "Not a dealer" }, { status: 403 });

  const { packageId } = await req.json();

  const [pkg, dealer] = await Promise.all([
    prisma.package.findUnique({ where: { id: packageId } }),
    prisma.dealer.findUnique({
      where: { id: dealerId },
      include: { user: { select: { email: true } } },
    }),
  ]);

  if (!pkg) return NextResponse.json({ error: "Package not found" }, { status: 404 });
  if (!dealer) return NextResponse.json({ error: "Dealer not found" }, { status: 404 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const pfData = buildPayFastData({
    dealerId,
    packageId,
    packageName: pkg.name,
    amount: pkg.price,
    dealerEmail: dealer.user.email,
    dealerName: dealer.businessName,
    returnUrl: `${appUrl}/payment/success`,
    cancelUrl: `${appUrl}/payment/cancel`,
    notifyUrl: `${appUrl}/api/payment/notify`,
  });

  return NextResponse.json({
    payFastUrl: getPayFastUrl(),
    data: pfData,
    amount: pkg.price,
    packageName: pkg.name,
  });
}
