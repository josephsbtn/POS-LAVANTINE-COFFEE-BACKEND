import { CorsOptions } from "cors";
import { env } from "./env";

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); //buat API testing kayak postmant dkk

    if (env.ALLOWED_ORIGINS.indexOf(origin) != -1) {
      return callback(null, true);
    } else {
      return callback(new Error("Blocked by CORS :" + origin));
    }
  },
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
};
