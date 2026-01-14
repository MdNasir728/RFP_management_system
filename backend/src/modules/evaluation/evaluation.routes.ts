import { Router } from "express";
import { evaluateRfpHandler } from "./evaluation.controller";

const router = Router();

/**
 * Evaluation routes
 */
router.post("/:rfpId", evaluateRfpHandler);

export default router;
