import { Schema, model, Document } from "mongoose";

/**
 * VendorDocument represents the MongoDB document shape.
 * Do NOT extend shared Vendor type here.
 */
export interface VendorDocument extends Document {
  name: string;
  email: string;
  companyName?: string;
  phoneNumber?: string;
  isActive: boolean;
}

const vendorSchema = new Schema<VendorDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    companyName: {
      type: String,
      trim: true
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const VendorModel = model<VendorDocument>("Vendor", vendorSchema);
