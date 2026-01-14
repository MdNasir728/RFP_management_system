import { Request, Response, NextFunction } from "express";
import { sendRfpEmails } from "./email.service";

/**
 * Send RFP emails to selected vendors
 * POST /api/emails/send-rfp
 */
export const sendRfpEmailsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { rfpId, vendorIds } = req.body as {
      rfpId?: string;
      vendorIds?: string[];
    };

    if (!rfpId || !Array.isArray(vendorIds) || vendorIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: "rfpId and vendorIds (non-empty array) are required"
        }
      });
    }

    const sentEmails = await sendRfpEmails(rfpId, vendorIds);

    return res.status(200).json({
      success: true,
      data: {
        sentTo: sentEmails
      }
    });
  } catch (error) {
    next(error);
  }
};
