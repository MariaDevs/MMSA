export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: "Manual" | "Automatic";
  fuelType: "Petrol" | "Diesel" | "Hybrid" | "Electric";
  bodyType: string;
  color: string;
  description: string;
  images: string[];
  dealerName: string;
  dealerLocation: string;
  dealerPhone: string;
  featured: boolean;
};

export type DealerPackage = {
  id: string;
  name: string;
  vehicleLimit: number;
  durationDays: number;
  price: number;
  description: string;
  popular?: boolean;
};

export const PACKAGES: DealerPackage[] = [
  {
    id: "starter",
    name: "Starter Dealer",
    vehicleLimit: 20,
    durationDays: 30,
    price: 0,
    description: "Suitable for small dealers or testing the platform",
  },
  {
    id: "growth",
    name: "Growth Dealer",
    vehicleLimit: 40,
    durationDays: 30,
    price: 0,
    description: "Ideal for active dealerships with regular stock",
    popular: true,
  },
  {
    id: "professional",
    name: "Professional Dealer",
    vehicleLimit: 60,
    durationDays: 30,
    price: 0,
    description: "Best for established dealers with larger inventory",
  },
  {
    id: "enterprise",
    name: "Enterprise Dealer",
    vehicleLimit: 200,
    durationDays: 30,
    price: 0,
    description: "For large dealerships and high-volume vehicle sellers",
  },
];

export const SAMPLE_VEHICLES: Vehicle[] = [
  {
    id: "1",
    make: "Toyota",
    model: "Hilux 2.8 GD-6",
    year: 2022,
    price: 650000,
    mileage: 35000,
    transmission: "Automatic",
    fuelType: "Diesel",
    bodyType: "Bakkie",
    color: "White",
    description: "Well-maintained Toyota Hilux 2.8 GD-6 4x4 Double Cab. Full service history. One owner.",
    images: ["/images/placeholder-car.jpg"],
    dealerName: "ABC Motors",
    dealerLocation: "Johannesburg, GP",
    dealerPhone: "+27 11 000 0000",
    featured: true,
  },
  {
    id: "2",
    make: "BMW",
    model: "320i Sport Line",
    year: 2021,
    price: 480000,
    mileage: 42000,
    transmission: "Automatic",
    fuelType: "Petrol",
    bodyType: "Sedan",
    color: "Black",
    description: "BMW 320i Sport Line in excellent condition. Full BMW service history. Accident-free.",
    images: ["/images/placeholder-car.jpg"],
    dealerName: "Premium Auto SA",
    dealerLocation: "Cape Town, WC",
    dealerPhone: "+27 21 000 0000",
    featured: true,
  },
  {
    id: "3",
    make: "Volkswagen",
    model: "Polo Vivo 1.4 Comfortline",
    year: 2023,
    price: 190000,
    mileage: 12000,
    transmission: "Manual",
    fuelType: "Petrol",
    bodyType: "Hatchback",
    color: "Silver",
    description: "Almost new Polo Vivo. Still under manufacturer warranty. Low mileage.",
    images: ["/images/placeholder-car.jpg"],
    dealerName: "VW Specialists",
    dealerLocation: "Pretoria, GP",
    dealerPhone: "+27 12 000 0000",
    featured: true,
  },
  {
    id: "4",
    make: "Ford",
    model: "Ranger 3.2 XLT",
    year: 2020,
    price: 420000,
    mileage: 68000,
    transmission: "Automatic",
    fuelType: "Diesel",
    bodyType: "Bakkie",
    color: "Blue",
    description: "Ford Ranger XLT 4x4 with canopy. Service history available. Well looked after.",
    images: ["/images/placeholder-car.jpg"],
    dealerName: "Durban Auto Hub",
    dealerLocation: "Durban, KZN",
    dealerPhone: "+27 31 000 0000",
    featured: true,
  },
  {
    id: "5",
    make: "Mercedes-Benz",
    model: "C200 AMG Line",
    year: 2021,
    price: 720000,
    mileage: 28000,
    transmission: "Automatic",
    fuelType: "Petrol",
    bodyType: "Sedan",
    color: "Grey",
    description: "Stunning Mercedes-Benz C200 AMG Line. Full service history. All original.",
    images: ["/images/placeholder-car.jpg"],
    dealerName: "Luxury Cars SA",
    dealerLocation: "Sandton, GP",
    dealerPhone: "+27 11 000 0001",
    featured: true,
  },
  {
    id: "6",
    make: "Hyundai",
    model: "Tucson 2.0 Premium",
    year: 2022,
    price: 380000,
    mileage: 31000,
    transmission: "Automatic",
    fuelType: "Petrol",
    bodyType: "SUV",
    color: "White",
    description: "Hyundai Tucson in top condition. Panoramic roof, leather seats, navigation.",
    images: ["/images/placeholder-car.jpg"],
    dealerName: "Hyundai Central",
    dealerLocation: "Port Elizabeth, EC",
    dealerPhone: "+27 41 000 0000",
    featured: false,
  },
];
