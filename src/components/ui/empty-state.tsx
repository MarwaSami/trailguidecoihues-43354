import { LucideIcon } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) => {
  return (
    <Card className="p-12 text-center bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)] animate-fade-in">
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
        {/* Animated icon container */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative p-6 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <Icon className="w-12 h-12 text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {/* Action button */}
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            variant="hero"
            className="mt-4 gap-2"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};
