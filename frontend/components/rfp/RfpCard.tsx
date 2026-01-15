"use client";

import Link from "next/link";
import { useState } from "react";
import { Rfp } from "@/types/api.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SendRfpDialog } from "./SendRfpDialog";

interface RfpCardProps {
  rfp: Rfp;
  onRefresh: () => void;
}

const statusColorMap: Record<Rfp["status"], string> = {
  DRAFT: "bg-gray-200 text-gray-800",
  SENT: "bg-blue-100 text-blue-800",
  RESPONSES_RECEIVED: "bg-yellow-100 text-yellow-800",
  RECOMMENDED: "bg-green-100 text-green-800"
};

export function RfpCard({ rfp, onRefresh }: RfpCardProps) {
  const [openSend, setOpenSend] = useState(false);

  return (
    <>
      <Link href={`/rfp/${rfp._id}`} className="block">
        <div className="rounded-lg border p-4 space-y-3 hover:bg-muted cursor-pointer">
          {/* Header */}
          <div className="flex items-start justify-between">
            <h3 className="font-medium leading-snug">
              {rfp.title}
            </h3>

            <Badge className={statusColorMap[rfp.status]}>
              {rfp.status.replaceAll("_", " ")}
            </Badge>
          </div>

          <div className="text-sm text-muted-foreground">
            Created on{" "}
            {new Date(rfp.createdAt).toLocaleDateString()}
          </div>
        </div>
      </Link>

      {/* Action outside link */}
      {rfp.status === "DRAFT" && (
        <div className="mt-2">
          <Button
            size="sm"
            className="w-full"
            onClick={() => setOpenSend(true)}
          >
            Send to Vendors
          </Button>
        </div>
      )}

      <SendRfpDialog
        open={openSend}
        onOpenChange={setOpenSend}
        rfp={rfp}
        onSuccess={onRefresh}
      />
    </>
  );
}
