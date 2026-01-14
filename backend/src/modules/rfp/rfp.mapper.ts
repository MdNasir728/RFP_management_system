import { Rfp } from "../../shared";
import { RfpDocument } from "./rfp.model";

/**
 * Maps a MongoDB RFP document to a domain-safe RFP object.
 * Converts ObjectId and Date fields into API-friendly types.
 */
export const mapRfpDocumentToRfp = (doc: RfpDocument): Rfp => {
  const obj = doc.toObject();

  return {
    _id: obj._id.toString(),
    title: obj.title,
    rawText: obj.rawText,
    structuredData: obj.structuredData,
    status: obj.status,
    vendorIds: obj.vendorIds,
    sentToEmails: obj.sentToEmails,
    sentAt: obj.sentAt ? obj.sentAt.toISOString() : undefined,
    createdAt: obj.createdAt.toISOString(),
    updatedAt: obj.updatedAt.toISOString()
  };
};
