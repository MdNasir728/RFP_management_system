"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { apiGet, getErrorMessage } from "@/lib/api";
import { toast } from "react-toastify";
import { Vendor, ApiSuccessResponse } from "@/types/api.types";
import { VendorTable } from "@/components/vendors/VendorTable";
import { CreateVendorDialog } from "@/components/vendors/CreateVendorDialog";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await apiGet<ApiSuccessResponse<Vendor[]>>("/vendors");
      setVendors(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Vendors</h1>

        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Vendor
        </Button>
      </div>

      {/* Vendor Table */}
      <VendorTable vendors={vendors} loading={loading} />

      {/* Create Vendor Dialog */}
      <CreateVendorDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={fetchVendors}
      />
    </div>
  );
}
