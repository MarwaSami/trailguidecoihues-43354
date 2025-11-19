import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useInterview } from '@/context/InterviewContext';

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle>Interview Result</DialogTitle>
          <DialogDescription>Summary and detailed result</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold">Score</h3>
            <p className="text-2xl font-bold">{result.score ?? 'N/A'}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Summary</h3>
            <p className="text-sm text-muted-foreground">{result.summary}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold">Strengths</h4>
              <ul className="list-disc ml-5 mt-2 text-sm">
                {(result.strengths || []).map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Weaknesses</h4>
              <ul className="list-disc ml-5 mt-2 text-sm">
                {(result.weaknesses || []).map((w: string, i: number) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewResultDialog;
