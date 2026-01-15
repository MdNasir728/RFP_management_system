import { Request, Response, NextFunction } from "express";
import {
  createRfp,
  getAllRfps,
  getRfpById
} from "./rfp.service";

/**
 * Create RFP from raw text
 * POST /api/rfps
 */
export const createRfpHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { rawText } = req.body as { rawText?: string };

    if (!rawText || rawText.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: {
          message: "rawText is required and must be at least 10 characters"
        }
      });
    }

    const rfp = await createRfp(rawText);

    return res.status(201).json({
      success: true,
      data: rfp
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all RFPs
 * GET /api/rfps
 */
export const getAllRfpsHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const rfps = await getAllRfps();

    return res.status(200).json({
      success: true,
      data: rfps
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get RFP by ID
 * GET /api/rfps/:id
 */
export const getRfpByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { id } = req.params;

    const rfp = await getRfpById(id);

    if (!rfp) {
      return res.status(404).json({
        success: false,
        error: {
          message: "RFP not found"
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: rfp
    });
  } catch (error) {
    next(error);
  }
};
