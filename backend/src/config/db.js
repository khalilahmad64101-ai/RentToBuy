// TEMPORARILY DISABLED MONGODB
// TODO: Re-enable MongoDB before production deployment
/*
import mongoose from 'mongoose';

let isConnected = false;

export async function connectDatabase() {
  const uri = (process.env.MONGO_URI || process.env.MONGODB_URI || "").trim();
  if (!uri) {
    console.log('[Database] Active Storage: Local file-system and memory engine (JSON simulated fallback database).');
    return;
  }

  try {
    console.log('[Database] Connecting to MongoDB database...');
    // Simple 2s timeout to prevent hanging startup
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log('[Database] MongoDB connection established successfully.');
  } catch (err) {
    console.log('[Database] Storage: Under backup fallback mode. Local file-system storage active.');
  }
}

export function getMongooseConnectionState() {
  return isConnected && mongoose.connection.readyState === 1;
}
*/

// TEMPORARILY DISABLED MONGODB
// TODO: Re-enable MongoDB before production deployment
export async function connectDatabase() {
  console.log('[Database] Active Storage: Local file-system and memory engine (JSON simulated fallback database). [MONGODB TEMPORARILY DISABLED]');
  return;
}

export function getMongooseConnectionState() {
  return false;
}

