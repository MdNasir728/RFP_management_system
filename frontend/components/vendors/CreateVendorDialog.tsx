"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost, getErrorMessage } from "@/lib/api";
import { toast } from "react-toastify";
import { ApiSuccessResponse, Vendor } from "@/types/api.types";

interface CreateVendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface CreateVendorPayload {
  name: string;
  email: string;
  companyName?: string;
  phoneNumber?: string;
}

export function CreateVendorDialog({
  open,
  onOpenChange,
  onSuccess
}: CreateVendorDialogProps) {
  const [form, setForm] = useState<CreateVendorPayload>({
    name: "",
    email: "",
    companyName: "",
    phoneNumber: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof CreateVendorPayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      toast.error("Name and email are required");
      return;
    }

    try {
      setLoading(true);

      await apiPost<ApiSuccessResponse<Vendor>, CreateVendorPayload>(
        "/vendors",
        {
          name: form.name.trim(),
          email: form.email.trim(),
          companyName: form.companyName?.trim() || undefined,
          phoneNumber: form.phoneNumber?.trim() || undefined
        }
      );

      toast.success("Vendor created successfully");
      onOpenChange(false);
      onSuccess();

      // Reset form
      setForm({
        name: "",
        email: "",
        companyName: "",
        phoneNumber: ""
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Vendor</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Vendor name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="vendor@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={form.companyName}
              onChange={(e) =>
                handleChange("companyName", e.target.value)
              }
              placeholder="Company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phoneNumber}
              onChange={(e) =>
                handleChange("phoneNumber", e.target.value)
              }
              placeholder="+91xxxxxxxxxx"
            />
          </div>
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
            {loading ? "Creating..." : "Create Vendor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
