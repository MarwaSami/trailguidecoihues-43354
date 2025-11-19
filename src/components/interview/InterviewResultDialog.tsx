import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInterview } from '@/context/InterviewContext';
import { Award, TrendingUp, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const InterviewResultDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const { currentSession } = useInterview();

  const result = currentSession?.result ?? {
    score: 70,
    summary:
      'The candidate demonstrates a fundamental understanding of Angular and has experience in developing web applications, specifically e-commerce. However, they need to show a deeper knowledge of state management and responsive design principles to meet the requirements fully.',
    strengths: ['Experience with Angular in real projects', 'Practical knowledge of e-commerce application development'],
    weaknesses: ['Lacks depth in explaining state management', 'Limited detailed experience with responsive design'],
  };

  const score = result.score ?? 70;
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
      <DialogContent className="max-w-4xl bg-gradient-to-br from-card/95 via-card/90 to-card/95 backdrop-blur-xl border border-border/30 shadow-2xl overflow-hidden">
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
                Interview Results
              </DialogTitle>
              <DialogDescription className="text-base">
                Comprehensive performance analysis and feedback
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
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.summary}
              </p>
            </div>
          </div>

          {/* Strengths and Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-2xl border border-green-500/20 backdrop-blur-sm shadow-lg space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-foreground">Strengths</h4>
              </div>
              <ul className="space-y-3">
                {(result.strengths || []).map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 group">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-sm text-foreground leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-2xl border border-orange-500/20 backdrop-blur-sm shadow-lg space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-foreground">Areas for Improvement</h4>
              </div>
              <ul className="space-y-3">
                {(result.weaknesses || []).map((w: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 group">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-sm text-foreground leading-relaxed">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 flex justify-end">
            <Button 
              onClick={() => onOpenChange(false)}
              className="h-11 px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-md hover:shadow-lg transition-all font-semibold"
            >
              Close Results
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewResultDialog;
