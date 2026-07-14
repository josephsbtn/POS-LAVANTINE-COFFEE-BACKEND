import "dotenv/config";
import { createApp } from "./src/app.js";
import { logger } from "./src/utils/logger.js";
import { config } from "dotenv";

config();

const startServer = async () => {
  try {
    const app = await createApp();
    const PORT = Number(process.env.PORT ?? 5000);

    app.listen(PORT, () => {
      logger.info(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Server Failed to Start", error);
  }
};
startServer();
