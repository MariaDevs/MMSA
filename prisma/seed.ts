import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed packages
  const packages = [
    { id: "starter", name: "Starter Dealer", vehicleLimit: 20, durationDays: 30, price: 299, description: "Suitable for small dealers or testing the platform" },
    { id: "growth", name: "Growth Dealer", vehicleLimit: 40, durationDays: 30, price: 499, description: "Ideal for active dealerships with regular stock" },
    { id: "professional", name: "Professional Dealer", vehicleLimit: 60, durationDays: 30, price: 799, description: "Best for established dealers with larger inventory" },
    { id: "enterprise", name: "Enterprise Dealer", vehicleLimit: 200, durationDays: 30, price: 1499, description: "For large dealerships and high-volume vehicle sellers" },
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { id: pkg.id },
      update: pkg,
      create: pkg,
    });
  }

  // Seed admin user
  const adminPassword = await bcrypt.hash("admin@MMSA2024!", 12);
  await prisma.user.upsert({
    where: { email: "admin@motormarketsa.co.za" },
    update: {},
    create: {
      email: "admin@motormarketsa.co.za",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Seed demo dealer
  const dealerPassword = await bcrypt.hash("dealer123!", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@abcmotors.co.za" },
    update: {},
    create: {
      email: "demo@abcmotors.co.za",
      password: dealerPassword,
      role: "DEALER",
    },
  });

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);

  await prisma.dealer.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      businessName: "ABC Motors",
      contactName: "John Smith",
      phone: "+27 11 000 0000",
      location: "Johannesburg",
      province: "Gauteng",
      description: "Premium pre-owned vehicles in Johannesburg",
      status: "APPROVED",
      packageId: "growth",
      subscription: {
        create: { endDate, active: true },
      },
      vehicles: {
        create: [
          { make: "Toyota", model: "Hilux 2.8 GD-6", year: 2022, price: 650000, mileage: 35000, transmission: "Automatic", fuelType: "Diesel", bodyType: "Bakkie", color: "White", description: "Well-maintained Toyota Hilux 4x4. Full service history.", status: "ACTIVE", featured: true },
          { make: "BMW", model: "320i Sport Line", year: 2021, price: 480000, mileage: 42000, transmission: "Automatic", fuelType: "Petrol", bodyType: "Sedan", color: "Black", description: "BMW 320i in excellent condition.", status: "ACTIVE", featured: true },
        ],
      },
    },
  });

  console.log("✅ Database seeded successfully");
  console.log("👤 Admin: admin@motormarketsa.co.za / admin@MMSA2024!");
  console.log("🚗 Demo dealer: demo@abcmotors.co.za / dealer123!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
