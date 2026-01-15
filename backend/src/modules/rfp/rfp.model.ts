import { Schema, model, Document } from "mongoose";
import { RfpStatus } from "../../shared";

export interface RfpDocument extends Document {
  title: string;
  rawText: string;
  structuredData: any;
  status: RfpStatus;
  vendorIds: string[];
  sentToEmails: string[];
  sentAt?: Date;
  evaluationResult?: {
    recommendedVendorId: string;
    scores: {
      vendorId: string;
      score: number;
      reasoning: string;
    }[];
    evaluatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const rfpSchema = new Schema<RfpDocument>(
  {
    title: { type: String, required: true },
    rawText: { type: String, required: true },
    structuredData: { type: Schema.Types.Mixed },
    status: {
      type: String,
      enum: Object.values(RfpStatus),
      required: true
    },
    vendorIds: [String],
    sentToEmails: [String],
    sentAt: Date,
    evaluationResult: {
      recommendedVendorId: String,
      scores: [
        {
          vendorId: String,
          score: Number,
          reasoning: String
        }
      ],
      evaluatedAt: Date
    }
  },
  { timestamps: true }
);

export const RfpModel = model<RfpDocument>("Rfp", rfpSchema);
