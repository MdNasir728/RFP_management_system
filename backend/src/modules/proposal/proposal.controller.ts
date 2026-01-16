import { Request, Response } from "express";
import {
  fetchVendorRepliesAndCreateProposals,
  getProposalsByRfpId
} from "./proposal.service";

/**
 * POST /api/proposals/fetch-replies
 */
export const fetchVendorRepliesHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const proposals =
      await fetchVendorRepliesAndCreateProposals();

    return res.status(200).json({
      data: proposals,
      message: "Vendor replies processed"
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Failed to fetch replies"
    });
  }
};

/**
 * GET /api/proposals?rfpId=xxx
 */
export const getProposalsHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { rfpId } = req.query;

    if (!rfpId || typeof rfpId !== "string") {
      return res
        .status(400)
        .json({ message: "rfpId is required" });
    }

    const proposals = await getProposalsByRfpId(rfpId);

    return res.status(200).json({
      data: proposals
    });
  } catch (error: any) {
    return res.status(500).json({
      message:
        error.message ||
        "Failed to fetch proposals"
    });
  }
};

