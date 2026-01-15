import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, TrendingUp, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface InterviewReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: string | null;
  score?: number;
  candidateName?: string;
}

export const InterviewReportDialog: React.FC<InterviewReportDialogProps> = ({ 
  open, 
  onOpenChange, 
  report, 
  score = 70,
  candidateName = "Candidate"
}) => {
  // Parse the report to extract summary, strengths, and weaknesses
  const parseReport = (reportText: string | null) => {
    console.log("Raw report text:", reportText);
    if (!reportText) {
      return {
        summary: 'No interview report available.',
        strengths: [],
        weaknesses: []
      };
    }

    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(reportText);
      console.log("Reported Text :", reportText);
      console.log("Parsed report:", parsed);
      return {
        summary: parsed.summary || reportText,
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || parsed.areas_for_improvement || []
      };
    } catch {
      // If not JSON, treat as plain text summary
      return {
        summary: reportText,
        strengths: [],
        weaknesses: []
      };
    }
  };

  const result = parseReport(report);
  console.log("Parsed Result:", result);  
  const chartData = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score }
  ];
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e'; // green-500
    if (score >= 60) return 'hsl(var(--primary))';
    return '#f97316'; // orange-500
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-primary';
    return 'text-orange-500';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { text: 'Excellent', color: 'bg-green-500 text-white' };
    if (score >= 60) return { text: 'Good', color: 'bg-primary text-primary-foreground' };
    return { text: 'Needs Improvement', color: 'bg-orange-500 text-white' };
  };

  const COLORS = [getScoreColor(score), 'hsl(var(--muted))'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-card border border-border/40 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2 pb-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-foreground">
                Interview Report
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Comprehensive performance analysis and feedback
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Score Section with Circular Chart and Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Circular Score Chart */}
            <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 rounded-2xl">
              <div className="relative w-44 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={72}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className={`text-5xl font-bold ${getScoreTextColor(score)}`}>{score}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">out of 100</p>
                </div>
              </div>
              
              <Badge className={`mt-4 px-6 py-1.5 text-sm font-semibold ${getScoreBadge(score).color}`}>
                {getScoreBadge(score).text}
              </Badge>
            </div>

            {/* Summary Card */}
            <div className="p-6 bg-muted/30 rounded-2xl flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Performance Summary</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap flex-1">
                {result.summary}
              </p>
            </div>
          </div>

          {/* Strengths and Weaknesses - Always show side by side */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="p-5 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-foreground">Strengths</h4>
              </div>
              {result.strengths.length > 0 ? (
                <div className="space-y-3">
                  {result.strengths.map((s: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-foreground leading-relaxed">{s}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No specific strengths identified.</p>
              )}
            </div>

            {/* Areas for Improvement */}
            <div className="p-5 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-foreground">Areas for Improvement</h4>
              </div>
              {result.weaknesses.length > 0 ? (
                <div className="space-y-3">
                  {result.weaknesses.map((w: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-foreground leading-relaxed">{w}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No specific areas for improvement identified.</p>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 flex justify-end border-t border-border/30">
            <Button 
              onClick={() => onOpenChange(false)}
              className="h-11 px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-md hover:shadow-lg transition-all font-semibold"
            >
              Close Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewReportDialog;
