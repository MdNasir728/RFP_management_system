import { Request, Response, NextFunction } from "express";
import { fetchVendorRepliesAndCreateProposals } from "./proposal.service";

/**
 * Fetch vendor email replies and create proposals
 * POST /api/proposals/fetch-replies
 *
 * This endpoint triggers Gmail inbox scanning.
 * In real systems, this could be a cron job or webhook.
 */
export const fetchVendorRepliesHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const proposals = await fetchVendorRepliesAndCreateProposals();

    return res.status(200).json({
      success: true,
      data: {
        createdCount: proposals.length,
        proposals
      }
    });
  } catch (error) {
    next(error);
  }
};
