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
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            RFP Details
          </h2>
          <p className="text-sm text-muted-foreground">
            {rfp.title}
          </p>
        </div>

        <Badge className={statusColorMap[rfp.status]}>
          {rfp.status.replaceAll("_", " ")}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* RAW RFP */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">
            Raw RFP Text
          </h3>
          <p className="text-sm whitespace-pre-wrap">
            {rfp.rawText}
          </p>
        </div>

        {/* STRUCTURED RFP */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">
            Structured RFP (AI Generated)
          </h3>

          {rfp.structuredData?.items?.length ? (
            <ul className="list-disc pl-5 text-sm space-y-1">
              {rfp.structuredData.items.map(
                (item: any, idx: number) => (
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
          ) : (
            <p className="text-sm text-muted-foreground">
              No structured data available.
            </p>
          )}

          {rfp.structuredData?.budget && (
            <p className="mt-2 text-sm">
              <strong>Budget:</strong>{" "}
              {rfp.structuredData.budget}
            </p>
          )}

          {rfp.structuredData?.timeline && (
            <p className="text-sm">
              <strong>Timeline:</strong>{" "}
              {rfp.structuredData.timeline}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
