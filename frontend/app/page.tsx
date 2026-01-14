"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Requests for Proposal</h1>

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create RFP
        </Button>
      </div>

      {/* RFP list placeholder */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4 text-sm text-muted-foreground">
          No RFPs yet. Create your first RFP to get started.
        </div>
      </div>
    </div>
  );
}
