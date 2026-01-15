"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { apiGet, apiPost, getErrorMessage } from "@/lib/api";
import {
  ApiSuccessResponse,
  Rfp,
  Proposal,
  EvaluationResult
} from "@/types/api.types";

import { RfpDetails } from "@/components/rfp/RfpDetails";
import { ProposalTable } from "@/components/rfp/ProposalTable";
import { RecommendationCard } from "@/components/rfp/RecommendationCard";

export default function RfpDetailPage() {
  const params = useParams();
  const rfpId = params?.rfpId as string;


  const [rfp, setRfp] = useState<Rfp | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [evaluation, setEvaluation] =
    useState<EvaluationResult | null>(null);

  const [loadingReplies, setLoadingReplies] = useState(false);
  const [loadingEvaluation, setLoadingEvaluation] =
    useState(false);

  /* ---------------- FETCH RFP ---------------- */

  const fetchRfp = async () => {
    try {
      const res =
        await apiGet<ApiSuccessResponse<Rfp>>(
          `/rfps/${rfpId}`
        );
      setRfp(res.data);
      setEvaluation(
        res.data.evaluationResult || null
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  /* ---------------- FETCH PROPOSALS (MANUAL) ---------------- */

  const fetchVendorReplies = async () => {
    try {
      setLoadingReplies(true);
      toast.info("Fetching vendor replies...");

      const res =
        await apiPost<
          ApiSuccessResponse<{ proposals: Proposal[] }>
        >("/proposals/fetch-replies");

      setProposals(res.data.proposals || []);
      toast.success("Vendor replies fetched");
      fetchRfp();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoadingReplies(false);
    }
  };

  /* ---------------- EVALUATE PROPOSALS ---------------- */

  const evaluateProposals = async () => {
    try {
      setLoadingEvaluation(true);
      toast.info("Evaluating proposals using AI...");

      const res =
        await apiPost<ApiSuccessResponse<EvaluationResult>>(
          `/evaluation/${rfpId}`
        );

      setEvaluation(res.data);
      toast.success("AI recommendation generated");
      fetchRfp();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoadingEvaluation(false);
    }
  };

  useEffect(() => {
    fetchRfp();
  }, [rfpId]);

  if (!rfp) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading RFP details...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* RFP DETAILS */}
      <RfpDetails rfp={rfp} />

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap gap-3">
        {rfp.status === "SENT" && (
          <Button
            onClick={fetchVendorReplies}
            disabled={loadingReplies}
          >
            {loadingReplies
              ? "Fetching Replies..."
              : "Fetch Vendor Replies"}
          </Button>
        )}

        {rfp.status === "RESPONSES_RECEIVED" && (
          <Button
            onClick={evaluateProposals}
            disabled={loadingEvaluation}
          >
            {loadingEvaluation
              ? "Evaluating..."
              : "Evaluate Proposals"}
          </Button>
        )}
      </div>

      {/* PROPOSALS TABLE */}
      <ProposalTable
        proposals={proposals}
        evaluation={evaluation}
      />

      {/* AI RECOMMENDATION */}
      {evaluation && (
        <RecommendationCard evaluation={evaluation} />
      )}
    </div>
  );
}
