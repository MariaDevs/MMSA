import { Suspense } from "react";
import DealerRegisterClient from "./DealerRegisterClient";

export const metadata = {
  title: "Register as Dealer | MotorsMarket SA",
};

export default function DealerRegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <DealerRegisterClient />
    </Suspense>
  );
}
