

export enum RfpStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  RESPONSES_RECEIVED = "RESPONSES_RECEIVED",
  RECOMMENDED = "RECOMMENDED",
}

/**
 * Defines allowed status transitions.
 * This prevents invalid state changes at runtime.
 */
export const RFP_STATUS_FLOW: Record<RfpStatus, RfpStatus[]> = {
  [RfpStatus.DRAFT]: [RfpStatus.SENT],
  [RfpStatus.SENT]: [RfpStatus.RESPONSES_RECEIVED],
  [RfpStatus.RESPONSES_RECEIVED]: [RfpStatus.RECOMMENDED],
  [RfpStatus.RECOMMENDED]: [],
};

export type AllowedNextRfpStatus<T extends RfpStatus> =
  (typeof RFP_STATUS_FLOW)[T][number];
