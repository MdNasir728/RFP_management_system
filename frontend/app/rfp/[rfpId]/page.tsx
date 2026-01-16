"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { apiGet, apiPost, getErrorMessage } from "@/lib/api";
import { Rfp, Proposal } from "@/types/api.types";

import { RfpDetails } from "@/components/rfp/RfpDetails";
import { ProposalTable } from "@/components/rfp/ProposalTable";
import { SendRfpDialog } from "@/components/rfp/SendRfpDialog";
import { Loader2 } from "lucide-react";

export default function RfpDetailPage() {
  const params = useParams();
  const rfpId = params?.rfpId as string;

  const [rfp, setRfp] = useState<Rfp | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [openSend, setOpenSend] = useState(false);

  const [loadingFetch, setLoadingFetch] =
    useState(false);
  const [loadingEval, setLoadingEval] =
    useState(false);

  const fetchRfp = async () => {
    const res = await apiGet<{ data: Rfp }>(
      `/rfps/${rfpId}`
    );
    setRfp(res.data);
  };

  const fetchProposals = async () => {
    const res = await apiGet<{
      data: Proposal[];
    }>(`/proposals?rfpId=${rfpId}`);
    setProposals(res.data);
  };

  const fetchVendorReplies = async () => {
    try {
      setLoadingFetch(true);
      toast.info("Fetching vendor replies...");
      await apiPost("/proposals/fetch-replies");
      await fetchProposals();
      await fetchRfp();
      toast.success("Replies fetched");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoadingFetch(false);
    }
  };

  const evaluate = async () => {
    try {
      setLoadingEval(true);
      toast.info("Evaluating proposals...");
      await apiPost(`/evaluation/${rfpId}`);
      await fetchRfp();
      toast.success("Evaluation completed");
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

  if (!rfp) return null;

  return (
    <div className="space-y-6">
      <RfpDetails
        rfp={rfp}
        proposals={proposals}
      />

      {/* Actions */}
      <div className="flex gap-3">
        {rfp.status === "DRAFT" && (
          <Button
            onClick={() => setOpenSend(true)}
          >
            Send to Vendors
          </Button>
        )}

        {rfp.status === "SENT" && (
          <Button
            onClick={fetchVendorReplies}
            disabled={loadingFetch}
          >
            {loadingFetch && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Fetch Vendor Replies
          </Button>
        )}

        {rfp.status === "RESPONSES_RECEIVED" &&
          proposals.length >= 2 && (
            <Button
              onClick={evaluate}
              disabled={loadingEval}
            >
              {loadingEval && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Evaluate Proposals
            </Button>
          )}
      </div>

      <SendRfpDialog
        open={openSend}
        onOpenChange={setOpenSend}
        rfp={rfp}
        onSuccess={fetchRfp}
      />

      <ProposalTable proposals={proposals} />
    </div>
  );
}
