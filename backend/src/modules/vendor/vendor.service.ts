import { VendorModel } from "./vendor.model";
import { CreateVendorInput, Vendor } from "../../shared";
import { mapVendorDocumentToVendor } from "./vendor.mapper";

/**
 * Create a new vendor.
 */
export const createVendor = async (
  input: CreateVendorInput
): Promise<Vendor> => {
  const vendor = await VendorModel.create(input);
  return mapVendorDocumentToVendor(vendor);
};

/**
 * Fetch all active vendors.
 */
export const getAllVendors = async (): Promise<Vendor[]> => {
  const vendors = await VendorModel.find({ isActive: true }).sort({
    createdAt: -1
  });

  return vendors.map(mapVendorDocumentToVendor);
};

/**
 * Fetch vendor by ID.
 */
export const getVendorById = async (
  vendorId: string
): Promise<Vendor | null> => {
  const vendor = await VendorModel.findOne({
    _id: vendorId,
    isActive: true
  });

  return vendor ? mapVendorDocumentToVendor(vendor) : null;
};

/**
 * Update vendor details.
 */
export const updateVendor = async (
  vendorId: string,
  updates: Partial<CreateVendorInput>
): Promise<Vendor | null> => {
  const vendor = await VendorModel.findOneAndUpdate(
    { _id: vendorId, isActive: true },
    { $set: updates },
    { new: true }
  );

  return vendor ? mapVendorDocumentToVendor(vendor) : null;
};

/**
 * Soft delete vendor.
 */
export const deactivateVendor = async (
  vendorId: string
): Promise<boolean> => {
  const result = await VendorModel.updateOne(
    { _id: vendorId },
    { $set: { isActive: false } }
  );

  return result.modifiedCount > 0;
};
