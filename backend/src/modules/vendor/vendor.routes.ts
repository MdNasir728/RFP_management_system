import { Router } from "express";
import {
  createVendorHandler,
  getAllVendorsHandler,
  getVendorByIdHandler,
  updateVendorHandler,
  deleteVendorHandler
} from "./vendor.controller";

const router = Router();

/**
 * Vendor routes
 */
router.post("/", createVendorHandler);
router.get("/", getAllVendorsHandler);
router.get("/:id", getVendorByIdHandler);
router.put("/:id", updateVendorHandler);
router.delete("/:id", deleteVendorHandler);

export default router;
