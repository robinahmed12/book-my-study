const { ObjectId } = require("mongodb");
const { getDB } = require("../database/db");
const { asyncHandler, AppError } = require("../middlewares/error.middleware");

// ─── GET /api/rooms ────────────────────────────────────────
// Query params: search, minRate, maxRate, capacity, sort, page, limit
const getAllRooms = asyncHandler(async (req, res) => {
  const db = getDB();

  const {
    search = "",
    minRate,
    maxRate,
    capacity,
    sort = "newest",
    page = 1,
    limit = 9,
  } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  // ── Build filter ───────────────────────────────────────
  const filter = {};

  if (search.trim()) {
    filter.$or = [
      { roomName: { $regex: search.trim(), $options: "i" } },
      { description: { $regex: search.trim(), $options: "i" } },
      { amenities: { $elemMatch: { $regex: search.trim(), $options: "i" } } },
    ];
  }

  if (minRate || maxRate) {
    filter.hourlyRate = {};
    if (minRate) filter.hourlyRate.$gte = parseFloat(minRate);
    if (maxRate) filter.hourlyRate.$lte = parseFloat(maxRate);
  }

  if (capacity) {
    filter.capacity = { $gte: parseInt(capacity) };
  }

  // ── Build sort ────────────────────────────────────────
  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { hourlyRate: 1 },
    price_desc: { hourlyRate: -1 },
    popular: { bookingCount: -1 },
    capacity_asc: { capacity: 1 },
    capacity_desc: { capacity: -1 },
  };

  const sortObj = sortOptions[sort] || sortOptions.newest;

  // ── Execute query ─────────────────────────────────────
  const [rooms, total] = await Promise.all([
    db.collection("rooms").find(filter).sort(sortObj).skip(skip).limit(limitNum).toArray(),
    db.collection("rooms").countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  res.status(200).json({
    success: true,
    rooms,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1,
    },
  });
});

// ─── GET /api/rooms/latest ─────────────────────────────────
const getLatestRooms = asyncHandler(async (req, res) => {
  const db = getDB();
  const rooms = await db
    .collection("rooms")
    .find({})
    .sort({ createdAt: -1 })
    .limit(6)
    .toArray();

  res.status(200).json({ success: true, rooms });
});

// ─── GET /api/rooms/:id ────────────────────────────────────
const getRoomById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDB();

  if (!ObjectId.isValid(id)) {
    throw new AppError("Invalid room ID.", 400);
  }

  const room = await db
    .collection("rooms")
    .findOne({ _id: new ObjectId(id) });

  if (!room) {
    throw new AppError("Room not found.", 404);
  }

  // Get owner info (exclude sensitive fields)
  const owner = await db
    .collection("users")
    .findOne(
      { _id: new ObjectId(room.ownerId) },
      { projection: { name: 1, photoURL: 1, email: 1 } }
    );

  res.status(200).json({
    success: true,
    room: { ...room, owner: owner || null },
  });
});

// ─── POST /api/rooms ───────────────────────────────────────
const createRoom = asyncHandler(async (req, res) => {
  const db = getDB();
  const { roomName, description, image, floor, capacity, hourlyRate, amenities } = req.body;

  const newRoom = {
    ownerId: req.user.userId,
    roomName,
    description,
    image,
    floor,
    capacity: parseInt(capacity),
    hourlyRate: parseFloat(hourlyRate),
    amenities,
    bookingCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("rooms").insertOne(newRoom);

  res.status(201).json({
    success: true,
    message: "Room created successfully",
    roomId: result.insertedId,
    room: { ...newRoom, _id: result.insertedId },
  });
});

// ─── PATCH /api/rooms/:id ──────────────────────────────────
const updateRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDB();

  if (!ObjectId.isValid(id)) {
    throw new AppError("Invalid room ID.", 400);
  }

  const room = await db.collection("rooms").findOne({ _id: new ObjectId(id) });

  if (!room) {
    throw new AppError("Room not found.", 404);
  }

  if (room.ownerId !== req.user.userId) {
    throw new AppError("You are not authorized to update this room.", 403);
  }

  const allowedFields = [
    "roomName", "description", "image", "floor",
    "capacity", "hourlyRate", "amenities",
  ];

  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (updates.capacity) updates.capacity = parseInt(updates.capacity);
  if (updates.hourlyRate) updates.hourlyRate = parseFloat(updates.hourlyRate);
  updates.updatedAt = new Date();

  const result = await db
    .collection("rooms")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: "after" }
    );

  res.status(200).json({
    success: true,
    message: "Room updated successfully",
    room: result,
  });
});

// ─── DELETE /api/rooms/:id ─────────────────────────────────
const deleteRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDB();

  if (!ObjectId.isValid(id)) {
    throw new AppError("Invalid room ID.", 400);
  }

  const room = await db.collection("rooms").findOne({ _id: new ObjectId(id) });

  if (!room) {
    throw new AppError("Room not found.", 404);
  }

  if (room.ownerId !== req.user.userId) {
    throw new AppError("You are not authorized to delete this room.", 403);
  }

  // Check for active bookings
  const activeBookings = await db.collection("bookings").countDocuments({
    roomId: id,
    status: "confirmed",
    date: { $gte: new Date().toISOString().split("T")[0] },
  });

  if (activeBookings > 0) {
    throw new AppError(
      `Cannot delete this room. It has ${activeBookings} upcoming confirmed booking(s).`,
      409
    );
  }

  await db.collection("rooms").deleteOne({ _id: new ObjectId(id) });

  // Cascade: cancel related future bookings
  await db.collection("bookings").updateMany(
    { roomId: id, date: { $gte: new Date().toISOString().split("T")[0] } },
    { $set: { status: "cancelled", cancelledAt: new Date() } }
  );

  res.status(200).json({
    success: true,
    message: "Room deleted successfully",
  });
});

// ─── GET /api/rooms/my-listings ───────────────────────────
const getMyListings = asyncHandler(async (req, res) => {
  const db = getDB();
  const rooms = await db
    .collection("rooms")
    .find({ ownerId: req.user.userId })
    .sort({ createdAt: -1 })
    .toArray();

  res.status(200).json({ success: true, rooms });
});

module.exports = {
  getAllRooms,
  getLatestRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getMyListings,
};
