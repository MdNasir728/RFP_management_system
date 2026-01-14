"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiGet, apiPost, getErrorMessage } from "@/lib/api";
import { toast } from "react-toastify";
import {
  ApiSuccessResponse,
  Rfp,
  Proposal,
  EvaluationResult
} from "@/types/api.types";
import { Button } from "@/components/ui/button";
import { RfpDetails } from "@/components/rfp/RfpDetails";
import { ProposalTable } from "@/components/rfp/ProposalTable";
import { RecommendationCard } from "@/components/rfp/RecommendationCard";

export default function RfpDetailPage() {
  const { rfpId } = useParams<{ rfpId: string }>();

  const [rfp, setRfp] = useState<Rfp | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [loadingEval, setLoadingEval] = useState(false);

  const fetchRfp = async () => {
    try {
      const res = await apiGet<ApiSuccessResponse<Rfp>>(`/rfps/${rfpId}`);
      setRfp(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const fetchProposals = async () => {
    try {
      toast.info("Fetching vendor replies...");
      const res = await apiPost<ApiSuccessResponse<{ proposals: Proposal[] }>>(
        "/proposals/fetch-replies"
      );
      setProposals(res.data.proposals || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const evaluate = async () => {
    try {
      setLoadingEval(true);
      const res = await apiPost<ApiSuccessResponse<EvaluationResult>>(
        `/evaluation/${rfpId}`
      );
      setEvaluation(res.data);
      toast.success("AI recommendation generated");
      fetchRfp();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoadingEval(false);
    }
  };

  useEffect(() => {
    fetchRfp();
    fetchProposals();
  }, [rfpId]);

  if (!rfp) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading RFP...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RfpDetails rfp={rfp} />

      <ProposalTable
        proposals={proposals}
        recommendedVendorId={evaluation?.recommendedVendorId}
      />

      {rfp.status === "RESPONSES_RECEIVED" && (
        <Button onClick={evaluate} disabled={loadingEval}>
          {loadingEval ? "Evaluating..." : "Evaluate Proposals"}
        </Button>
      )}

      {evaluation && (
        <RecommendationCard evaluation={evaluation} />
      )}
    </div>
  );
}
