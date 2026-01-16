import { RfpDocument } from "./rfp.model";

/**
 * Map RFP mongoose document to API-safe object
 */
export const mapRfpDocumentToRfp = (
  doc: RfpDocument
) => {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    rawText: doc.rawText,
    structuredData: doc.structuredData,
    status: doc.status,

    vendorIds: doc.vendorIds ?? [],
    sentToEmails: doc.sentToEmails ?? [],
    sentAt: doc.sentAt
      ? doc.sentAt.toISOString()
      : undefined,

    // 🔥 CRITICAL FIX — INCLUDE EVALUATION
    evaluationResult: doc.evaluationResult
      ? {
          recommendedVendorId:
            doc.evaluationResult.recommendedVendorId,
          overallReasoning:
            doc.evaluationResult.overallReasoning,
          scores: doc.evaluationResult.scores,
          evaluatedAt:
            doc.evaluationResult.evaluatedAt?.toISOString()
        }
      : undefined,

    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
};
