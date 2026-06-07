const jwt = require("jsonwebtoken");
const { getDB } = require("../database/db");
const { ObjectId } = require("mongodb");

/**
 * Verify JWT from httpOnly cookie
 * Attaches req.user = { userId, email, name, role }
 */
async function verifyToken(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optionally re-validate user still exists in DB
    const db = getDB();
    const user = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(decoded.userId) },
        { projection: { password: 0 } }
      );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    req.user = {
      userId: decoded.userId,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please log in again.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }
    next(error);
  }
}

/**
 * Optionally verify token (for public routes that show extra data when authenticated)
 */
async function optionalAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch {
    // Silently ignore invalid tokens for optional auth
    next();
  }
}

module.exports = { verifyToken, optionalAuth };
