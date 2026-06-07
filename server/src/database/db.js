const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

const client = new MongoClient(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("studynook");

    console.log("✅ Connected to MongoDB Atlas");

    await createIndexes();

    return db;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
}

async function createIndexes() {
  try {
    // ─── Users collection indexes ──────────────────────────
    await db.collection("users").createIndexes([
      { key: { email: 1 }, unique: true, name: "email_unique" },
      { key: { createdAt: -1 }, name: "created_desc" },
    ]);

    // ─── Rooms collection indexes ──────────────────────────
    await db.collection("rooms").createIndexes([
      { key: { ownerId: 1 }, name: "owner_id" },
      { key: { createdAt: -1 }, name: "created_desc" },
      { key: { hourlyRate: 1 }, name: "hourly_rate" },
      { key: { capacity: 1 }, name: "capacity" },
      { key: { bookingCount: -1 }, name: "booking_count_desc" },
      {
        key: { roomName: "text", description: "text" },
        name: "room_text_search",
      },
    ]);

    // ─── Bookings collection indexes ───────────────────────
    await db.collection("bookings").createIndexes([
      { key: { roomId: 1 }, name: "room_id" },
      { key: { userId: 1 }, name: "user_id" },
      { key: { date: 1, roomId: 1 }, name: "date_room_compound" },
      { key: { status: 1 }, name: "status" },
      { key: { createdAt: -1 }, name: "created_desc" },
      // Compound index for conflict detection queries
      {
        key: { roomId: 1, date: 1, startTime: 1, endTime: 1 },
        name: "conflict_detection",
      },
    ]);

    console.log("✅ MongoDB indexes created/verified");
  } catch (error) {
    console.error("⚠️  Index creation warning:", error.message);
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB() first.");
  }
  return db;
}

async function closeDB() {
  await client.close();
  console.log("🔌 MongoDB connection closed");
}

module.exports = { connectDB, getDB, closeDB };
