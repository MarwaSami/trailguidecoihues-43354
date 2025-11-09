import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Clock } from 'lucide-react';

interface Violation {
  id: string;
  message: string;
  timestamp: Date;
}

interface ViolationLoggerProps {
  violations: Violation[];
}

const ViolationLogger: React.FC<ViolationLoggerProps> = ({ violations }) => {
  return (
    <Card className="p-6 bg-card border-2 border-destructive/20 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-4 h-4 text-destructive" />
        </div>
        Proctoring Violations Log
      </h3>
      
      {violations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No violations detected</p>
        </div>
      ) : (
        <ScrollArea className="h-64 pr-2 custom-scrollbar">
          <div className="space-y-2">
            {violations.slice().reverse().map((violation) => (
              <div
                key={violation.id}
                className="p-3 bg-destructive/10 border-l-4 border-destructive rounded-r-lg hover:bg-destructive/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-destructive font-medium flex-1">
                    {violation.message}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {violation.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
      
      {violations.length > 0 && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            Total Violations: <span className="font-semibold text-destructive">{violations.length}</span>
          </p>
        </div>
      )}
    </Card>
  );
};

export default ViolationLogger;
