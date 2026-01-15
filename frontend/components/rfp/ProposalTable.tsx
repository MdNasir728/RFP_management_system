"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Proposal, EvaluationResult } from "@/types/api.types";

interface ProposalTableProps {
  proposals: Proposal[];
  evaluation: EvaluationResult | null;
}

const confidenceColorMap: Record<
  Proposal["parsedData"]["confidence"],
  string
> = {
  LOW: "bg-red-100 text-red-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-green-100 text-green-800"
};

export function ProposalTable({
  proposals,
  evaluation
}: ProposalTableProps) {
  if (!proposals.length) {
    return (
      <div className="rounded-lg border p-4 text-sm text-muted-foreground">
        No vendor proposals available.
      </div>
    );
  }

  const scoreMap = new Map(
    evaluation?.scores.map((s) => [
      s.vendorId,
      s
    ]) || []
  );

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendor</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>Key Details</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {proposals.map((proposal) => {
            const score = scoreMap.get(
              proposal.vendorId
            );
            const isRecommended =
              evaluation?.recommendedVendorId ===
              proposal.vendorId;

            return (
              <TableRow
                key={proposal._id}
                className={
                  isRecommended ? "bg-green-50" : ""
                }
              >
                {/* Vendor */}
                <TableCell>
                  <div className="text-sm font-medium">
                    {proposal.vendorId}
                  </div>
                </TableCell>

                {/* Confidence */}
                <TableCell>
                  <Badge
                    className={
                      confidenceColorMap[
                        proposal.parsedData.confidence
                      ]
                    }
                  >
                    {proposal.parsedData.confidence}
                  </Badge>
                </TableCell>

                {/* Key Details */}
                <TableCell className="max-w-md text-sm">
                  {proposal.parsedData.pricing && (
                    <div>
                      <strong>Pricing:</strong>{" "}
                      {proposal.parsedData.pricing}
                    </div>
                  )}
                  {proposal.parsedData.deliveryTimeline && (
                    <div>
                      <strong>Delivery:</strong>{" "}
                      {
                        proposal.parsedData
                          .deliveryTimeline
                      }
                    </div>
                  )}
                  {proposal.parsedData.paymentTerms && (
                    <div>
                      <strong>Payment:</strong>{" "}
                      {
                        proposal.parsedData.paymentTerms
                      }
                    </div>
                  )}
                  {proposal.parsedData.warranty && (
                    <div>
                      <strong>Warranty:</strong>{" "}
                      {proposal.parsedData.warranty}
                    </div>
                  )}
                </TableCell>

                {/* Score */}
                <TableCell>
                  {score ? (
                    <Badge variant="outline">
                      {score.score}/100
                    </Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>

                {/* Recommendation */}
                <TableCell>
                  {isRecommended ? (
                    <Badge className="bg-green-600 text-white">
                      Recommended
                    </Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
