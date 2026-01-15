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

export default function RfpDetailPage() {
  const params = useParams();
  const rfpId = params?.rfpId as string;

  const [rfp, setRfp] = useState<Rfp | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [openSend, setOpenSend] = useState(false);

  const fetchRfp = async () => {
    try {
      const res = await apiGet<{ data: Rfp }>(
        `/rfps/${rfpId}`
      );
      setRfp(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const fetchProposals = async () => {
    try {
      const res = await apiGet<{ data: Proposal[] }>(
        `/proposals?rfpId=${rfpId}`
      );
      setProposals(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const fetchVendorReplies = async () => {
    try {
      toast.info("Fetching vendor replies...");
      await apiPost("/proposals/fetch-replies");
      await fetchProposals();
      await fetchRfp();
      toast.success("Replies fetched");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const evaluate = async () => {
    try {
      toast.info("Evaluating proposals...");
      await apiPost(`/evaluation/${rfpId}`);
      await fetchRfp();
      toast.success("Evaluation completed");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  useEffect(() => {
    fetchRfp();
    fetchProposals();
  }, [rfpId]);

  if (!rfp) return null;

  return (
    <div className="space-y-6">
      <RfpDetails rfp={rfp} />

      {/* Actions */}
      <div className="flex gap-3">
        {rfp.status === "DRAFT" && (
          <Button onClick={() => setOpenSend(true)}>
            Send to Vendors
          </Button>
        )}

        {rfp.status === "SENT" && (
          <Button onClick={fetchVendorReplies}>
            Fetch Vendor Replies
          </Button>
        )}

        {rfp.status === "RESPONSES_RECEIVED" &&
          proposals.length >= 2 && (
            <Button onClick={evaluate}>
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
