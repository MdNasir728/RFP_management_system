import { Vendor } from "../../shared";
import { VendorDocument } from "./vendor.model";

/**
 * Maps a MongoDB Vendor document to a domain-safe Vendor object.
 */
export const mapVendorDocumentToVendor = (
  doc: VendorDocument
): Vendor => {
  const obj = doc.toObject();

  return {
    _id: obj._id.toString(),
    name: obj.name,
    email: obj.email,
    companyName: obj.companyName,
    phoneNumber: obj.phoneNumber,
    isActive: obj.isActive,
    createdAt: obj.createdAt.toISOString(),
    updatedAt: obj.updatedAt.toISOString()
  };
};
