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

/* ---------- RFP ---------- */

export interface Rfp {
  _id: string;
  title: string;
  rawText: string;
  structuredData: unknown;
  status: "DRAFT" | "SENT" | "RESPONSES_RECEIVED" | "RECOMMENDED";
  vendorIds: string[];
  sentToEmails: string[];
  sentAt?: string;
  evaluationResult?: EvaluationResult;
  createdAt: string;
  updatedAt: string;
}

/* ---------- PROPOSAL ---------- */

export interface ProposalParsedData {
  pricing?: string | null;
  deliveryTimeline?: string | null;
  paymentTerms?: string | null;
  warranty?: string | null;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  missingFields?: string[];
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

/* ---------- EVALUATION ---------- */

export interface EvaluationResult {
  recommendedVendorId: string;
  scores: {
    vendorId: string;
    score: number;
    reasoning: string;
  }[];
}

export interface EvaluationResult {
  recommendedVendorId: string;
  scores: {
    vendorId: string;
    score: number;
    reasoning: string;
  }[];
}
