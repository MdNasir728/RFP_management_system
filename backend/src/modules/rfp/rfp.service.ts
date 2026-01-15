import { RfpModel } from "./rfp.model";
import { mapRfpDocumentToRfp } from "./rfp.mapper";
import { RfpStatus, Rfp } from "../../shared";

/* OLLAMA AI */
import { callOllama } from "../../ai/ai.client";
import {
  SYSTEM_JSON_ONLY_PROMPT,
  buildRfpPrompt
} from "../../ai/ai.prompts";
import { parseJsonStrict } from "../../ai/ai.parsers";

/**
 * Create a new RFP
 * ------------------------------------
 * Flow:
 * 1. Raw text input
 * 2. Ollama structures it (STRICT JSON)
 * 3. Parsed JSON stored in DB
 */
export const createRfp = async (
  rawText: string
): Promise<Rfp> => {
  if (!rawText || rawText.trim().length < 10) {
    throw new Error("RFP text must be at least 10 characters");
  }

  /**
   * HARD DEPENDENCY ON OLLAMA
   * If Ollama is not running or returns invalid JSON,
   * this WILL throw (intended behaviour).
   */
  const aiResponse = await callOllama(
    buildRfpPrompt(rawText),
    SYSTEM_JSON_ONLY_PROMPT
  );

  const structuredData = parseJsonStrict<{
    items: {
      name: string;
      quantity: number | null;
      specifications: string | null;
    }[];
    constraints: string[];
    budget: string | null;
    timeline: string | null;
    evaluationCriteria: string[];
  }>(aiResponse);

  const rfpDoc = await RfpModel.create({
    title: rawText.slice(0, 80),
    rawText,
    structuredData,
    status: RfpStatus.DRAFT,
    vendorIds: [],
    sentToEmails: []
  });

  return mapRfpDocumentToRfp(rfpDoc);
};

/**
 * Get all RFPs
 */
export const getAllRfps = async (): Promise<Rfp[]> => {
  const rfps = await RfpModel.find().sort({ createdAt: -1 });
  return rfps.map(mapRfpDocumentToRfp);
};

/**
 * Get RFP by ID
 */
export const getRfpById = async (
  rfpId: string
): Promise<Rfp | null> => {
  const rfp = await RfpModel.findById(rfpId);
  return rfp ? mapRfpDocumentToRfp(rfp) : null;
};
