export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyITN } from "@/lib/payfast";

// PayFast ITN (Instant Transaction Notification) handler
export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = Object.fromEntries(new URLSearchParams(body));

  // Verify signature
  if (!verifyITN(params)) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const { payment_status, custom_str1: dealerId, custom_str2: packageId } = params;

  if (payment_status !== "COMPLETE") {
    return new NextResponse("OK", { status: 200 });
  }

  if (!dealerId || !packageId) {
    return new NextResponse("Missing params", { status: 400 });
  }

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);

  await prisma.dealer.update({
    where: { id: dealerId },
    data: {
      packageId,
      status: "APPROVED",
      subscription: {
        upsert: {
          create: {
            endDate,
            active: true,
            paymentId: params.pf_payment_id,
          },
          update: {
            endDate,
            active: true,
            paymentId: params.pf_payment_id,
          },
        },
      },
    },
  });

  return new NextResponse("OK", { status: 200 });
}
