import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL!);

async function testConnection() {
  try {
    await db.execute("select 1");
    console.log("✅ Drizzle client connected successfully");
  } catch (error) {
    console.error("❌ Drizzle connection failed:", error);
    process.exit(1);
  }
}

testConnection();
