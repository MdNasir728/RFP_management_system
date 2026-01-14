import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Proposal } from "@/types/api.types";

interface ProposalTableProps {
  proposals: Proposal[];
  recommendedVendorId?: string;
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
  recommendedVendorId
}: ProposalTableProps) {
  if (!proposals.length) {
    return (
      <div className="rounded-lg border p-4 text-sm text-muted-foreground">
        No vendor proposals received yet.
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendor ID</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Recommendation</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {proposals.map((proposal) => {
            const isRecommended =
              proposal.vendorId === recommendedVendorId;

            return (
              <TableRow
                key={proposal._id}
                className={isRecommended ? "bg-green-50" : ""}
              >
                <TableCell className="font-mono text-xs">
                  {proposal.vendorId}
                </TableCell>

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

                <TableCell className="max-w-md">
                  <p className="text-sm">
                    {proposal.parsedData.notes ||
                      "No notes provided"}
                  </p>
                </TableCell>

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
