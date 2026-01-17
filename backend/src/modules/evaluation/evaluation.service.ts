import { Types } from "mongoose";
import { RfpModel } from "../rfp/rfp.model";
import { ProposalModel } from "../proposal/proposal.model";
import { PopulatedVendor } from "../proposal/proposal.model";
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
export const evaluateRfpProposals = async (
  rfpId: string
) => {
  const rfp = await RfpModel.findById(rfpId);
  if (!rfp) {
    throw new Error("RFP not found");
  }

  if (rfp.status !== RfpStatus.RESPONSES_RECEIVED) {
    throw new Error("RFP not ready for evaluation");
  }

  const proposals = await ProposalModel.find({ rfpId });
  if (proposals.length < 2) {
    throw new Error(
      "At least two proposals are required for evaluation"
    );
  }

  /**
   * Normalize vendorId to string
   * (AI layer must never receive ObjectId / mongoose types)
   */
  const normalizedProposals = proposals.map((p) => {
    let vendorId: string;

    if (p.vendorId instanceof Types.ObjectId) {
      vendorId = p.vendorId.toString();
    } else {
      // populated vendor
      vendorId = (p.vendorId as PopulatedVendor)._id.toString();
    }

    return {
      vendorId,
      parsedData: p.parsedData
    };
  });

  const aiResponse = await callOllama(
    buildProposalEvaluationPrompt(
      rfp.structuredData,
      normalizedProposals
    ),
    SYSTEM_JSON_ONLY_PROMPT
  );

  const parsed = parseJsonStrict<{
    recommendedVendorId: string,
    overallReasoning: string,
    scores: [
      {
        vendorId: string,
        score: number,
        reasoning: string
      }
    ]
  }>(aiResponse);
  const evaluation = validateEvaluationResult(parsed);

  rfp.status = RfpStatus.RECOMMENDED;
  rfp.set("evaluationResult", {
    recommendedVendorId: evaluation.recommendedVendorId,
    overallReasoning: evaluation.overallReasoning,
    scores: evaluation.scores,
    evaluatedAt: new Date()
  });

  await rfp.save();

  return evaluation;
};
