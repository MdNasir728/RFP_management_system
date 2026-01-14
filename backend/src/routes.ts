import { Router, Request, Response } from "express";
import vendorRoutes from "./modules/vendor/vendor.routes";
import rfpRoutes from "./modules/rfp/rfp.routes";
import emailRoutes from "./modules/email/email.routes";
import proposalRoutes from "./modules/proposal/proposal.routes";
import evaluationRoutes from "./modules/evaluation/evaluation.routes";

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

/**
 * Email sending routes
 */
router.use("/emails", emailRoutes);

/**
 * Proposal / inbound email routes
 */
router.use("/proposals", proposalRoutes);

/**
 * Proposal evaluation routes
 */
router.use("/evaluation", evaluationRoutes);

export default router;
