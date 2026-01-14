import { Router, Request, Response } from "express";

const router = Router();

/**
 * Health check endpoint
 * Useful for sanity checks and demos.
 */
router.get("/health", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "API is running"
  });
});

/**
 * Feature modules will be mounted here
 * Example:
 * router.use("/rfps", rfpRoutes);
 */

export default router;
