import multer, { MulterError } from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

const uploadDir = path.join(process.cwd(), "public/uploads/items");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${crypto.randomUUID()}${ext}`;
    cb(null, safeName);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  logger.debug("FILE FILTERING");
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(new Error("UNSUPPORTED_FILE_TYPE"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
    fields: 20, 
  },
});

export const handleSingleUpload = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const uploader = upload.single(fieldName);

    uploader(req, res, (err: unknown) => {
      if (err instanceof MulterError) {
        switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            return res.status(413).json({ message: 'File too large, max 5MB' });
          case 'LIMIT_UNEXPECTED_FILE':
            return res.status(400).json({ message: `Unexpected field '${fieldName}'` });
          default:
            return res.status(400).json({ message: `Upload error: ${err.message}` });
        }
      }

      if (err instanceof Error && err.message === 'UNSUPPORTED_FILE_TYPE') {
        return res.status(415).json({ message: 'Unsupported file type. Only JPEG, PNG, WEBP allowed.' });
      }

      if (err) {
        return next(err);
      }

      next();
    });
  };
};
