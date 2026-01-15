import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, TrendingUp, AlertCircle, CheckCircle2, Sparkles, Target, MessageSquare, Presentation, BookOpen, Globe, Code, Database, Layers, Cpu } from 'lucide-react';
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

interface TopicAssessment {
  topic: string;
  responses: string[];
}

const skillIcons: { [key: string]: React.ReactNode } = {
  communication: <MessageSquare className="w-4 h-4" />,
  presentation: <Presentation className="w-4 h-4" />,
  English_fluency: <Globe className="w-4 h-4" />,
  teaching: <BookOpen className="w-4 h-4" />,
  redux: <Layers className="w-4 h-4" />,
  react: <Code className="w-4 h-4" />,
  javascript: <Code className="w-4 h-4" />,
  typescript: <Code className="w-4 h-4" />,
  database: <Database className="w-4 h-4" />,
  api: <Cpu className="w-4 h-4" />,
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

// Helper function to clean text from brackets, quotes, and special formatting
const cleanText = (text: string): string => {
  return text
    .replace(/^\[|\]$/g, '') // Remove leading/trailing brackets
    .replace(/\[|\]/g, '') // Remove all square brackets
    .replace(/^'|'$/g, '') // Remove leading/trailing single quotes
    .replace(/'/g, '') // Remove all single quotes
    .replace(/\\'/g, "'") // Handle escaped quotes
    .replace(/",\s*"/g, '. ') // Replace "," with ". "
    .replace(/'\s*,\s*'/g, '. ') // Replace ', ' with '. '
    .replace(/^\s*,\s*|\s*,\s*$/g, '') // Remove leading/trailing commas
    .trim();
};

// Helper function to split text into separate lines/items
const splitToLines = (text: string): string[] => {
  // First clean the text
  const cleaned = cleanText(text);
  
  // Split by various delimiters
  const lines = cleaned
    .split(/[.]\s+(?=[A-Z])/) // Split by period followed by capital letter
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.endsWith('.') ? line : line + '.');
  
  return lines.length > 0 ? lines : [cleaned];
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
        strengths: [] as string[],
        weaknesses: [] as string[],
        skills: {} as SkillAssessment,
        topics: [] as TopicAssessment[],
        overallImpression: ''
      };
    }

    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(reportText);
      console.log("Parsed report:", parsed);
      return {
        summary: cleanText(parsed.summary || ''),
        strengths: (parsed.strengths || []).map((s: string) => cleanText(s)),
        weaknesses: (parsed.weaknesses || parsed.areas_for_improvement || []).map((w: string) => cleanText(w)),
        skills: parsed.skills || {} as SkillAssessment,
        topics: [] as TopicAssessment[],
        overallImpression: ''
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
        let topics: TopicAssessment[] = [];
        let summary = '';
        let overallImpression = '';

        // Parse first array as strengths
        if (matches[0]) {
          const strengthsStr = matches[0][1];
          strengths = strengthsStr
            .split("','")
            .map(s => cleanText(s))
            .filter(s => s.length > 0);
        }

        // Parse second array as weaknesses
        if (matches[1]) {
          const weaknessesStr = matches[1][1];
          weaknesses = weaknessesStr
            .split("','")
            .map(s => cleanText(s))
            .filter(s => s.length > 0);
        }

        // Find the skills/topics dictionary - look for complex nested structure
        const topicsPattern = /\{'topics':\s*\[(.*?)\]\s*,\s*'overall_impression':\s*'([^']+)'\}/gs;
        const topicsMatch = topicsPattern.exec(reportText);
        
        if (topicsMatch) {
          // Parse topics array
          const topicsStr = topicsMatch[1];
          overallImpression = cleanText(topicsMatch[2]);
          
          // Match individual topic objects
          const topicObjPattern = /\{'topic':\s*'([^']+)',\s*'responses':\s*\[([^\]]+)\]\}/g;
          let topicMatch;
          while ((topicMatch = topicObjPattern.exec(topicsStr)) !== null) {
            const topicName = topicMatch[1];
            const responsesStr = topicMatch[2];
            const responses = responsesStr
              .split("','")
              .map(r => cleanText(r))
              .filter(r => r.length > 0);
            
            topics.push({
              topic: formatSkillName(topicName),
              responses
            });
          }
        } else {
          // Fallback to simple key-value parsing
          const dictPattern = /\{[^{}]*'[^']+'\s*:\s*'[^']+(?:'[^']*)*'[^{}]*\}/g;
          const dictMatch = reportText.match(dictPattern);
          
          if (dictMatch && dictMatch.length > 0) {
            const dictStr = dictMatch[dictMatch.length - 1];
            const keyValuePattern = /'([^']+)'\s*:\s*'([^']+(?:'[^']*?)*)'/g;
            let kvMatch;
            while ((kvMatch = keyValuePattern.exec(dictStr)) !== null) {
              skills[kvMatch[1]] = cleanText(kvMatch[2]);
            }
          }
        }

        // Extract summary - text between the last array and the dictionary
        const lastArrayEnd = matches[1] ? reportText.indexOf(matches[1][0]) + matches[1][0].length : 0;
        const dictStart = reportText.indexOf("{'topics':") !== -1 
          ? reportText.indexOf("{'topics':") 
          : reportText.length;
        
        if (lastArrayEnd < dictStart) {
          summary = reportText.substring(lastArrayEnd, dictStart).trim();
          summary = cleanText(summary);
        }

        return {
          summary: summary || 'Performance analysis completed.',
          strengths,
          weaknesses,
          skills,
          topics,
          overallImpression
        };
      } catch {
        return {
          summary: cleanText(reportText),
          strengths: [] as string[],
          weaknesses: [] as string[],
          skills: {} as SkillAssessment,
          topics: [] as TopicAssessment[],
          overallImpression: ''
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
  const hasTopics = result.topics && result.topics.length > 0;

  // Format summary as bullet points
  const summaryLines = splitToLines(result.summary);

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
            <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl border border-border/20">
              <div className="relative w-36 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={62}
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
                  <p className={`text-4xl font-bold ${getScoreTextColor(score)}`}>{score}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">out of 100</p>
                </div>
              </div>
              
              <Badge className={`mt-4 px-5 py-1.5 text-sm font-semibold ${getScoreBadge(score).color}`}>
                {getScoreBadge(score).text}
              </Badge>
            </div>

            {/* Summary Card */}
            <div className="p-5 bg-muted/20 rounded-2xl border border-border/20 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Performance Summary</h3>
              </div>
              <div className="space-y-2 flex-1">
                {summaryLines.map((line, index) => (
                  <p key={index} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>{line}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths and Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="p-5 bg-gradient-to-br from-green-50/80 to-green-100/40 dark:from-green-950/30 dark:to-green-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-base font-bold text-foreground">Strengths</h4>
              </div>
              {result.strengths.length > 0 ? (
                <div className="space-y-2">
                  {result.strengths.map((s: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 bg-white/70 dark:bg-white/5 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-foreground leading-relaxed">{s}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No specific strengths identified.</p>
              )}
            </div>

            {/* Areas for Improvement */}
            <div className="p-5 bg-gradient-to-br from-orange-50/80 to-orange-100/40 dark:from-orange-950/30 dark:to-orange-900/20 rounded-2xl border border-orange-200/50 dark:border-orange-800/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center shadow-sm">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-base font-bold text-foreground">Areas for Improvement</h4>
              </div>
              {result.weaknesses.length > 0 ? (
                <div className="space-y-2">
                  {result.weaknesses.map((w: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 bg-white/70 dark:bg-white/5 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-foreground leading-relaxed">{w}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No specific areas for improvement identified.</p>
              )}
            </div>
          </div>

          {/* Skills Assessment Section - Topic-based Layout */}
          {(hasSkills || hasTopics) && (
            <div className="p-5 bg-gradient-to-br from-blue-50/80 to-indigo-100/40 dark:from-blue-950/30 dark:to-indigo-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/30">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-base font-bold text-foreground">Skills Assessment</h4>
              </div>
              
              {/* Topics-based layout */}
              {hasTopics && (
                <div className="space-y-4">
                  {result.topics.map((topicItem, index) => {
                    const iconKey = topicItem.topic.toLowerCase().replace(/\s/g, '');
                    return (
                      <div 
                        key={index} 
                        className="p-4 bg-white/80 dark:bg-white/5 rounded-xl border border-blue-100/50 dark:border-blue-800/20"
                      >
                        <div className="flex items-center gap-3 mb-3 pb-2 border-b border-blue-100/50 dark:border-blue-800/20">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-sm">
                            {skillIcons[iconKey] || <Target className="w-4 h-4" />}
                          </div>
                          <h5 className="font-semibold text-foreground text-base">
                            {topicItem.topic}
                          </h5>
                        </div>
                        <ul className="space-y-2 pl-2">
                          {topicItem.responses.map((response, rIndex) => (
                            <li key={rIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="text-primary font-bold mt-0.5 shrink-0">•</span>
                              <span className="leading-relaxed">{response}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                  
                  {/* Overall Impression */}
                  {result.overallImpression && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-indigo-200/50 dark:border-indigo-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        <h5 className="font-semibold text-foreground text-sm">Overall Impression</h5>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {result.overallImpression}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Fallback to key-value skills */}
              {hasSkills && !hasTopics && (
                <div className="grid gap-3">
                  {Object.entries(result.skills).map(([key, value], index) => {
                    const iconKey = key.toLowerCase().replace(/\s|_/g, '');
                    // Split value into lines for bullet display
                    const valueLines = splitToLines(String(value));
                    
                    return (
                      <div 
                        key={index} 
                        className="p-4 bg-white/80 dark:bg-white/5 rounded-xl border border-blue-100/50 dark:border-blue-800/20"
                      >
                        <div className="flex items-center gap-3 mb-3 pb-2 border-b border-blue-100/50 dark:border-blue-800/20">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-sm">
                            {skillIcons[iconKey] || <Target className="w-4 h-4" />}
                          </div>
                          <h5 className="font-semibold text-foreground text-base">
                            {formatSkillName(key)}
                          </h5>
                        </div>
                        <ul className="space-y-2 pl-2">
                          {valueLines.map((line, lIndex) => (
                            <li key={lIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="text-primary font-bold mt-0.5 shrink-0">•</span>
                              <span className="leading-relaxed">{line}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4 flex justify-end border-t border-border/30">
            <Button 
              onClick={() => onOpenChange(false)}
              className="h-10 px-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-md hover:shadow-lg transition-all font-semibold"
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
