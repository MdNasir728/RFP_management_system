/* ===============================
   COMMON API RESPONSE
================================ */

export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
}

/* ===============================
   VENDOR
================================ */

export interface Vendor {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

/* ===============================
   RFP
================================ */

export type RfpStatus =
  | "DRAFT"
  | "SENT"
  | "RESPONSES_RECEIVED"
  | "RECOMMENDED";

export interface StructuredRfpItem {
  name: string;
  quantity?: number | null;
  specifications?: string | null;
}

export interface StructuredRfp {
  items: StructuredRfpItem[];
  constraints?: string[];
  budget?: string | null;
  timeline?: string | null;
  evaluationCriteria?: string[];
  assumptions?: string[];
}

export interface EvaluationScore {
  vendorId: string;
  score: number;
  reasoning: string;
}

export interface EvaluationResult {
  recommendedVendorId: string;
  overallReasoning: string; // ⭐ NEW (important)
  scores: EvaluationScore[];
  evaluatedAt: string;
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

  evaluationResult?: EvaluationResult;

  createdAt: string;
  updatedAt: string;
}

/* ===============================
   PROPOSAL
================================ */

export type ProposalConfidence =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export interface ProposalParsedData {
  pricing?: string | null;
  deliveryTimeline?: string | null;
  paymentTerms?: string | null;
  warranty?: string | null;
  confidence: ProposalConfidence;
  missingFields?: string[];
}

export interface Proposal {
  _id: string;
  rfpId: string;
  vendorId: string;

  vendor?: {
    _id: string;
    name: string;
    email: string;
  };

  rawResponseText: string;
  parsedData: ProposalParsedData;
  createdAt: string;
  updatedAt: string;
}
