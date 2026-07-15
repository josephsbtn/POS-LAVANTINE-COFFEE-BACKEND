import pino from "pino";
import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export const logger = pino({
  level: env.NODE_ENV === "PROD" ? "info" : "debug",
  transport:
    env.NODE_ENV !== "PROD"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
            ignore: "pid,hostname",
          },
        }
      : undefined,
});

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  res.on("finish", () => {
    const elapsed = Date.now() - start;
    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${elapsed}ms`,
    );
  });

  next();
};

export const errorLogger = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(
    {
      path: req.originalUrl,
      method: req.method,
      status: res.statusCode,
      error: error instanceof Error ? error.message : error,
    },
    "Request pipeline error",
  );
  next(error);
};
