import { RfpStatus } from "../enums/rfp-status.enum";
import { BaseEntity, Money } from "./common.types";

/**
 * Represents a single line item requested in an RFP.
 * Example: 20 laptops with 16GB RAM
 */
export interface RfpItem {
  name: string;
  quantity: number;
  specifications?: string;
}

/**
 * Structured representation of an RFP extracted from
 * natural language using AI.
 */
export interface StructuredRfp {
  items: RfpItem[];
  totalBudget?: Money;
  deliveryTimelineDays?: number;
  paymentTerms?: string;
  warrantyRequirements?: string;
  additionalNotes?: string;
}

/**
 * Input payload when user creates an RFP from free text.
 */
export interface CreateRfpInput {
  rawText: string;
}

/**
 * Core RFP entity stored in the database.
 */
export interface Rfp extends BaseEntity {
  title: string;
  rawText: string;
  structuredData: StructuredRfp;
  status: RfpStatus;

  /**
   * Vendors selected to receive this RFP.
   * Stored as Vendor IDs.
   */
  vendorIds: string[];

  /**
   * Emails to which this RFP was sent.
   * Helps with tracking and UI display.
   */
  sentToEmails: string[];

  /**
   * Timestamp when RFP was sent.
   */
  sentAt?: string;
}
