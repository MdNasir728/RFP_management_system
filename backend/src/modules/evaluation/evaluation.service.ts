import { RfpModel } from "../rfp/rfp.model";
import { ProposalModel } from "../proposal/proposal.model";
import { RfpStatus } from "../../shared";

/* AI imports */
import { callOllama } from "../../ai/ai.client";
import {
  SYSTEM_JSON_ONLY_PROMPT,
  buildProposalEvaluationPrompt
} from "../../ai/ai.prompts";
import {
  parseJsonStrict,
  validateEvaluationResult
} from "../../ai/ai.parsers";

/**
 * Evaluate proposals for an RFP using REAL AI
 */
export const evaluateRfpProposals = async (rfpId: string) => {
  const rfp = await RfpModel.findById(rfpId);
  if (!rfp) {
    throw new Error("RFP not found");
  }

  if (rfp.status !== RfpStatus.RESPONSES_RECEIVED) {
    throw new Error("RFP not ready for evaluation");
  }

  const proposals = await ProposalModel.find({ rfpId });
  if (proposals.length === 0) {
    throw new Error("No proposals found");
  }

  const aiResponse = await callOllama(
    buildProposalEvaluationPrompt(
      rfp.structuredData,
      proposals.map((p) => ({
        vendorId: p.vendorId,
        parsedData: p.parsedData
      }))
    ),
    SYSTEM_JSON_ONLY_PROMPT
  );

  const parsed = parseJsonStrict<any>(aiResponse);
  const evaluation = validateEvaluationResult(parsed);

  rfp.status = RfpStatus.RECOMMENDED;
  rfp.set("evaluationResult", {
    ...evaluation,
    evaluatedAt: new Date()
  });

  await rfp.save();

  return evaluation;
};
