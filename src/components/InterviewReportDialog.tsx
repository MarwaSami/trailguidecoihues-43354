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
  
  const chartData = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score }
  ];
  
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-primary';
    return 'text-orange-500';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { text: 'Excellent', variant: 'default' as const };
    if (score >= 60) return { text: 'Good', variant: 'outline' as const };
    return { text: 'Needs Improvement', variant: 'secondary' as const };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-gradient-to-br from-card/95 via-card/90 to-card/95 backdrop-blur-xl border border-border/30 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-60" />
        
        <DialogHeader className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                Interview Report
              </DialogTitle>
              <DialogDescription className="text-base">
                Performance analysis for {candidateName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6 relative z-10">
          {/* Score Section with Circular Chart */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Circular Score Chart */}
            <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 rounded-2xl border border-primary/20 backdrop-blur-sm shadow-lg">
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</p>
                  <p className="text-sm text-muted-foreground font-medium">out of 100</p>
                </div>
              </div>
              <Badge className="mt-4 px-4 py-1 text-sm font-semibold shadow-md" variant={getScoreBadge(score).variant}>
                {getScoreBadge(score).text}
              </Badge>
            </div>

            {/* Summary Card */}
            <div className="p-6 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl border border-border/30 backdrop-blur-sm shadow-lg space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Performance Summary</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {result.summary}
              </p>
            </div>
          </div>

          {/* Strengths and Weaknesses - Only show if available */}
          {(result.strengths.length > 0 || result.weaknesses.length > 0) && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              {result.strengths.length > 0 && (
                <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-2xl border border-green-500/20 backdrop-blur-sm shadow-lg space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-foreground">Strengths</h4>
                  </div>
                  <ul className="space-y-3">
                    {result.strengths.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="text-sm text-foreground leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {result.weaknesses.length > 0 && (
                <div className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-2xl border border-orange-500/20 backdrop-blur-sm shadow-lg space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-foreground">Areas for Improvement</h4>
                  </div>
                  <ul className="space-y-3">
                    {result.weaknesses.map((w: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="text-sm text-foreground leading-relaxed">{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4 flex justify-end">
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
