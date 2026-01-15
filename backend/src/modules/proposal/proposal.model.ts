import { Schema, model, Document, Types } from "mongoose";

/**
 * Minimal Vendor shape when populated
 */
export interface PopulatedVendor {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

/**
 * Proposal mongoose document
 * vendorId can be:
 * - ObjectId (not populated)
 * - PopulatedVendor (after populate)
 */
export interface ProposalDocument extends Document {
  rfpId: string;
  vendorId: Types.ObjectId | PopulatedVendor;
  rawResponseText: string;
  parsedData: any;
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
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true
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
  { timestamps: true }
);

export const ProposalModel = model<ProposalDocument>(
  "Proposal",
  proposalSchema
);
