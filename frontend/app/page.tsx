"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { apiGet, getErrorMessage } from "@/lib/api";
import { toast } from "react-toastify";
import {
  ApiSuccessResponse,
  Rfp
} from "@/types/api.types";
import { RfpCard } from "@/components/rfp/RfpCard";
import { CreateRfpDialog } from "@/components/rfp/CreateRfpDialog";

export default function HomePage() {
  const [rfps, setRfps] = useState<Rfp[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchRfps = async () => {
    try {
      setLoading(true);
      const res = await apiGet<ApiSuccessResponse<Rfp[]>>("/rfps");
      setRfps(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRfps();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Requests for Proposal</h1>

        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create RFP
        </Button>
      </div>

      {/* RFP List */}
      {loading ? (
        <div className="rounded-lg border p-4 text-sm text-muted-foreground">
          Loading RFPs...
        </div>
      ) : rfps.length === 0 ? (
        <div className="rounded-lg border p-4 text-sm text-muted-foreground">
          No RFPs yet. Create your first RFP to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rfps.map((rfp) => (
            <RfpCard
              key={rfp._id}
              rfp={rfp}
              onRefresh={fetchRfps}
            />
          ))}
        </div>
      )}

      {/* Create RFP Dialog */}
      <CreateRfpDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={fetchRfps}
      />
    </div>
  );
}
