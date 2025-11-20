import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface AcceptanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName: string;
  jobId?: string;
}

export const AcceptanceDialog = ({ open, onOpenChange, candidateName, jobId }: AcceptanceDialogProps) => {
  const [progress, setProgress] = useState(100);
  const [balloons, setBalloons] = useState<number[]>([]);

  useEffect(() => {
    if (open) {
      // Generate random balloons
      const newBalloons = Array.from({ length: 15 }, (_, i) => i);
      setBalloons(newBalloons);
      
      // Start progress timer
      setProgress(100);
      const duration = 5000; // 5 seconds
      const interval = 50;
      const decrement = (interval / duration) * 100;
      
      const timer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - decrement;
          if (newProgress <= 0) {
            clearInterval(timer);
            onOpenChange(false);
            return 0;
          }
          return newProgress;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-2 border-primary/30 shadow-2xl overflow-hidden">
        {/* Balloons Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {balloons.map((i) => (
            <div
              key={i}
              className="absolute bottom-0 animate-float-up"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div 
                className="w-8 h-10 rounded-full opacity-70"
                style={{
                  background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center py-8 px-4">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-primary/20 to-green-500/20 rounded-full blur-2xl animate-pulse" />
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-scale-in relative z-10" />
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-primary to-green-600 bg-clip-text text-transparent">
                Proposal Accepted!
              </h2>
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            </div>
            
            <p className="text-muted-foreground text-lg">
              You've successfully accepted <span className="font-semibold text-foreground">{candidateName}</span>'s proposal
            </p>
          </div>

          <Link to="/my_jobs" className="block">
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              View My Jobs
            </Button>
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
          <div 
            className="h-full bg-gradient-to-r from-green-500 via-primary to-green-500 transition-all duration-50 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
