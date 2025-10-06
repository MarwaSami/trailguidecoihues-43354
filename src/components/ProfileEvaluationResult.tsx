import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import { ProfileEvaluationResponse } from "@/services/pythonBackendApi";

interface ProfileEvaluationResultProps {
  result: ProfileEvaluationResponse | null;
}

export const ProfileEvaluationResult = ({ result }: ProfileEvaluationResultProps) => {
  if (!result) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <Card className="p-6 mt-6 animate-fade-in">
      <div className="flex items-start gap-4">
        {result.success ? (
          <CheckCircle2 className="w-6 h-6 text-green-600 mt-1" />
        ) : (
          <AlertCircle className="w-6 h-6 text-red-600 mt-1" />
        )}
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Profile Evaluation</h3>
            <Badge variant={getScoreBadgeVariant(result.score)} className="text-lg px-4 py-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              {result.score}/100
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Evaluation Comments:</h4>
              <p className="text-muted-foreground">{result.comments}</p>
            </div>

            {result.suggestions && result.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Suggestions for Improvement:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.profileId && (
              <p className="text-sm text-muted-foreground">
                Profile ID: {result.profileId}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
