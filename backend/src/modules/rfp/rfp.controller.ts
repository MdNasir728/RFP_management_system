import { Request, Response, NextFunction } from "express";
import {
  createRfpFromText,
  getAllRfps,
  getRfpById
} from "./rfp.service";
import { CreateRfpInput } from "../../shared";

/**
 * Create RFP from natural language input
 * POST /api/rfps
 */
export const createRfpHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const payload: CreateRfpInput = req.body;

    if (!payload?.rawText || payload.rawText.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: { message: "RFP description is required (min 10 chars)" }
      });
    }

    const rfp = await createRfpFromText(payload);

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

    return res.json({
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
    const rfp = await getRfpById(req.params.id);

    if (!rfp) {
      return res.status(404).json({
        success: false,
        error: { message: "RFP not found" }
      });
    }

    return res.json({
      success: true,
      data: rfp
    });
  } catch (error) {
    next(error);
  }
};
