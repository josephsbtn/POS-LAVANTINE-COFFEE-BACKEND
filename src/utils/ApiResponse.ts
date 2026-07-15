import type { Response } from "express";

interface SuccessBody {
  success: true;
  message: string;
  data?: unknown;
  meta?: unknown;
}

interface ErrorBody {
  success: false;
  message: string;
  errors?: unknown[];
}

export class ApiResponse {
  static success(
    res: Response,
    data?: unknown,
    message = "Success",
    meta?: unknown,
  ) {
    const body: SuccessBody = { success: true, message };
    if (data !== undefined) body.data = data;
    if (meta !== undefined) body.meta = meta;
    return res.status(200).json(body);
  }

  static created(res: Response, data?: unknown, message = "Created") {
    const body: SuccessBody = { success: true, message };
    if (data !== undefined) body.data = data;
    return res.status(201).json(body);
  }

  static badRequest(
    res: Response,
    message = "Bad Request",
    errors?: unknown[],
  ) {
    const body: ErrorBody = { success: false, message };
    if (errors?.length) body.errors = errors;
    return res.status(400).json(body);
  }

  static unauthorized(res: Response, message = "Unauthorized") {
    return res
      .status(401)
      .json({ success: false, message } satisfies ErrorBody);
  }

  static forbidden(res: Response, message = "Forbidden") {
    return res
      .status(403)
      .json({ success: false, message } satisfies ErrorBody);
  }

  static notFound(res: Response, message = "Not Found") {
    return res
      .status(404)
      .json({ success: false, message } satisfies ErrorBody);
  }

  static conflict(res: Response, message = "Conflict") {
    return res
      .status(409)
      .json({ success: false, message } satisfies ErrorBody);
  }

  static validationError(
    res: Response,
    errors: unknown[],
    message = "Validation Error",
  ) {
    return res
      .status(422)
      .json({ success: false, message, errors } satisfies ErrorBody);
  }

  static serverError(res: Response, message = "Internal Server Error") {
    return res
      .status(500)
      .json({ success: false, message } satisfies ErrorBody);
  }
}
