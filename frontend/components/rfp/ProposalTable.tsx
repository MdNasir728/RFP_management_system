"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Proposal } from "@/types/api.types";

interface ProposalTableProps {
  proposals: Proposal[];
}

export function ProposalTable({ proposals }: ProposalTableProps) {
  if (!proposals.length) {
    return (
      <div className="rounded-lg border p-4 text-sm text-muted-foreground">
        No proposals available for this RFP.
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendor Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Proposal Details</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {proposals.map((proposal) => (
            <TableRow key={proposal._id}>
              {/* Vendor Name */}
              <TableCell className="font-medium">
                {proposal.vendor?.name ?? "Unknown Vendor"}
              </TableCell>

              {/* Vendor Email */}
              <TableCell className="text-sm">
                {proposal.vendor?.email ?? "-"}
              </TableCell>

              {/* Proposal Details */}
              <TableCell className="text-sm space-y-1">
                {proposal.parsedData.pricing && (
                  <div>
                    <strong>Pricing:</strong>{" "}
                    {proposal.parsedData.pricing}
                  </div>
                )}
                {proposal.parsedData.deliveryTimeline && (
                  <div>
                    <strong>Delivery:</strong>{" "}
                    {proposal.parsedData.deliveryTimeline}
                  </div>
                )}
                {proposal.parsedData.paymentTerms && (
                  <div>
                    <strong>Payment:</strong>{" "}
                    {proposal.parsedData.paymentTerms}
                  </div>
                )}
                {proposal.parsedData.warranty && (
                  <div>
                    <strong>Warranty:</strong>{" "}
                    {proposal.parsedData.warranty}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
