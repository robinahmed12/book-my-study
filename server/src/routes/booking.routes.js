const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getRoomAvailability,
  cancelBooking,
} = require("../controllers/booking.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { validate, createBookingSchema } = require("../validations/schemas");

// All booking routes require authentication
router.use(verifyToken);

// POST /api/bookings
router.post("/", validate(createBookingSchema), createBooking);

// GET /api/bookings/my
router.get("/my", getMyBookings);

// GET /api/bookings/room/:roomId/availability
router.get("/room/:roomId/availability", getRoomAvailability);

// PATCH /api/bookings/:id/cancel
router.patch("/:id/cancel", cancelBooking);

module.exports = router;
