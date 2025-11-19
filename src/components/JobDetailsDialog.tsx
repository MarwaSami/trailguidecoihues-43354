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
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-card border border-border shadow-2xl">
        <DialogHeader className="border-b border-border pb-6 mb-6">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            {job.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">Posted on {new Date(job.created_at).toLocaleDateString()}</p>
        </DialogHeader>

        <div className="space-y-6">
          {userType === 'client' ? (
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Job Description</h3>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border">
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/30 shadow-sm">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Experience Level</p>
                      <p className="font-bold text-foreground text-lg">{job.experience_level}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center border border-accent/30 shadow-sm">
                      <Briefcase className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Job Type</p>
                      <p className="font-bold text-foreground text-lg">{job.job_type}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/30 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center border border-secondary/30 shadow-sm">
                      <MapPin className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Location</p>
                      <p className="font-bold text-foreground text-lg">{job.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Job Description</h3>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border">
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/40 shadow-md">
                      <DollarSign className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Budget</p>
                      <p className="text-2xl font-bold text-primary">{job.budget}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 shadow-lg hover:shadow-xl transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center border border-accent/40 shadow-md">
                      <Users className="w-7 h-7 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Experience Level</p>
                      <p className="text-xl font-bold text-foreground">{job.experience_level}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Required Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2 p-5 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border">
                  {job.required_skills?.map((skill, idx) => (
                    <Badge 
                      key={idx} 
                      className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/30 hover:from-primary/30 hover:to-primary/20 transition-all shadow-sm px-3 py-1 text-sm font-medium"
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