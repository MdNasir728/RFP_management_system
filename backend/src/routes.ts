import { Router, Request, Response } from "express";
import vendorRoutes from "./modules/vendor/vendor.routes";
import rfpRoutes from "./modules/rfp/rfp.routes";

const router = Router();

/**
 * Health check endpoint
 */
router.get("/health", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "API is running"
  });
});

/**
 * Vendor management routes
 */
router.use("/vendors", vendorRoutes);

/**
 * RFP management routes
 */
router.use("/rfps", rfpRoutes);

export default router;
