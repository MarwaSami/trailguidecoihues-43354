import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, TrendingUp, AlertCircle, CheckCircle2, Sparkles, Target, MessageSquare, Presentation, BookOpen, Globe } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface InterviewReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: string | null;
  score?: number;
  candidateName?: string;
}

interface SkillAssessment {
  [key: string]: string;
}

const skillIcons: { [key: string]: React.ReactNode } = {
  communication: <MessageSquare className="w-4 h-4" />,
  presentation: <Presentation className="w-4 h-4" />,
  English_fluency: <Globe className="w-4 h-4" />,
  teaching: <BookOpen className="w-4 h-4" />,
};

const formatSkillName = (key: string): string => {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
};

export const InterviewReportDialog: React.FC<InterviewReportDialogProps> = ({ 
  open, 
  onOpenChange, 
  report, 
  score = 70,
  candidateName = "Candidate"
}) => {
  // Parse the report to extract summary, strengths, weaknesses, and skills
  const parseReport = (reportText: string | null) => {
    console.log("Raw report text:", reportText);
    if (!reportText) {
      return {
        summary: 'No interview report available.',
        strengths: [],
        weaknesses: [],
        skills: {} as SkillAssessment
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
        weaknesses: parsed.weaknesses || parsed.areas_for_improvement || [],
        skills: parsed.skills || {} as SkillAssessment
      };
    } catch {
      // Parse the specific format: ['array1'] \n ['array2'] \n summary text \n {'key': 'value'}
      try {
        // Match arrays using regex - find content within square brackets
        const arrayPattern = /\[(.*?)\]/gs;
        const matches = [...reportText.matchAll(arrayPattern)];
        
        let strengths: string[] = [];
        let weaknesses: string[] = [];
        let skills: SkillAssessment = {};
        let summary = '';

        // Parse first array as strengths
        if (matches[0]) {
          const strengthsStr = matches[0][1];
          strengths = strengthsStr
            .split("','")
            .map(s => s.replace(/^'|'$/g, '').trim())
            .filter(s => s.length > 0);
        }

        // Parse second array as weaknesses
        if (matches[1]) {
          const weaknessesStr = matches[1][1];
          weaknesses = weaknessesStr
            .split("','")
            .map(s => s.replace(/^'|'$/g, '').trim())
            .filter(s => s.length > 0);
        }

        // Find the skills dictionary at the end
        const dictPattern = /\{[^{}]*'[^']+'\s*:\s*'[^']+(?:'[^']*)*'[^{}]*\}/g;
        const dictMatch = reportText.match(dictPattern);
        
        if (dictMatch && dictMatch.length > 0) {
          const dictStr = dictMatch[dictMatch.length - 1];
          // Parse the Python-style dictionary
          const keyValuePattern = /'([^']+)'\s*:\s*'([^']+(?:'[^']*?)*)'/g;
          let kvMatch;
          while ((kvMatch = keyValuePattern.exec(dictStr)) !== null) {
            skills[kvMatch[1]] = kvMatch[2].replace(/\\'/g, "'");
          }
        }

        // Extract summary - text between the last array and the dictionary
        const lastArrayEnd = matches[1] ? reportText.indexOf(matches[1][0]) + matches[1][0].length : 0;
        const dictStart = dictMatch ? reportText.lastIndexOf(dictMatch[dictMatch.length - 1]) : reportText.length;
        
        if (lastArrayEnd < dictStart) {
          summary = reportText.substring(lastArrayEnd, dictStart).trim();
          // Clean up the summary
          summary = summary.replace(/^\s*\n+/, '').replace(/\n+\s*$/, '');
        }

        return {
          summary: summary || 'Performance analysis completed.',
          strengths,
          weaknesses,
          skills
        };
      } catch {
        return {
          summary: reportText,
          strengths: [],
          weaknesses: [],
          skills: {} as SkillAssessment
        };
      }
    }
  };

  const result = parseReport(report);
  console.log("Parsed Result:", result);  
  const chartData = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score }
  ];
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return 'hsl(var(--primary))';
    return '#f97316';
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

  const hasSkills = Object.keys(result.skills).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-card border border-border/40 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
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
                Comprehensive performance analysis for {candidateName}
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

          {/* Strengths and Weaknesses */}
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
                    <div key={i} className="flex items-start gap-3 p-3 bg-white/60 dark:bg-white/5 rounded-xl">
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
                    <div key={i} className="flex items-start gap-3 p-3 bg-white/60 dark:bg-white/5 rounded-xl">
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

          {/* Skills Assessment Section */}
          {hasSkills && (
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100/50 dark:from-blue-950/30 dark:to-indigo-900/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-foreground">Skills Assessment</h4>
              </div>
              <div className="grid gap-4">
                {Object.entries(result.skills).map(([key, value], index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-white/70 dark:bg-white/5 rounded-xl border border-blue-100 dark:border-blue-800/30 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                        {skillIcons[key] || <Target className="w-4 h-4" />}
                      </div>
                      <h5 className="font-semibold text-foreground text-base">
                        {formatSkillName(key)}
                      </h5>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-11">
                      {String(value)}
                    </p>
                  </div>
                ))}
              </div>
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
