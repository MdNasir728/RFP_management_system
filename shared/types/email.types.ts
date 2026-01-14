import { BaseEntity } from "./common.types";

/**
 * Direction of an email in the system.
 * OUTBOUND → RFP sent to vendors
 * INBOUND → Vendor response received
 */
export enum EmailDirection {
  OUTBOUND = "OUTBOUND",
  INBOUND = "INBOUND",
}

/**
 * Represents an email logged by the system.
 * Used for tracking sent RFPs and received vendor responses.
 */
export interface EmailLog extends BaseEntity {
  rfpId: string;
  vendorId?: string;

  direction: EmailDirection;

  /**
   * Email metadata
   */
  from: string;
  to: string;
  subject: string;

  /**
   * Raw email body (plain text).
   */
  body: string;

  /**
   * Gmail-specific identifiers for threading & deduplication.
   */
  messageId: string;
  threadId?: string;

  /**
   * Timestamp when email was sent or received.
   */
  timestamp: string;
}
