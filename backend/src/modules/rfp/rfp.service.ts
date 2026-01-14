import { RfpModel } from "./rfp.model";
import { mapRfpDocumentToRfp } from "./rfp.mapper";
import {
  CreateRfpInput,
  Rfp,
  RfpStatus,
  StructuredRfp
} from "../../shared";

/**
 * TEMP AI STRUCTURING (Mock)
 * --------------------------------
 * This simulates AI behavior.
 * In Module 6, this will be replaced
 * by real Grok / LLaMA integration.
 */
const mockAiStructureRfp = async (
  rawText: string
): Promise<StructuredRfp> => {
  // Very naive mock – intentional
  return {
    items: [],
    additionalNotes: rawText
  };
};

/**
 * Create an RFP from natural language text.
 * Status starts as DRAFT.
 */
export const createRfpFromText = async (
  input: CreateRfpInput
): Promise<Rfp> => {
  const structuredData = await mockAiStructureRfp(input.rawText);

  const rfp = await RfpModel.create({
    title: input.rawText.slice(0, 60) + "...",
    rawText: input.rawText,
    structuredData,
    status: RfpStatus.DRAFT,
    vendorIds: [],
    sentToEmails: []
  });

  return mapRfpDocumentToRfp(rfp);
};

/**
 * Fetch all RFPs.
 */
export const getAllRfps = async (): Promise<Rfp[]> => {
  const rfps = await RfpModel.find().sort({ createdAt: -1 });
  return rfps.map(mapRfpDocumentToRfp);
};

/**
 * Fetch RFP by ID.
 */
export const getRfpById = async (rfpId: string): Promise<Rfp | null> => {
  const rfp = await RfpModel.findById(rfpId);
  return rfp ? mapRfpDocumentToRfp(rfp) : null;
};
