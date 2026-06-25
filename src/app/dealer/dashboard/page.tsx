import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DealerDashboardClient from "./DealerDashboardClient";

export default async function DealerDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/dealer/login");
  if ((session.user as any).role === "ADMIN") redirect("/admin");
  return <DealerDashboardClient />;
}
