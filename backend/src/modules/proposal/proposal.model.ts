import { Schema, model, Document } from "mongoose";
import { AiConfidenceLevel } from "../../shared";

/**
 * MongoDB document shape for a vendor proposal.
 * Represents a parsed vendor response to an RFP.
 */
export interface ProposalDocument extends Document {
  rfpId: string;
  vendorId: string;

  /**
   * Raw email body received from vendor.
   */
  rawResponseText: string;

  /**
   * Structured data parsed by AI.
   */
  parsedData: {
    lineItems?: {
      name: string;
      quantity?: number;
      unitPrice?: number;
      totalPrice?: number;
    }[];
    totalCost?: number;
    deliveryTimelineDays?: number;
    paymentTerms?: string;
    warrantyDetails?: string;
    confidence: AiConfidenceLevel;
    missingFields?: string[];
  };

  createdAt: Date;
  updatedAt: Date;
}

const proposalSchema = new Schema<ProposalDocument>(
  {
    rfpId: {
      type: String,
      required: true,
      index: true
    },
    vendorId: {
      type: String,
      required: true,
      index: true
    },
    rawResponseText: {
      type: String,
      required: true
    },
    parsedData: {
      type: Schema.Types.Mixed,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const ProposalModel = model<ProposalDocument>(
  "Proposal",
  proposalSchema
);
