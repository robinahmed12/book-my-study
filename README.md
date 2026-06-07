# StudyNook — Library Study Room Booking Platform

A production-ready full-stack web application for booking library study rooms. Built with Next.js 15, Express.js, MongoDB Atlas, and deployed on Vercel + Render.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn UI |
| State Management | TanStack Query v5 (React Query) |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Auth (Client) | Firebase (Google OAuth) + JWT (httpOnly cookies) |
| Backend | Express.js (Node.js) |
| Database | MongoDB Atlas (Native Driver, no Mongoose) |
| Auth (Server) | JWT stored in httpOnly cookies |
| Deployment | Frontend → Vercel, Backend → Render |

---

## 📁 Project Structure

```
studynook/
├── client/                         # Next.js Frontend
│   ├── app/
│   │   ├── page.tsx                # Home page
│   │   ├── layout.tsx              # Root layout
│   │   ├── globals.css             # Global styles
│   │   ├── rooms/
│   │   │   ├── page.tsx            # Browse rooms (search/filter/paginate)
│   │   │   ├── add/page.tsx        # Create room listing
│   │   │   └── [id]/page.tsx       # Room detail + booking
│   │   ├── auth/
│   │   │   ├── login/page.tsx      # Login with email or Google
│   │   │   └── register/page.tsx   # Register with validation
│   │   └── dashboard/
│   │       ├── my-listings/page.tsx  # Manage own rooms
│   │       └── my-bookings/page.tsx  # View/cancel bookings
│   ├── components/
│   │   ├── shared/                 # Navbar, Footer, Hero, etc.
│   │   ├── rooms/                  # RoomCard, RoomDetailClient, etc.
│   │   ├── booking/                # BookingForm with conflict detection
│   │   └── dashboard/              # Dashboard components
│   ├── hooks/
│   │   ├── useQueries.ts           # All React Query hooks
│   │   └── useProtectedRoute.ts    # Auth guard hook
│   ├── providers/
│   │   ├── AuthProvider.tsx        # Auth context + state
│   │   └── Providers.tsx           # QueryClient + Theme + Toast
│   ├── services/
│   │   └── api.service.ts          # All API calls (Axios)
│   ├── lib/
│   │   ├── axios.ts                # Axios instances (public + secure)
│   │   └── firebase.ts             # Firebase config + Google auth
│   └── types/
│       └── index.ts                # TypeScript interfaces
│
└── server/                         # Express.js Backend
    └── src/
        ├── app.js                  # Express app + middleware
        ├── database/
        │   └── db.js               # MongoDB connection + indexes
        ├── routes/
        │   ├── auth.routes.js
        │   ├── room.routes.js
        │   └── booking.routes.js
        ├── controllers/
        │   ├── auth.controller.js
        │   ├── room.controller.js
        │   └── booking.controller.js
        ├── middlewares/
        │   ├── auth.middleware.js   # verifyToken, optionalAuth
        │   └── error.middleware.js  # Global error handler, asyncHandler
        └── validations/
            └── schemas.js          # Zod validation schemas
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Firebase project (for Google Auth)

### 1. Clone & Install

```bash
git clone <repo-url>
cd studynook

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Server

```bash
cd server
cp .env.example .env
```

Fill in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_32_char_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

### 3. Configure Client

```bash
cd client
cp .env.example .env.local
```

Fill in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 4. Run in Development

```bash
# Terminal 1 - Server
cd server && npm run dev

# Terminal 2 - Client
cd client && npm run dev
```

App available at `http://localhost:3000`

---

## 🗃️ Database Schema

### Users Collection
```js
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String | null,   // null for Google-only accounts
  photoURL: String,
  googleId: String?,
  role: "user" | "admin",
  bookings: [String],        // booking _id references
  createdAt: Date
}
```

