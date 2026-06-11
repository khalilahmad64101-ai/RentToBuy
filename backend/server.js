import "./src/config/loadEnv.js";
import "./src/config/env.js";

import { connectDatabase } from "./src/config/db.js";
import { seedDefaultCars } from "./src/config/seed.js";
import { createApp } from "./src/app.js";
import { startReminderScheduler, verifySMTPOnStartup } from "./src/utils/notifier.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDatabase();
  await seedDefaultCars();

  const app = await createApp();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Running on port ${PORT}`);
    
    // Verify Nodemailer SMTP transmission connection channel on startup
    verifySMTPOnStartup().catch((err) => {
      console.error("[SERVER] Failed to execute SMTP startup verification check:", err);
    });
    
    // Start lease deposit payment background cron scheduler daemon
    startReminderScheduler();
  });
}

startServer().catch((err) => {
  console.error("[FATAL ERROR]", err);
});