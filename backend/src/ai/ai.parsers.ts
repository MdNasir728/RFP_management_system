export const parseJsonStrict = <T>(raw: string): T => {
  if (!raw || typeof raw !== "string") {
    throw new Error("Empty AI response");
  }

  const cleaned = raw
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.error("❌ Raw AI output:", raw);
    throw new Error("Invalid JSON from AI");
  }
};

/* ---------- Proposal Parsing ---------- */

export const validateParsedProposal = (data: any) => {
  const confidenceValues = ["LOW", "MEDIUM", "HIGH"];

  return {
    pricing: typeof data.pricing === "string" ? data.pricing : null,
    deliveryTimeline:
      typeof data.deliveryTimeline === "string"
        ? data.deliveryTimeline
        : null,
    paymentTerms:
      typeof data.paymentTerms === "string"
        ? data.paymentTerms
        : null,
    warranty: typeof data.warranty === "string" ? data.warranty : null,
    confidence: confidenceValues.includes(data.confidence)
      ? data.confidence
      : "LOW",
    missingFields: Array.isArray(data.missingFields)
      ? data.missingFields.filter((f: any) => typeof f === "string")
      : []
  };
};

/* ---------- Evaluation Validation ---------- */

export const validateEvaluationResult = (data: any) => {
  if (
    !data ||
    typeof data.recommendedVendorId !== "string" ||
    typeof data.overallReasoning !== "string" ||
    !Array.isArray(data.scores)
  ) {
    throw new Error("Invalid evaluation format");
  }

  return {
    recommendedVendorId: data.recommendedVendorId,
    overallReasoning: data.overallReasoning,
    scores: data.scores
      .filter(
        (s: any) =>
          typeof s.vendorId === "string" &&
          typeof s.score === "number" &&
          typeof s.reasoning === "string"
      )
      .map((s: any) => ({
        vendorId: s.vendorId,
        score: Math.min(100, Math.max(0, s.score)),
        reasoning: s.reasoning
      }))
  };
};
