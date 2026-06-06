import { Car } from '../models/Car.js';

export const DEFAULT_CARS = [
  {
    id: "car_1",
    name: "TOYOTA PRIUS",
    model: "1.8 VVT-i Excel Plug-in Hybrid CVT",
    price: 195,
    weeklyRate: 195,
    deposit: 300,
    depositAmount: 300,
    year: 2021,
    fuel: "Hybrid",
    transmission: "Automatic",
    mileage: "42,500 Miles",
    economy: "78 MPG",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600",
    features: ["ULEZ Compliant", "Reversing Camera", "Satellite Navigation", "Active Cruise Control"],
    specs: ["CO2: 28g/km", "Manchester PCO Registered", "Tax Included", "Free Servicing"],
    category: "Hatchback",
    engine: "1.8L Hybrid Synergy Drive",
    color: "Pearl White",
    description: "The absolute gold-standard of rideshare driving. Boasting incredible fuel-efficiency, a spacious cabin, and full PCO readiness. Weekly price covers all servicing and active licensing.",
    status: "Available"
  },
  {
    id: "car_2",
    name: "NISSAN LEAF",
    model: "160kW Tekna 62kWh EV Auto",
    price: 215,
    weeklyRate: 215,
    deposit: 400,
    depositAmount: 400,
    year: 2022,
    fuel: "Electric",
    transmission: "Automatic",
    mileage: "28,205 Miles",
    economy: "168 MPGe",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600",
    features: ["ULEZ Compliant", "ProPILOT Active Lane Guidance", "360° Intelligent Around View Monitor", "Bose Premium Audio Layout"],
    specs: ["Range: 239 Miles", "Rapid Charge (CHAdeMO)", "Rent-to-Buy Priority Unit", "Routine Tyres Included"],
    category: "Hatchback",
    engine: "160kW Zero-Emission Drive Motor",
    color: "Aurora Blue Metallic",
    description: "Top-tier electric hatchback with generous 62kWh range. Drive Premium luxury and eliminate fuel station stops completely. Comes with our exclusive routine care cover.",
    status: "Available"
  },
  {
    id: "car_3",
    name: "TESLA MODEL 3",
    model: "Dual Motor Long Range AWD Auto",
    price: 340,
    weeklyRate: 340,
    deposit: 750,
    depositAmount: 750,
    year: 2021,
    fuel: "Electric",
    transmission: "Automatic",
    mileage: "35,100 Miles",
    economy: "142 MPGe",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=600",
    features: ["ULEZ Compliant", "Autopilot Fully Activated", "Premium Panoramic Tinted Roof", "Heated Seats on All Rows"],
    specs: ["Range: 340 Miles", "Tesla Supercharger Enabled", "Premium Chauffeur Approved", "Full Fleet Maintenance"],
    category: "Saloon",
    engine: "Dual-Motor Performance EV",
    color: "Solid Black",
    description: "Give your passengers a 5-star experience in the premium Tesla Model 3. Offering maximum comfort, huge driving range, and access to Tesla's industry-leading supercharger grid.",
    status: "Available"
  },
  {
    id: "car_4",
    name: "KIA SPORTAGE",
    model: "1.6 T-GDi GT-Line S PHEV Auto",
    price: 260,
    weeklyRate: 260,
    deposit: 500,
    depositAmount: 500,
    year: 2022,
    fuel: "Hybrid",
    transmission: "Automatic",
    mileage: "19,800 Miles",
    economy: "62 MPG",
    image: "https://images.unsplash.com/photo-1650369247659-1e8281146200?auto=format&fit=crop&q=80&w=600",
    features: ["ULEZ Compliant", "GT-Line Premium Interior Trim", "AWD Smart Drivetrain", "Interactive Driver Display Board"],
    specs: ["Eco-Dynamic PHEV Engine", "Massive Trunk Capacity", "Manufacturer Warranty Retained", "Active Breakdowns Assist"],
    category: "SUV",
    engine: "1.6L Turbo-Charged Plug-In Hybrid",
    color: "Steel Grey Metallic",
    description: "Perfect family-sized luxury SUV that delivers the economy of a hybrid with the road presence of a modern crossover. Ideal for premium rideshare tiers.",
    status: "Available"
  },
  {
    id: "car_5",
    name: "HYUNDAI IONIQ 5",
    model: "168kW Premium 73kWh Auto",
    price: 290,
    weeklyRate: 290,
    deposit: 600,
    depositAmount: 600,
    year: 2022,
    fuel: "Electric",
    transmission: "Automatic",
    mileage: "24,000 Miles",
    economy: "155 MPGe",
    image: "https://images.unsplash.com/photo-1662451731671-55ec36551b9e?auto=format&fit=crop&q=80&w=600",
    features: ["ULEZ Compliant", "Aesthetic Retro-Modern Trim", "800V Charging Matrix", "Rear Cross-Traffic Collisions Defense"],
    specs: ["Range: 282 Miles (WLTP)", "Ultra-Fast Charge (10% to 80% in 18m)", "PCO Registered Driver Unit", "Full Insurance Cover Options"],
    category: "SUV",
    engine: "228PS Electric Rear-Wheel Drive",
    color: "Cyber Grey Matte",
    description: "Next-gen spatial EV with huge rear-seat legroom and flat floors. A favourite for corporate transport and high-value airport runs.",
    status: "Available"
  },
  {
    id: "car_6",
    name: "MG5 EV",
    model: "Exclusive Long Range 61kWh Auto",
    price: 185,
    weeklyRate: 185,
    deposit: 250,
    depositAmount: 250,
    year: 2021,
    fuel: "Electric",
    transmission: "Automatic",
    mileage: "48,600 Miles",
    economy: "125 MPGe",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=600",
    features: ["ULEZ Compliant", "Enormous 578L Estate Boot Space", "Apple CarPlay & Android Auto", "Adaptive Cruise Control Systems"],
    specs: ["Range: 250 Miles", "Weekly Maintenance Routine Covers", "Manchester Private Hire Registered", "Smart Recovery Support"],
    category: "Saloon",
    engine: "115kW Electric Front-Drive Motor",
    color: "Arctic White Glass",
    description: "The workhorse estate built for luxury airport transits. Offers amazing cargo capabilities, quiet electric efficiency, and extremely low rent rates.",
    status: "Available"
  }
];

export async function seedDefaultCars() {
  try {
    const existingCount = await Car.countDocuments();
    console.log(`[Seed system] Current number of vehicles in MongoDB collection: ${existingCount}`);

    if (existingCount === 0) {
      console.log('[Seed system] Cars collection is empty. Auto-seeding 6 default vehicles into MongoDB...');
      await Car.insertMany(DEFAULT_CARS);
      console.log('[Seed system] Success! 6 default vehicles populated correctly inside the database.');
    } else {
      console.log('[Seed system] Skipping database seed: Vehicles already exist in the Cars collection.');
    }
  } catch (err) {
    console.error('[Seed system Error] Auto seeding failed:', err);
  }
}
