"use client";

import { Rfp, Proposal } from "@/types/api.types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RfpDetailsProps {
  rfp: Rfp;
  proposals: Proposal[];
}

const statusColorMap: Record<Rfp["status"], string> = {
  DRAFT: "bg-gray-200 text-gray-800",
  SENT: "bg-blue-100 text-blue-800",
  RESPONSES_RECEIVED: "bg-yellow-100 text-yellow-800",
  RECOMMENDED: "bg-green-100 text-green-800"
};

export function RfpDetails({ rfp, proposals }: RfpDetailsProps) {
  const evaluation = rfp.evaluationResult;

  const recommendedVendor = evaluation
    ? proposals.find(
        (p) =>
          p.vendorId ===
          evaluation.recommendedVendorId
      )?.vendor
    : null;

  return (
    <Card>
      <CardHeader className="flex flex-row justify-end">

        <Badge className={statusColorMap[rfp.status]}>
          {rfp.status.replaceAll("_", " ")}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Raw RFP */}
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground">
            Raw RFP
          </h3>
          <p className="text-sm whitespace-pre-wrap">
            {rfp.rawText}
          </p>
        </section>

        {/* Structured RFP */}
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground">
            Structured RFP
          </h3>

          <ul className="list-disc pl-5 text-sm space-y-1">
            {rfp.structuredData.items.map(
              (item, idx) => (
                <li key={idx}>
                  <strong>{item.name}</strong>
                  {item.quantity &&
                    ` × ${item.quantity}`}
                  {item.specifications &&
                    ` — ${item.specifications}`}
                </li>
              )
            )}
          </ul>

          <div className="mt-3 space-y-1 text-sm">
            {rfp.structuredData.budget && (
              <div>
                <strong>Budget:</strong>{" "}
                {rfp.structuredData.budget}
              </div>
            )}

            {rfp.structuredData.timeline && (
              <div>
                <strong>Timeline:</strong>{" "}
                {rfp.structuredData.timeline}
              </div>
            )}

            {rfp.structuredData.constraints && rfp.structuredData.constraints?.length >
              0 && (
              <div>
                <strong>Constraints:</strong>{" "}
                {rfp.structuredData.constraints.join(
                  ", "
                )}
              </div>
            )}
          </div>
        </section>

        {/* Evaluation */}
        {evaluation && recommendedVendor && (
          <section className="rounded-md border p-4 space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              AI Recommendation
            </h3>

            <p className="text-sm">
              {evaluation.overallReasoning}
            </p>

            <div className="mt-2 text-sm">
              <strong>Recommended Vendor:</strong>
              <div className="mt-1">
                {recommendedVendor.name}
              </div>
              <div className="text-muted-foreground">
                {recommendedVendor.email}
              </div>
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
