import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, TrendingUp, AlertCircle, CheckCircle2, Sparkles, User, Calendar, Target, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface InterviewReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: string | null;
  score?: number;
  candidateName?: string;
}

interface KeyValueItemProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  valueClassName?: string;
}

const KeyValueItem: React.FC<KeyValueItemProps> = ({ label, value, icon, valueClassName = "" }) => (
  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-muted/40 to-muted/20 rounded-xl border border-border/20 hover:border-primary/30 transition-all">
    <div className="flex items-center gap-2">
      {icon && <span className="text-primary/70">{icon}</span>}
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
    <span className={`text-sm font-bold ${valueClassName || 'text-foreground'}`}>{value}</span>
  </div>
);

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
        weaknesses: [],
        technicalScore: null,
        communicationScore: null,
        problemSolvingScore: null
      };
    }

    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(reportText);
      return {
        summary: parsed.summary || reportText,
        strengths: parsed.strengths || [],
        weaknesses: parsed.weaknesses || parsed.areas_for_improvement || [],
        technicalScore: parsed.technical_score || parsed.technicalScore || null,
        communicationScore: parsed.communication_score || parsed.communicationScore || null,
        problemSolvingScore: parsed.problem_solving_score || parsed.problemSolvingScore || null
      };
    } catch {
      // If not JSON, treat as plain text summary
      return {
        summary: reportText,
        strengths: [],
        weaknesses: [],
        technicalScore: null,
        communicationScore: null,
        problemSolvingScore: null
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
    if (score >= 80) return { text: 'Excellent', variant: 'default' as const, color: 'bg-green-500/20 text-green-600 border-green-500/30' };
    if (score >= 60) return { text: 'Good', variant: 'outline' as const, color: 'bg-primary/20 text-primary border-primary/30' };
    return { text: 'Needs Improvement', variant: 'secondary' as const, color: 'bg-orange-500/20 text-orange-600 border-orange-500/30' };
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return 'Outstanding';
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Very Good';
    if (score >= 60) return 'Good';
    if (score >= 50) return 'Average';
    return 'Below Average';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-gradient-to-br from-card via-card/98 to-card backdrop-blur-xl border border-border/40 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-60" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-primary/8 to-transparent rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-accent/8 to-transparent rounded-full blur-3xl opacity-50" />
        
        <DialogHeader className="relative z-10 space-y-4 pb-4 border-b border-border/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
              <Award className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-foreground">
                Interview Performance Report
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground mt-1">
                Comprehensive analysis for {candidateName}
              </DialogDescription>
            </div>
            <Badge className={`px-4 py-1.5 text-sm font-semibold border ${getScoreBadge(score).color}`}>
              {getScoreBadge(score).text}
            </Badge>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6 relative z-10">
          {/* Top Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KeyValueItem 
              label="Candidate" 
              value={candidateName} 
              icon={<User className="w-4 h-4" />}
            />
            <KeyValueItem 
              label="Overall Score" 
              value={`${score}%`} 
              icon={<Target className="w-4 h-4" />}
              valueClassName={getScoreColor(score)}
            />
            <KeyValueItem 
              label="Performance" 
              value={getPerformanceLevel(score)} 
              icon={<BarChart3 className="w-4 h-4" />}
            />
            <KeyValueItem 
              label="Status" 
              value={score >= 60 ? 'Passed' : 'Review Needed'} 
              icon={<Calendar className="w-4 h-4" />}
              valueClassName={score >= 60 ? 'text-green-500' : 'text-orange-500'}
            />
          </div>

          {/* Score Section with Circular Chart */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Circular Score Chart */}
            <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/8 via-accent/5 to-primary/8 rounded-2xl border border-primary/20 backdrop-blur-sm">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Overall Score</h4>
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
                  <p className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">out of 100</p>
                </div>
              </div>
              
              {/* Score Breakdown */}
              {(result.technicalScore || result.communicationScore || result.problemSolvingScore) && (
                <div className="w-full mt-6 space-y-2">
                  {result.technicalScore && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Technical Skills</span>
                      <span className="font-semibold">{result.technicalScore}%</span>
                    </div>
                  )}
                  {result.communicationScore && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Communication</span>
                      <span className="font-semibold">{result.communicationScore}%</span>
                    </div>
                  )}
                  {result.problemSolvingScore && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Problem Solving</span>
                      <span className="font-semibold">{result.problemSolvingScore}%</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Summary Card */}
            <div className="p-6 bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl border border-border/30 backdrop-blur-sm flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground">Performance Summary</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap flex-1">
                {result.summary}
              </p>
            </div>
          </div>

          {/* Strengths and Weaknesses */}
          {(result.strengths.length > 0 || result.weaknesses.length > 0) && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              {result.strengths.length > 0 && (
                <div className="p-5 bg-gradient-to-br from-green-500/8 to-green-600/3 rounded-2xl border border-green-500/20 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md shadow-green-500/20">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-foreground">Key Strengths</h4>
                      <p className="text-xs text-muted-foreground">{result.strengths.length} identified</p>
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    {result.strengths.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 p-2.5 bg-green-500/5 rounded-lg border border-green-500/10 group hover:bg-green-500/10 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-foreground leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {result.weaknesses.length > 0 && (
                <div className="p-5 bg-gradient-to-br from-orange-500/8 to-orange-600/3 rounded-2xl border border-orange-500/20 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-foreground">Areas for Improvement</h4>
                      <p className="text-xs text-muted-foreground">{result.weaknesses.length} identified</p>
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    {result.weaknesses.map((w: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 p-2.5 bg-orange-500/5 rounded-lg border border-orange-500/10 group hover:bg-orange-500/10 transition-colors">
                        <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-foreground leading-relaxed">{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

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
