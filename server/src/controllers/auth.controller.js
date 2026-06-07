const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { getDB } = require("../database/db");
const { asyncHandler, AppError } = require("../middlewares/error.middleware");

// ─── Cookie options ────────────────────────────────────────
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

function generateToken(userId) {
  return jwt.sign({ userId: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

// ─── POST /api/auth/register ───────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { name, email, password, photoURL } = req.body;
  const db = getDB();

  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    throw new AppError("An account with this email already exists.", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = {
    name,
    email,
    password: hashedPassword,
    photoURL: photoURL || "",
    role: "user",
    bookings: [],
    createdAt: new Date(),
  };

  const result = await db.collection("users").insertOne(newUser);
  newUser._id = result.insertedId;

  const token = generateToken(result.insertedId);
  res.cookie("token", token, COOKIE_OPTIONS);

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    user: sanitizeUser(newUser),
  });
});

// ─── POST /api/auth/login ──────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const db = getDB();

  const user = await db.collection("users").findOne({ email });
  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  // Google-only accounts have no password
  if (!user.password) {
    throw new AppError("Please sign in with Google for this account.", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = generateToken(user._id);
  res.cookie("token", token, COOKIE_OPTIONS);

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    user: sanitizeUser(user),
  });
});

// ─── POST /api/auth/google ─────────────────────────────────
const googleAuth = asyncHandler(async (req, res) => {
  const { name, email, photoURL, googleId } = req.body;
  const db = getDB();

  let user = await db.collection("users").findOne({ email });

  if (!user) {
    const newUser = {
      name,
      email,
      photoURL: photoURL || "",
      googleId,
      password: null, // Google account, no password
      role: "user",
      bookings: [],
      createdAt: new Date(),
    };
    const result = await db.collection("users").insertOne(newUser);
    newUser._id = result.insertedId;
    user = newUser;
  } else {
    // Update googleId if not set
    if (!user.googleId) {
      await db
        .collection("users")
        .updateOne({ _id: user._id }, { $set: { googleId, photoURL: photoURL || user.photoURL } });
    }
  }

  const token = generateToken(user._id);
  res.cookie("token", token, COOKIE_OPTIONS);

  res.status(200).json({
    success: true,
    message: "Google authentication successful",
    user: sanitizeUser(user),
  });
});

// ─── POST /api/auth/logout ─────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// ─── GET /api/auth/me ──────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  const db = getDB();
  const user = await db
    .collection("users")
    .findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } }
    );

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  res.status(200).json({
    success: true,
    user,
  });
});

module.exports = { register, login, googleAuth, logout, getMe };
