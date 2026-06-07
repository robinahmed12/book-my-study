const { z } = require("zod");

// ─── Auth Schemas ──────────────────────────────────────────

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name too long")
    .trim(),
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter"),
  photoURL: z
    .string()
    .url("Invalid photo URL")
    .optional()
    .or(z.literal("")),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

const googleAuthSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  photoURL: z.string().url().optional().or(z.literal("")),
  googleId: z.string().min(1),
});

// ─── Room Schemas ──────────────────────────────────────────

const createRoomSchema = z.object({
  roomName: z
    .string()
    .min(3, "Room name must be at least 3 characters")
    .max(100, "Room name too long")
    .trim(),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description too long")
    .trim(),
  image: z.string().url("Image must be a valid URL"),
  floor: z
    .string()
    .min(1, "Floor is required")
    .max(20, "Floor value too long")
    .trim(),
  capacity: z
    .number({ invalid_type_error: "Capacity must be a number" })
    .int("Capacity must be a whole number")
    .min(1, "Capacity must be at least 1")
    .max(100, "Capacity cannot exceed 100"),
  hourlyRate: z
    .number({ invalid_type_error: "Hourly rate must be a number" })
    .positive("Hourly rate must be positive")
    .max(10000, "Hourly rate seems too high"),
  amenities: z
    .array(z.string().trim().min(1))
    .min(1, "At least one amenity is required")
    .max(20, "Too many amenities"),
});

const updateRoomSchema = createRoomSchema.partial();

// ─── Booking Schemas ───────────────────────────────────────

const createBookingSchema = z.object({
  roomId: z.string().length(24, "Invalid room ID"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine((d) => new Date(d) >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: "Cannot book a date in the past",
    }),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format"),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "End time must be in HH:MM format"),
  note: z.string().max(500, "Note too long").optional().or(z.literal("")),
}).refine(
  (data) => {
    const [sh, sm] = data.startTime.split(":").map(Number);
    const [eh, em] = data.endTime.split(":").map(Number);
    return eh * 60 + em > sh * 60 + sm;
  },
  {
    message: "End time must be after start time",
    path: ["endTime"],
  }
);

// ─── Validation Middleware Factory ─────────────────────────

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
    req.body = result.data; // Use parsed/sanitized data
    next();
  };
}

module.exports = {
  registerSchema,
  loginSchema,
  googleAuthSchema,
  createRoomSchema,
  updateRoomSchema,
  createBookingSchema,
  validate,
};
