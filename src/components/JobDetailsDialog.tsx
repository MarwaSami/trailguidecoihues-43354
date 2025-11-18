import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MapPin, Briefcase, DollarSign, Users, FileText } from "lucide-react";

interface Job {
  id: number;
  title: string;
  description: string;
  budget?: string;
  location?: string;
  job_type?: string;
  experience_level?: string;
  required_skills?: Array<{ id: number; name: string } | string>;
  client_name?: string;
  created_at: string;
}

interface JobDetailsDialogProps {
  job: Job;
  userType: 'client' | 'freelancer';
  trigger?: React.ReactNode;
}

export const JobDetailsDialog = ({ job, userType, trigger }: JobDetailsDialogProps) => {
  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Eye className="w-4 h-4" />
      View Details
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-card/98 backdrop-blur-[var(--blur-glass)] border-border/50 shadow-[var(--shadow-glass)]">
        <DialogHeader className="border-b border-border/50 pb-4">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground/80 bg-clip-text">
            {job.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {userType === 'client' ? (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Description</h3>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Experience Level</p>
                      <p className="font-semibold">{job.experience_level}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Job Type</p>
                      <p className="font-semibold">{job.job_type}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-semibold">{job.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Description</h3>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Budget</p>
                      <p className="text-xl font-bold text-primary">{job.budget}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-lg bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Experience Level</p>
                      <p className="font-semibold">{job.experience_level}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Required Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2 p-4 rounded-lg bg-muted/30 border border-border/50">
                  {job.required_skills?.map((skill, idx) => (
                    <Badge 
                      key={idx} 
                      className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 transition-colors shadow-sm"
                    >
                      {typeof skill === 'string' ? skill : skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};