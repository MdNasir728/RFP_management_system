"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EvaluationResult } from "@/types/api.types";

interface RecommendationCardProps {
  evaluation: EvaluationResult;
}

export function RecommendationCard({
  evaluation
}: RecommendationCardProps) {
  const recommendedScore = evaluation.scores.find(
    (s) =>
      s.vendorId ===
      evaluation.recommendedVendorId
  );

  return (
    <Card className="border-green-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          AI Recommendation
          <Badge className="bg-green-600 text-white">
            Final Decision
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

        {/* Reasoning */}
        {recommendedScore && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground">
              Reasoning
            </h3>
            <p className="mt-1 text-sm">
              {recommendedScore.reasoning}
            </p>
          </div>
        )}

        {/* Score Summary */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground">
            Scoring Summary
          </h3>

          <div className="mt-2 space-y-2">
            {evaluation.scores.map((score) => {
              const isWinner =
                score.vendorId ===
                evaluation.recommendedVendorId;

              return (
                <div
                  key={score.vendorId}
                  className={`rounded-md border p-3 ${
                    isWinner
                      ? "border-green-500 bg-green-50"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs">
                      {score.vendorId}
                    </span>
                    <Badge
                      variant={
                        isWinner ? "default" : "outline"
                      }
                    >
                      {score.score}/100
                    </Badge>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {score.reasoning}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