### Rooms Collection
```js
{
  _id: ObjectId,
  ownerId: String,           // user._id.toString()
  roomName: String,
  description: String,
  image: String,             // URL
  floor: String,
  capacity: Number,
  hourlyRate: Number,
  amenities: [String],
  bookingCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings Collection
```js
{
  _id: ObjectId,
  roomId: String,
  roomName: String,
  roomImage: String,
  userId: String,
  userName: String,
  date: String,              // "YYYY-MM-DD"
  startTime: String,         // "HH:MM"
  endTime: String,           // "HH:MM"
  durationHours: Number,
  totalCost: Number,
  note: String,
  status: "confirmed" | "cancelled" | "pending",
  createdAt: Date,
  cancelledAt: Date?
}
```

---

## 🔐 Authentication Flow

```
1. User submits credentials / clicks "Sign in with Google"
2. Server verifies credentials / Firebase token validates Google user
3. Server generates JWT: { userId }
4. JWT stored in httpOnly cookie (secure, sameSite: strict in production)
5. Every protected request sends cookie automatically (withCredentials: true)
6. verifyToken middleware validates JWT, fetches user from DB
7. req.user populated with { userId, email, name, role }
```

---

## 🔄 Booking Conflict Detection

The algorithm uses MongoDB's `$lt` and `$gt` operators to detect overlapping time ranges:

```js
// An overlap exists when:
// newStart < existingEnd AND newEnd > existingStart

const conflict = await db.collection("bookings").findOne({
  roomId,
  date,
  status: { $in: ["confirmed", "pending"] },
  startTime: { $lt: endTime },   // existing starts before new ends
  endTime: { $gt: startTime },   // existing ends after new starts
});
```

| Scenario | Result |
|---|---|
| 10:00-12:00 existing, try 11:00-13:00 | ❌ Rejected (overlap) |
| 10:00-12:00 existing, try 12:00-14:00 | ✅ Accepted (back-to-back) |
| 10:00-12:00 existing, try 08:00-10:00 | ✅ Accepted (before) |

---

## 🌐 API Reference

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/google` | Public |
| POST | `/api/auth/logout` | Public |
| GET | `/api/auth/me` | Protected |

### Rooms
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/rooms` | Public |
| GET | `/api/rooms/latest` | Public |
| GET | `/api/rooms/:id` | Public |
| GET | `/api/rooms/my-listings` | Protected |
| POST | `/api/rooms` | Protected |
| PATCH | `/api/rooms/:id` | Protected (owner) |
| DELETE | `/api/rooms/:id` | Protected (owner) |

### Bookings
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/bookings` | Protected |
| GET | `/api/bookings/my` | Protected |
| GET | `/api/bookings/room/:roomId/availability` | Protected |
| PATCH | `/api/bookings/:id/cancel` | Protected (owner) |

---

## 🚀 Deployment

### Backend → Render

1. Push `server/` to GitHub
2. Create new **Web Service** on Render
3. Build command: `npm install`
4. Start command: `node src/app.js`
5. Add all environment variables from `.env.example`
6. Set `NODE_ENV=production`

### Frontend → Vercel

1. Push `client/` to GitHub
2. Import project on Vercel
3. Framework preset: **Next.js**
4. Add all environment variables from `.env.example`
5. Set `NEXT_PUBLIC_API_URL` to your Render backend URL

### Post-deployment Checklist

- [ ] Update `CORS allowedOrigins` in `server/src/app.js` to include Vercel URL
- [ ] Update `CLIENT_URL` env var on Render to Vercel URL
- [ ] Add Vercel domain to Firebase **Authorized Domains**
- [ ] Add Vercel domain to Firebase Console → Authentication → Settings

---

## 🔒 Security Features

- JWT stored in **httpOnly cookies** (XSS-proof)
- **helmet.js** for HTTP security headers
- **Rate limiting** (200 req/15min global, 20 req/15min on auth routes)
- **CORS** whitelist configuration
- **Zod** input validation on all endpoints
- **bcryptjs** password hashing (cost factor 12)
- **sameSite: strict** cookie policy in production
- Ownership checks on all mutation operations
- MongoDB injection protection via parameterized queries

---

## 📦 Performance Optimizations

- **Next.js Image** component with `sizes` attribute and remote patterns
- **React Query** caching with smart stale times (1min default, 30s availability)
- **MongoDB compound indexes** for conflict detection queries
- **Code splitting** via Next.js dynamic imports
- **Pagination** on rooms list (max 50 per page)
- **Connection pooling** (maxPoolSize: 10) on MongoDB client

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary | `#4F46E5` (Indigo) |
| Secondary | `#8B5CF6` (Violet) |
| Accent | `#06B6D4` (Cyan) |
| Radius | `0.75rem` |
| Font | Geist Sans + Geist Mono |
| Dark mode | Automatic via `next-themes` |
