import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// ✅ POINT TO BACKEND .env DYNAMICALLY
const envPath = fs.existsSync(path.resolve(process.cwd(), ".env")) 
  ? path.resolve(process.cwd(), ".env")
  : path.resolve(process.cwd(), "backend", ".env");

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`[ENV] Loaded environmental file successfully from: ${envPath}`);
} else {
  console.log("[ENV ERROR] .env file not found!");
}

import { connectDatabase } from "./src/config/db.js";
import { seedDefaultCars } from "./src/config/seed.js";
import { createApp } from "./src/app.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDatabase();
  await seedDefaultCars();

  const app = await createApp();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Running on port ${PORT}`);

  });
}

startServer().catch((err) => {
  console.error("[FATAL ERROR]", err);
});