import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MapPin, Briefcase, DollarSign, Users } from "lucide-react";

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{job.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {userType === 'client' ? (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{job.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">Experience Level:</span> {job.experience_level}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">Job Type:</span> {job.job_type}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">Location:</span> {job.location}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{job.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">Budget:</span> {job.budget}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="font-medium">Experience Level:</span> {job.experience_level}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.required_skills?.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">
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