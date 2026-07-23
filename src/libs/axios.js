import axios from "axios";

// In development, hit the local backend directly.
// In production, use VITE_API_URL (set this in Vercel's project env vars to
// your Render backend URL, e.g. https://your-backend.onrender.com/api).
const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"
    : import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
