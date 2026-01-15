"use client";

import { Rfp } from "@/types/api.types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RfpDetailsProps {
  rfp: Rfp;
}

const statusColorMap: Record<Rfp["status"], string> = {
  DRAFT: "bg-gray-200 text-gray-800",
  SENT: "bg-blue-100 text-blue-800",
  RESPONSES_RECEIVED: "bg-yellow-100 text-yellow-800",
  RECOMMENDED: "bg-green-100 text-green-800"
};

export function RfpDetails({ rfp }: RfpDetailsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {rfp.title}
          </h2>
        </div>
        <Badge className={statusColorMap[rfp.status]}>
          {rfp.status.replaceAll("_", " ")}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Raw RFP */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground">
            Raw RFP
          </h3>
          <p className="text-sm whitespace-pre-wrap">
            {rfp.rawText}
          </p>
        </div>

        {/* Structured RFP */}
        {rfp.structuredData?.items?.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground">
              Structured RFP
            </h3>
            <ul className="list-disc pl-5 text-sm">
              {rfp.structuredData.items.map(
                (item: any, idx: number) => (
                  <li key={idx}>
                    {item.name}
                    {item.quantity && ` × ${item.quantity}`}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        {/* Evaluation */}
        {rfp.evaluationResult && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground">
              AI Evaluation Summary
            </h3>
            <p className="text-sm">
              {rfp.evaluationResult.overallReasoning}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
