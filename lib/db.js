import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("MONGODB_URI não definido. Usando MongoDB local para desenvolvimento.");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Se não há MONGODB_URI, usar MongoDB local
    const connectionString = MONGODB_URI || "mongodb://localhost:27017/personal-finance";
    
    cached.promise = mongoose.connect(connectionString, opts).then((mongoose) => {
      console.log("✅ Conectado ao MongoDB");
      return mongoose;
    }).catch((error) => {
      console.error("❌ Erro ao conectar com MongoDB:", error.message);
      throw error;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
