import mongoose from 'mongoose';

let isConnected = false;

export async function connectDatabase() {
  // 1. Environment variable se URI nikaalein
  const uri = (process.env.MONGO_URI || process.env.MONGODB_URI || "").trim();

  // 2. Agar URI missing hai, toh seedha error throw karein taaki app aage na chale
  if (!uri) {
    console.error('[Database Error] MongoDB Connection String (URI) is missing in environment variables!');
    throw new Error('Database connection failed: No MongoDB URI provided.');
  }

  try {
    console.log('[Database] Connecting to MongoDB database...');
    
    // 3. MongoDB se connect karein (timeout hata diya hai taaki pakka connect ho, ya aap rkh bhi sakte hain)
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // 5 seconds ka timeout diya hai taaki connect hone ka poora mauka mile
    });

    isConnected = true;
    console.log('[Database] MongoDB connection established successfully.');
  } catch (err) {
    // 4. Agar connection fail ho jaye, toh crash/error handle karein, koi fallback nahi
    console.error('[Database Error] Failed to connect to MongoDB:', err.message);
    isConnected = false;
    throw err; // Isse app ko pata chal jayega ki DB connect nahi hua
  }
}

export function getMongooseConnectionState() {
  return isConnected && mongoose.connection.readyState === 1;
}
