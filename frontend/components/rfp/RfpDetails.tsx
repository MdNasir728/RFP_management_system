import { Rfp } from "@/types/api.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RfpDetailsProps {
  rfp: Rfp;
}

export function RfpDetails({ rfp }: RfpDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>RFP Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Raw Text */}
        <div>
          <h3 className="mb-1 text-sm font-semibold text-muted-foreground">
            Raw RFP Description
          </h3>
          <p className="whitespace-pre-wrap text-sm">
            {rfp.rawText}
          </p>
        </div>

        {/* Structured Data */}
        <div>
          <h3 className="mb-1 text-sm font-semibold text-muted-foreground">
            Structured RFP (AI Generated)
          </h3>

          {rfp.structuredData?.items?.length ? (
            <ul className="list-disc pl-5 text-sm">
              {rfp.structuredData.items.map((item, idx) => (
                <li key={idx}>
                  {item.name}
                  {item.quantity && ` × ${item.quantity}`}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No structured items extracted.
            </p>
          )}

          {rfp.structuredData?.additionalNotes && (
            <p className="mt-2 text-sm">
              {rfp.structuredData.additionalNotes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
