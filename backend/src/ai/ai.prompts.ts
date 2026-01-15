export const SYSTEM_JSON_ONLY_PROMPT = `
You are a backend service.
You MUST return ONLY valid JSON.
NO explanations.
NO markdown.
NO extra text.
`;

/* ---------------- RFP STRUCTURING ---------------- */

export const buildRfpPrompt = (rawText: string) => `
Extract structured procurement data from this RFP.

RFP:
"""
${rawText}
"""

Return JSON in this exact shape:

{
  "items": [
    {
      "name": "string",
      "quantity": number | null,
      "specifications": string | null
    }
  ],
  "constraints": ["string"],
  "budget": string | null,
  "timeline": string | null,
  "evaluationCriteria": ["string"]
}
`;

/* ---------------- PROPOSAL PARSING ---------------- */

export const buildProposalParsingPrompt = (
  proposalText: string,
  rfpText: string
) => `
You are analyzing a vendor proposal email in response to an RFP.

RFP:
"""
${rfpText}
"""

VENDOR PROPOSAL:
"""
${proposalText}
"""

Extract structured proposal information.

Return JSON in this exact shape:

{
  "pricing": "string | null",
  "deliveryTimeline": "string | null",
  "paymentTerms": "string | null",
  "warranty": "string | null",
  "confidence": "LOW | MEDIUM | HIGH",
  "missingFields": ["string"]
}
`;

/* ---------------- PROPOSAL EVALUATION ---------------- */

export const buildProposalEvaluationPrompt = (
  structuredRfp: any,
  proposals: {
    vendorId: string;
    parsedData: any;
  }[]
) => `
You are evaluating vendor proposals against an RFP.

RFP REQUIREMENTS (structured):
${JSON.stringify(structuredRfp, null, 2)}

VENDOR PROPOSALS:
${JSON.stringify(proposals, null, 2)}

Evaluate all proposals carefully.

Return JSON in this EXACT shape:

{
  "recommendedVendorId": "string",

  "overallReasoning": "string",

  "scores": [
    {
      "vendorId": "string",
      "score": number,
      "reasoning": "string"
    }
  ]
}

Rules:
- overallReasoning must clearly explain WHY the recommended vendor was chosen over others.
- Scores must be between 0 and 100.
- reasoning should explain each vendor's strengths/weaknesses.
- Pick ONE recommendedVendorId.
- Do NOT hallucinate data.
`;

