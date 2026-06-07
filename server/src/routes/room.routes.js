const express = require("express");
const router = express.Router();
const {
  getAllRooms,
  getLatestRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getMyListings,
} = require("../controllers/room.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { validate, createRoomSchema, updateRoomSchema } = require("../validations/schemas");

// GET /api/rooms/latest (must be before /:id)
router.get("/latest", getLatestRooms);

// GET /api/rooms/my-listings (protected)
router.get("/my-listings", verifyToken, getMyListings);

// GET /api/rooms
router.get("/", getAllRooms);

// GET /api/rooms/:id
router.get("/:id", getRoomById);

// POST /api/rooms (protected)
router.post("/", verifyToken, validate(createRoomSchema), createRoom);

// PATCH /api/rooms/:id (protected)
router.patch("/:id", verifyToken, validate(updateRoomSchema), updateRoom);

// DELETE /api/rooms/:id (protected)
router.delete("/:id", verifyToken, deleteRoom);

module.exports = router;
