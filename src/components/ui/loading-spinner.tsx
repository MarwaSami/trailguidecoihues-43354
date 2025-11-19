import { Loader2, Sparkles } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

export const LoadingSpinner = ({ size = "md", message }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4 animate-fade-in">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary animate-spin" 
             style={{ 
               padding: '3px',
               animation: 'spin 2s linear infinite'
             }}>
          <div className="w-full h-full rounded-full bg-background"></div>
        </div>
        
        {/* Center icon with pulse */}
        <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
          <Sparkles className="w-1/2 h-1/2 text-primary animate-pulse" />
        </div>
      </div>
      
      {message && (
        <p className="text-muted-foreground text-sm animate-pulse">{message}</p>
      )}
    </div>
  );
};
