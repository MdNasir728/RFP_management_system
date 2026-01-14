"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiPost, getErrorMessage } from "@/lib/api";
import { toast } from "react-toastify";
import { ApiSuccessResponse, Rfp } from "@/types/api.types";

interface CreateRfpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface CreateRfpPayload {
  rawText: string;
}

export function CreateRfpDialog({
  open,
  onOpenChange,
  onSuccess
}: CreateRfpDialogProps) {
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rawText.trim().length < 10) {
      toast.error("RFP description must be at least 10 characters");
      return;
    }

    try {
      setLoading(true);

      await apiPost<ApiSuccessResponse<Rfp>, CreateRfpPayload>(
        "/rfps",
        { rawText: rawText.trim() }
      );

      toast.success("RFP created successfully");
      onOpenChange(false);
      onSuccess();
      setRawText("");
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
          <DialogTitle>Create RFP</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Textarea
            placeholder="Describe your requirements in detail..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={6}
          />
          <p className="text-xs text-muted-foreground">
            Enter a clear description of your requirements.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create RFP"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
