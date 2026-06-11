// ✅ CLOUDINARY ENVIRONMENT CONFIGURATION VALIDATION
const requiredEnvs = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET"
];

const missingEnvs = requiredEnvs.filter((key) => !process.env[key]);

if (missingEnvs.length > 0) {
  console.error("\n======================================================================");
  console.error("❌ [FATAL CONFIG ERROR] MISSING REQUIRED CLOUDINARY CONFIGURATIONS!");
  console.error(`Missing keys: ${missingEnvs.join(", ")}`);
  console.error("Please provide these values in your workspace settings / environment.");
  console.error("======================================================================\n");
  process.exit(1);
} else {
  console.log("[ENV] Cloudinary configurations verified successfully: All 3 core variables are active.");
}
