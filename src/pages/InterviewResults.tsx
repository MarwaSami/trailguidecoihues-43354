import { useNavigate } from "react-router-dom";
import { useInterview } from "@/context/InterviewContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function InterviewResults() {
  const navigate = useNavigate();
  const { currentSession } = useInterview();

  if (!currentSession || currentSession.status !== 'completed') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">No Results Available</h1>
            <p className="text-muted-foreground mb-8">Please complete an interview first.</p>
            <Button onClick={() => navigate("/interview-practice")}>
              Go to Interview
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const confidenceScore = currentSession.confidenceScore || 0;
  const technicalScore = currentSession.technicalScore || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/interview-practice")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Interview
          </Button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Interview Results</h1>
            <p className="text-lg text-muted-foreground">
              Your interview performance summary
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-center">Confidence Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="relative w-40 h-40 mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - confidenceScore / 100)}`}
                        className="text-primary"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold">{confidenceScore}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Your confidence level during the interview
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-center">Technical Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="relative w-40 h-40 mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - technicalScore / 100)}`}
                        className="text-primary"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold">{technicalScore}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Your technical knowledge and skills
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {currentSession.transcript.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Interview Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {currentSession.transcript.map((entry, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        entry.role === 'user'
                          ? 'bg-primary/10 ml-8'
                          : 'bg-muted mr-8'
                      }`}
                    >
                      <p className="text-sm font-semibold mb-1">
                        {entry.role === 'user' ? 'You' : 'AI Interviewer'}
                      </p>
                      <p className="text-sm">{entry.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
