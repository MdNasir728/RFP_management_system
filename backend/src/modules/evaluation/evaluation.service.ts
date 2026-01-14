import { RfpModel } from "../rfp/rfp.model";
import { ProposalModel } from "../proposal/proposal.model";
import { VendorModel } from "../vendor/vendor.model";
import { RfpStatus } from "../../shared";

/**
 * TEMP AI SCORING (Mock)
 * ---------------------
 * Scores proposals on a simple heuristic.
 * This will be replaced by real AI reasoning later.
 */
const mockAiScoreProposal = (
  proposalText: string
): { score: number; reasoning: string } => {
  const lengthScore = Math.min(proposalText.length / 10, 100);

  return {
    score: Math.round(lengthScore),
    reasoning:
      "Score based on proposal completeness and alignment with RFP requirements."
  };
};

/**
 * Evaluate proposals for an RFP and recommend a vendor.
 */
export const evaluateRfpProposals = async (
  rfpId: string
): Promise<{
  recommendedVendorId: string;
  scores: {
    vendorId: string;
    score: number;
    reasoning: string;
  }[];
}> => {
  const rfp = await RfpModel.findById(rfpId);
  if (!rfp) {
    throw new Error("RFP not found");
  }

  if (rfp.status !== RfpStatus.RESPONSES_RECEIVED) {
    throw new Error("RFP is not ready for evaluation");
  }

  const proposals = await ProposalModel.find({ rfpId });
  if (!proposals.length) {
    throw new Error("No proposals found for this RFP");
  }

  const scores = [];

  for (const proposal of proposals) {
    const { score, reasoning } = mockAiScoreProposal(
      proposal.rawResponseText
    );

    scores.push({
      vendorId: proposal.vendorId,
      score,
      reasoning
    });
  }

  // Pick highest score
  scores.sort((a, b) => b.score - a.score);
  const recommendedVendorId = scores[0].vendorId;

  // Update RFP status
  rfp.status = RfpStatus.RECOMMENDED;
  await rfp.save();

  return {
    recommendedVendorId,
    scores
  };
};
