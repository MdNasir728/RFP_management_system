import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EvaluationResult } from "@/types/api.types";

interface RecommendationCardProps {
  evaluation: EvaluationResult;
}

export function RecommendationCard({
  evaluation
}: RecommendationCardProps) {
  return (
    <Card className="border-green-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          AI Recommendation
          <Badge className="bg-green-600 text-white">
            Final
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Recommended Vendor */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground">
            Recommended Vendor
          </h3>
          <p className="mt-1 font-mono text-sm">
            {evaluation.recommendedVendorId}
          </p>
        </div>

        {/* Scoring Breakdown */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
            Scoring Breakdown
          </h3>

          <div className="space-y-2">
            {evaluation.scores.map((score) => (
              <div
                key={score.vendorId}
                className="rounded-md border p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs">
                    {score.vendorId}
                  </span>
                  <Badge variant="outline">
                    Score: {score.score}
                  </Badge>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {score.reasoning}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
