import mongoose from "mongoose";
import dns from "dns";

// Force Google DNS — Windows loopback (127.0.0.1) blocks SRV record lookups
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("Add MONGODB_URI to .env.local");

let cached = global.mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  cached.promise = cached.promise || mongoose.connect(MONGODB_URI);
  cached.conn = await cached.promise;
  return cached.conn;
}
