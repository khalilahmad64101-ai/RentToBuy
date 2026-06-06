import mongoose from 'mongoose';

let isConnected = false;

export async function connectDatabase() {
  const uri = (process.env.MONGO_URI || process.env.MONGODB_URI || "").trim();
  if (!uri) {
    console.error("==============================================================");
    console.error("[DATABASE CONNECT ERROR] MONGO_URI environment variable is missing!");
    console.error("Please configure the MONGO_URI or MONGODB_URI secret.");
    console.error("==============================================================");
    return;
  }

  try {
    console.log('[Database] Attempting connection to MongoDB Atlas or local deployment...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('[Database] MongoDB Atlas connection established successfully!');
  } catch (err) {
    console.error('[Database Connect Fail] Mongoose connect issue:', err);
    console.warn('[Database Fallback Warning] Server will start but queries may fail until MONGO_URI is valid.');
  }
}

export function getMongooseConnectionState() {
  return isConnected && mongoose.connection.readyState === 1;
}
