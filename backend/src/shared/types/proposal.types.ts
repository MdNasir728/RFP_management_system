import { BaseEntity, Money } from "./common.types";
import { AiConfidenceLevel } from "../enums/ai.enums";

/**
 * Represents a single line item in a vendor proposal.
 */
export interface ProposalLineItem {
  name: string;
  quantity: number;
  unitPrice?: Money;
  totalPrice?: Money;
}

/**
 * Parsed and structured proposal data extracted by AI
 * from vendor email responses.
 */
export interface ParsedProposal {
  lineItems: ProposalLineItem[];
  totalCost?: Money;
  deliveryTimelineDays?: number;
  paymentTerms?: string;
  warrantyDetails?: string;

  /**
   * AI confidence in extracted data.
   */
  confidence: AiConfidenceLevel;

  /**
   * Notes when data is missing or ambiguous.
   */
  missingFields?: string[];
}

/**
 * AI-generated score for a vendor proposal.
 */
export interface ProposalScore {
  overallScore: number; // 0–100
  reasoning: string;
}

/**
 * Vendor proposal entity stored in the database.
 */
export interface Proposal extends BaseEntity {
  rfpId: string;
  vendorId: string;

  /**
   * Raw email body received from vendor.
   */
  rawResponseText: string;

  /**
   * Structured data parsed by AI.
   */
  parsedData: ParsedProposal;

  /**
   * AI evaluation score (optional until evaluated).
   */
  score?: ProposalScore;
}
