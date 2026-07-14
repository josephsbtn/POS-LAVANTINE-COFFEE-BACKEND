import util from "node:util";
import type { Request, Response, NextFunction } from "express";

const LEVELS = {
  error: "ERROR",
  warn: "WARN ",
  info: "INFO ",
  debug: "DEBUG",
} as const;

const formatMessage = (level: string, message: string) => {
  const timestamp = new Date().toISOString();
  return `${timestamp} [${level}] ${message}`;
};

const write = (level: keyof typeof LEVELS, message: string, meta?: unknown) => {
  const formatted = formatMessage(LEVELS[level], message);

  if (meta !== undefined) {
    console[level === "error" ? "error" : level](
      formatted,
      typeof meta === "string"
        ? meta
        : util.inspect(meta, { depth: 5, colors: false }),
    );
    return;
  }

  console[level === "error" ? "error" : level](formatted);
};

export const logger = {
  error: (message: string, meta?: unknown) => write("error", message, meta),
  warn: (message: string, meta?: unknown) => write("warn", message, meta),
  info: (message: string, meta?: unknown) => write("info", message, meta),
  debug: (message: string, meta?: unknown) => write("debug", message, meta),
};

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
  logger.error("Request pipeline error", {
    path: req.originalUrl,
    method: req.method,
    status: res.statusCode,
    error: error instanceof Error ? (error.stack ?? error.message) : error,
  });
  next(error);
};
