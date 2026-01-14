"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { apiGet, apiPost, getErrorMessage } from "@/lib/api";
import { toast } from "react-toastify";
import {
  ApiSuccessResponse,
  Vendor,
  Rfp
} from "@/types/api.types";

interface SendRfpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfp: Rfp;
  onSuccess: () => void;
}

export function SendRfpDialog({
  open,
  onOpenChange,
  rfp,
  onSuccess
}: SendRfpDialogProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const fetchVendors = async () => {
    try {
      setFetching(true);
      const res = await apiGet<ApiSuccessResponse<Vendor[]>>("/vendors");
      setVendors(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchVendors();
      setSelectedVendorIds([]);
    }
  }, [open]);

  const toggleVendor = (vendorId: string) => {
    setSelectedVendorIds((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSend = async () => {
    if (selectedVendorIds.length === 0) {
      toast.error("Please select at least one vendor");
      return;
    }

    try {
      setLoading(true);

      await apiPost<
        ApiSuccessResponse<{ sentTo: string[] }>,
        { rfpId: string; vendorIds: string[] }
      >("/emails/send-rfp", {
        rfpId: rfp._id,
        vendorIds: selectedVendorIds
      });

      toast.success("RFP sent to selected vendors");
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send RFP to Vendors</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[300px] overflow-y-auto">
          {fetching ? (
            <div className="text-sm text-muted-foreground">
              Loading vendors...
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No vendors available.
            </div>
          ) : (
            vendors.map((vendor) => (
              <label
                key={vendor._id}
                className="flex items-center gap-3 rounded-md border p-3 cursor-pointer"
              >
                <Checkbox
                  checked={selectedVendorIds.includes(vendor._id)}
                  onCheckedChange={() => toggleVendor(vendor._id)}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {vendor.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {vendor.email}
                  </span>
                </div>
              </label>
            ))
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={loading}>
            {loading ? "Sending..." : "Send RFP"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
