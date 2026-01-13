import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Clock, 
  User, 
  Smartphone, 
  Eye, 
  Shield, 
  CheckCircle2,
  XCircle,
  Timer
} from "lucide-react";

interface PreInterviewInstructionsProps {
  open: boolean;
  onAccept: () => void;
  onCancel: () => void;
}

const PreInterviewInstructions: React.FC<PreInterviewInstructionsProps> = ({
  open,
  onAccept,
  onCancel,
}) => {
  const rules = [
    {
      icon: AlertTriangle,
      title: "Limited Attempts",
      description: "You have only 2 attempts. Any violation will count against your attempts.",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      icon: Timer,
      title: "30-Second Response Window",
      description: "You must respond within 30 seconds after each question. The timer starts immediately after the AI finishes speaking.",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: User,
      title: "Solo Interview",
      description: "No other person should be visible in the camera frame. Ensure you are alone in a quiet environment.",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Smartphone,
      title: "Object Detection Active",
      description: "Mobile phones, books, laptops, and other unauthorized objects will be detected automatically.",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      icon: Eye,
      title: "Face Tracking",
      description: "Your face must remain visible in the camera at all times. Looking away may be flagged as a violation.",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border border-border/50">
        <DialogHeader className="text-center pb-4 border-b border-border/50">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
              <Shield className="w-12 h-12 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold">
            Interview Guidelines & Rules
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Please read and understand the following rules before proceeding with your interview.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-4">
          {/* Warning Banner */}
          <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-600 dark:text-amber-400">Important Notice</h4>
              <p className="text-sm text-muted-foreground mt-1">
                This interview is AI-proctored with real-time monitoring. Violations may result in 
                immediate termination of your interview session.
              </p>
            </div>
          </div>

          {/* Rules List */}
          <div className="space-y-3">
            {rules.map((rule, index) => (
              <div 
                key={index} 
                className={`flex items-start gap-4 p-4 rounded-xl border border-border/50 ${rule.bgColor} transition-all hover:scale-[1.01]`}
              >
                <div className={`p-2.5 rounded-lg bg-background/80 ${rule.color}`}>
                  <rule.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{rule.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Requirements Checklist */}
          <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-border/50">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Before You Begin
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Ensure good lighting on your face
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Position yourself in a quiet, distraction-free environment
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Keep your camera and microphone enabled throughout
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Remove any unauthorized devices from your workspace
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Ensure stable internet connection
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/50">
          <Button 
            variant="outline" 
            onClick={onCancel} 
            className="gap-2 flex-1 sm:flex-none"
          >
            <XCircle className="w-4 h-4" />
            Cancel
          </Button>
          <Button 
            variant="hero" 
            onClick={onAccept} 
            className="gap-2 flex-1 sm:flex-none min-w-[180px]"
          >
            <CheckCircle2 className="w-4 h-4" />
            I Understand, Start Interview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreInterviewInstructions;
