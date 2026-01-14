/**
 * Generic API response wrapper
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
  };
}

/**
 * Vendor types (frontend-safe)
 */
export interface Vendor {
  _id: string;
  name: string;
  email: string;
  companyName?: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * RFP types
 */
export type RfpStatus =
  | "DRAFT"
  | "SENT"
  | "RESPONSES_RECEIVED"
  | "RECOMMENDED";

export interface StructuredRfp {
  items?: {
    name: string;
    quantity?: number;
    unitPrice?: number;
  }[];
  additionalNotes?: string;
}

export interface Rfp {
  _id: string;
  title: string;
  rawText: string;
  structuredData: StructuredRfp;
  status: RfpStatus;
  vendorIds: string[];
  sentToEmails: string[];
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Proposal / Evaluation types
 */
export interface ProposalParsedData {
  confidence: "LOW" | "MEDIUM" | "HIGH";
  missingFields?: string[];
  notes?: string;
}

export interface Proposal {
  _id: string;
  rfpId: string;
  vendorId: string;
  rawResponseText: string;
  parsedData: ProposalParsedData;
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationResult {
  recommendedVendorId: string;
  scores: {
    vendorId: string;
    score: number;
    reasoning: string;
  }[];
}
