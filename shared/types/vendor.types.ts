import { BaseEntity } from "./common.types";

/**
 * Input payload when creating a new vendor.
 */
export interface CreateVendorInput {
  name: string;
  email: string;
  companyName?: string;
  phoneNumber?: string;
}

/**
 * Vendor master data stored in the system.
 */
export interface Vendor extends BaseEntity {
  name: string;
  email: string;
  companyName?: string;
  phoneNumber?: string;

  /**
   * Flag to soft-disable vendors without deleting records.
   */
  isActive: boolean;
}
