import { Router } from "express";
import { fetchVendorRepliesHandler } from "./proposal.controller";

const router = Router();

/**
 * Proposal routes
 */
router.post("/fetch-replies", fetchVendorRepliesHandler);

export default router;
