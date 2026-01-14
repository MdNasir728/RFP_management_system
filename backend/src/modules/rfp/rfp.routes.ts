import { Router } from "express";
import {
  createRfpHandler,
  getAllRfpsHandler,
  getRfpByIdHandler
} from "./rfp.controller";

const router = Router();

/**
 * RFP routes
 */
router.post("/", createRfpHandler);
router.get("/", getAllRfpsHandler);
router.get("/:id", getRfpByIdHandler);

export default router;
