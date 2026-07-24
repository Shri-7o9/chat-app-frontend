import axios from "axios";

// In production, requests to /api are proxied by Vercel (see vercel.json)
// straight through to the Render backend. This keeps everything same-origin
// from the browser's perspective, avoiding third-party cookie blocking.
const baseURL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

export const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
