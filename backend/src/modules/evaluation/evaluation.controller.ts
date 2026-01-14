import { Request, Response, NextFunction } from "express";
import { evaluateRfpProposals } from "./evaluation.service";

/**
 * Evaluate proposals for a given RFP and recommend a vendor
 * POST /api/evaluation/:rfpId
 */
export const evaluateRfpHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { rfpId } = req.params;

    if (!rfpId) {
      return res.status(400).json({
        success: false,
        error: { message: "rfpId is required" }
      });
    }

    const result = await evaluateRfpProposals(rfpId);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
