import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── Public Axios Instance ──────────────────────────────────
// For unauthenticated requests (rooms list, room details, etc.)
export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ─── Secure Axios Instance ──────────────────────────────────
// For authenticated requests — sends cookies automatically
export const axiosSecure = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 15000,
});

// ─── Response interceptor for secure instance ───────────────
axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Redirect to login on unauthorized (token expired)
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login?expired=true";
      }
    }

    return Promise.reject(error);
  }
);

// ─── Request interceptor for logging in development ─────────
if (process.env.NODE_ENV === "development") {
  axiosPublic.interceptors.request.use((config) => {
    console.log(`📡 [Public] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  });

  axiosSecure.interceptors.request.use((config) => {
    console.log(`🔐 [Secure] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  });
}
