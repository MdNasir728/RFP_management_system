import { Proposal } from "../../shared";
import { ProposalDocument } from "./proposal.model";

/**
 * Maps a MongoDB Proposal document to a domain-safe Proposal object.
 * Converts ObjectId and Date fields into API-friendly types.
 */
export const mapProposalDocumentToProposal = (
  doc: ProposalDocument
): Proposal => {
  const obj = doc.toObject();

  return {
    _id: obj._id.toString(),
    rfpId: obj.rfpId,
    vendorId: obj.vendorId,
    rawResponseText: obj.rawResponseText,
    parsedData: obj.parsedData,
    createdAt: obj.createdAt.toISOString(),
    updatedAt: obj.updatedAt.toISOString()
  };
};
