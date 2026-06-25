import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dealerId = (session.user as any).dealerId;
  if (!dealerId) return NextResponse.json({ error: "Not a dealer" }, { status: 403 });

  const { packageId } = await req.json();

  const pkg = await prisma.package.findUnique({ where: { id: packageId } });
  if (!pkg) return NextResponse.json({ error: "Package not found" }, { status: 404 });

  const amountInCents = Math.round(pkg.price * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "zar",
    metadata: { dealerId, packageId },
    description: `MotorsMarket SA — ${pkg.name} (${pkg.vehicleLimit} vehicles / 30 days)`,
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret, amount: pkg.price, packageName: pkg.name });
}
