import { Request, Response, NextFunction } from "express";
import {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deactivateVendor
} from "./vendor.service";
import { CreateVendorInput } from "../../shared";

/**
 * Create a vendor
 * POST /api/vendors
 */
export const createVendorHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const payload: CreateVendorInput = req.body;

    if (!payload.name || !payload.email) {
      return res.status(400).json({
        success: false,
        error: { message: "Name and email are required" }
      });
    }

    const vendor = await createVendor(payload);

    return res.status(201).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all vendors
 * GET /api/vendors
 */
export const getAllVendorsHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const vendors = await getAllVendors();

    return res.json({
      success: true,
      data: vendors
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get vendor by ID
 * GET /api/vendors/:id
 */
export const getVendorByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const vendor = await getVendorById(req.params.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: { message: "Vendor not found" }
      });
    }

    return res.json({
      success: true,
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update vendor
 * PUT /api/vendors/:id
 */
export const updateVendorHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const vendor = await updateVendor(req.params.id, req.body);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: { message: "Vendor not found or inactive" }
      });
    }

    return res.json({
      success: true,
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deactivate vendor (soft delete)
 * DELETE /api/vendors/:id
 */
export const deleteVendorHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const success = await deactivateVendor(req.params.id);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: { message: "Vendor not found" }
      });
    }

    return res.json({
      success: true,
      data: { message: "Vendor deactivated successfully" }
    });
  } catch (error) {
    next(error);
  }
};
