import { Schema, model, Document } from "mongoose";
import { RfpStatus } from "../../shared";

/**
 * MongoDB document shape for RFP.
 * This represents how RFPs are stored in the database.
 */
export interface RfpDocument extends Document {
  title: string;
  rawText: string;
  structuredData: Record<string, any>;
  status: RfpStatus;
  vendorIds: string[];
  sentToEmails: string[];
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const rfpSchema = new Schema<RfpDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    rawText: {
      type: String,
      required: true
    },
    structuredData: {
      type: Schema.Types.Mixed,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(RfpStatus),
      required: true,
      default: RfpStatus.DRAFT
    },
    vendorIds: {
      type: [String],
      default: []
    },
    sentToEmails: {
      type: [String],
      default: []
    },
    sentAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const RfpModel = model<RfpDocument>("Rfp", rfpSchema);
