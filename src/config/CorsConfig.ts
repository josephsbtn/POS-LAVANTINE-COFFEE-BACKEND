import { CorsOptions } from "cors";
import { env } from "./env";

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); //buat API testing kayak postmant dkk

    const allowedOrigins = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Blocked by CORS :" + origin));
    }
  },
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
};
