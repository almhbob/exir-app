import type { ErrorRequestHandler } from "express";

import { ApiError } from "../lib/request";
import { logger } from "../lib/logger";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
      },
    });
    return;
  }

  logger.error({ err }, "Unhandled request error");
  res.status(500).json({
    error: {
      message: "Internal server error",
    },
  });
};
