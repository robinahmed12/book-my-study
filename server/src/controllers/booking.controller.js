const { ObjectId } = require("mongodb");
const { getDB } = require("../database/db");
const { asyncHandler, AppError } = require("../middlewares/error.middleware");

/**
 * ─── Booking Conflict Detection Algorithm ─────────────────
 *
 * Existing: 10:00 - 12:00
 * Reject:   11:00 - 13:00  (overlaps)
 * Accept:   12:00 - 14:00  (back-to-back OK)
 * Accept:   08:00 - 10:00  (before OK)
 *
 * Overlap condition:
 *   newStart < existingEnd AND newEnd > existingStart
 *
 * Using time strings (HH:MM) and lexicographic comparison,
 * which works correctly for 00:00-23:59 range.
 */
async function checkBookingConflict(db, roomId, date, startTime, endTime, excludeBookingId = null) {
  const filter = {
    roomId,
    date,
    status: { $in: ["confirmed", "pending"] },
    // Overlap: newStart < existEnd AND newEnd > existStart
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  };

  if (excludeBookingId) {
    filter._id = { $ne: new ObjectId(excludeBookingId) };
  }

  const conflict = await db.collection("bookings").findOne(filter);
  return conflict;
}

/**
 * Calculate booking duration in hours
 */
function calculateDurationHours(startTime, endTime) {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  return ((eh * 60 + em) - (sh * 60 + sm)) / 60;
}

// ─── POST /api/bookings ────────────────────────────────────
const createBooking = asyncHandler(async (req, res) => {
  const { roomId, date, startTime, endTime, note } = req.body;
  const db = getDB();

  // 1. Verify room exists
  if (!ObjectId.isValid(roomId)) {
    throw new AppError("Invalid room ID.", 400);
  }

  const room = await db
    .collection("rooms")
    .findOne({ _id: new ObjectId(roomId) });

  if (!room) {
    throw new AppError("Room not found.", 404);
  }

  // 2. Prevent owner from booking their own room
  if (room.ownerId === req.user.userId) {
    throw new AppError("You cannot book your own room.", 400);
  }

  // 3. Check for conflicts
  const conflict = await checkBookingConflict(db, roomId, date, startTime, endTime);

  if (conflict) {
    throw new AppError(
      `This time slot is not available. The room is already booked from ${conflict.startTime} to ${conflict.endTime}.`,
      409
    );
  }

  // 4. Calculate total cost
  const durationHours = calculateDurationHours(startTime, endTime);
  const totalCost = parseFloat((durationHours * room.hourlyRate).toFixed(2));

  // 5. Create booking
  const newBooking = {
    roomId,
    roomName: room.roomName,
    roomImage: room.image,
    userId: req.user.userId,
    userName: req.user.name,
    date,
    startTime,
    endTime,
    durationHours,
    totalCost,
    note: note || "",
    status: "confirmed",
    createdAt: new Date(),
  };

  const result = await db.collection("bookings").insertOne(newBooking);

  // 6. Increment room booking count
  await db
    .collection("rooms")
    .updateOne({ _id: new ObjectId(roomId) }, { $inc: { bookingCount: 1 } });

  // 7. Add booking reference to user
  await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(req.user.userId) },
      { $push: { bookings: result.insertedId.toString() } }
    );

  res.status(201).json({
    success: true,
    message: "Room booked successfully!",
    booking: { ...newBooking, _id: result.insertedId },
  });
});

// ─── GET /api/bookings/my ──────────────────────────────────
const getMyBookings = asyncHandler(async (req, res) => {
  const db = getDB();
  const { status, page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const filter = { userId: req.user.userId };
  if (status) filter.status = status;

  const [bookings, total] = await Promise.all([
    db
      .collection("bookings")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .toArray(),
    db.collection("bookings").countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    bookings,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// ─── GET /api/bookings/room/:roomId/availability ───────────
// Check available slots for a given date
const getRoomAvailability = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { date } = req.query;
  const db = getDB();

  if (!date) {
    throw new AppError("Date query parameter is required.", 400);
  }

  const bookings = await db
    .collection("bookings")
    .find(
      {
        roomId,
        date,
        status: { $in: ["confirmed", "pending"] },
      },
      { projection: { startTime: 1, endTime: 1, status: 1 } }
    )
    .sort({ startTime: 1 })
    .toArray();

  res.status(200).json({
    success: true,
    bookedSlots: bookings,
  });
});

// ─── PATCH /api/bookings/:id/cancel ───────────────────────
const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const db = getDB();

  if (!ObjectId.isValid(id)) {
    throw new AppError("Invalid booking ID.", 400);
  }

  const booking = await db
    .collection("bookings")
    .findOne({ _id: new ObjectId(id) });

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  if (booking.userId !== req.user.userId) {
    throw new AppError("You are not authorized to cancel this booking.", 403);
  }

  if (booking.status === "cancelled") {
    throw new AppError("This booking is already cancelled.", 400);
  }

  // Prevent cancelling past bookings
  const bookingDateTime = new Date(`${booking.date}T${booking.startTime}`);
  if (bookingDateTime <= new Date()) {
    throw new AppError("Cannot cancel a booking that has already started or passed.", 400);
  }

  await db
    .collection("bookings")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "cancelled", cancelledAt: new Date() } }
    );

  // Decrement room booking count
  await db
    .collection("rooms")
    .updateOne({ _id: new ObjectId(booking.roomId) }, { $inc: { bookingCount: -1 } });

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
  });
});

module.exports = {
  createBooking,
  getMyBookings,
  getRoomAvailability,
  cancelBooking,
};
