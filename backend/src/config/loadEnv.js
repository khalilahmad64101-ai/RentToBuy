import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Find and evaluate .env before any subsequent import or configuration module runs
const envPath = fs.existsSync(path.resolve(process.cwd(), ".env")) 
  ? path.resolve(process.cwd(), ".env")
  : fs.existsSync(path.resolve(process.cwd(), "backend", ".env"))
    ? path.resolve(process.cwd(), "backend", ".env")
    : null;

if (envPath) {
  dotenv.config({ path: envPath });
  console.log(`[LOAD-ENV] Environment variables loaded from file: ${envPath}`);
} else {
  dotenv.config();
  console.log("[LOAD-ENV] No local .env file found. Utilizing system platform environment variables.");
}

// Immediately sanitize surrounding quotes or spacing on core Cloudinary credentials if present
const requiredEnvs = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
const sanitizeValue = (val) => {
  if (!val) return val;
  return val.trim().replace(/^['"]|['"]$/g, "").trim();
};

for (const key of requiredEnvs) {
  if (process.env[key]) {
    process.env[key] = sanitizeValue(process.env[key]);
  }
}

// To prevent any conflicting automatic parsing by Cloudinary's SDK, completely remove CLOUDINARY_URL if it is present.
// This forces Cloudinary to strictly use CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.
if (process.env.CLOUDINARY_URL) {
  delete process.env.CLOUDINARY_URL;
  console.log("[LOAD-ENV] Completely cleared process.env.CLOUDINARY_URL to prevent override signature conflicts.");
}
