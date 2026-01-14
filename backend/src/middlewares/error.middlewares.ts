import { Request, Response, NextFunction } from "express";

/**
 * Global error handling middleware.
 * Ensures consistent error response structure across the API.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  console.error("❌ API Error:", err);

  return res.status(500).json({
    success: false,
    error: {
      message: err.message || "Internal Server Error"
    }
  });
};
