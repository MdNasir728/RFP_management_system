import { Types } from "mongoose";
import {
  ProposalDocument,
  PopulatedVendor
} from "./proposal.model";

/**
 * Type guard to check populated vendor
 */
const isPopulatedVendor = (
  vendor: ProposalDocument["vendorId"]
): vendor is PopulatedVendor => {
  return (
    typeof vendor === "object" &&
    vendor !== null &&
    !(
      vendor instanceof Types.ObjectId
    )
  );
};

/**
 * Convert Proposal mongoose document into API-safe object
 */
export const mapProposalDocumentToProposal = (
  doc: ProposalDocument
) => {
  const vendor = isPopulatedVendor(doc.vendorId)
    ? {
        _id: doc.vendorId._id.toString(),
        name: doc.vendorId.name,
        email: doc.vendorId.email
      }
    : undefined;

  const vendorId = isPopulatedVendor(doc.vendorId)
    ? doc.vendorId._id.toString()
    : doc.vendorId.toString();

  return {
    _id: doc._id.toString(),
    rfpId: doc.rfpId,
    vendorId,
    vendor,
    rawResponseText: doc.rawResponseText,
    parsedData: doc.parsedData,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString()
  };
};
