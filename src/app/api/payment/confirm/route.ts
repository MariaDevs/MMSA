// Kept for manual activation fallback (e.g. if ITN delayed)
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dealerId = (session.user as any).dealerId;
  const { packageId, paymentId } = await req.json();

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);

  await prisma.dealer.update({
    where: { id: dealerId },
    data: {
      packageId,
      status: "APPROVED",
      subscription: {
        upsert: {
          create: { endDate, active: true, paymentId },
          update: { endDate, active: true, paymentId },
        },
      },
    },
  });

  return NextResponse.json({ success: true });
}
