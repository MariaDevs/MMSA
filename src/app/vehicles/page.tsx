import { Suspense } from "react";
import VehiclesClient from "./VehiclesClient";

export const metadata = {
  title: "Browse Vehicles | MotorsMarket SA",
  description: "Search thousands of quality used vehicles from verified dealers across South Africa.",
};

export default function VehiclesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-poppins text-gray-500">Loading vehicles...</div>}>
      <VehiclesClient />
    </Suspense>
  );
}
