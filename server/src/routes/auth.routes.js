const express = require("express");
const router = express.Router();
const { register, login, googleAuth, logout, getMe } = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { validate, registerSchema, loginSchema, googleAuthSchema } = require("../validations/schemas");

// POST /api/auth/register
router.post("/register", validate(registerSchema), register);

// POST /api/auth/login
router.post("/login", validate(loginSchema), login);

// POST /api/auth/google
router.post("/google", validate(googleAuthSchema), googleAuth);

// POST /api/auth/logout
router.post("/logout", logout);

// GET /api/auth/me (protected)
router.get("/me", verifyToken, getMe);

module.exports = router;
