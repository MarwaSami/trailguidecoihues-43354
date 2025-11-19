import { useState, useEffect } from "react";
import axios from "axios";
import { baseURL } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, MapPin, DollarSign, Clock, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FreelancerProfile {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
  bio: string;
  skills: Array<{ id: number; name: string }>;
  experience_years: number;
  hourly_rate: string;
  portfolio_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
}

interface ApplicantsDialogProps {
  jobId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ApplicantsDialog = ({ jobId, open, onOpenChange }: ApplicantsDialogProps) => {
  const [applicants, setApplicants] = useState<FreelancerProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && jobId) {
      fetchApplicants();
    }
  }, [open, jobId]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please login to view applicants",
          variant: "destructive"
        });
        return;
      }

      const response = await axios.get(
        `${baseURL}jobs/freelancer_profiles/${jobId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        setApplicants(response.data);
      } else if (response.data?.results) {
        setApplicants(response.data.results);
      } else {
        setApplicants([]);
      }
    } catch (error: any) {
      console.error("Error fetching applicants:", error);
      toast({
        title: "Failed to fetch applicants",
        description: error.response?.data?.detail || "An error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle>Job Applicants</DialogTitle>
          <DialogDescription>
            View all freelancers who have applied for this position
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading applicants...</p>
          </div>
        )}

        {!loading && applicants.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No applicants yet for this job</p>
          </div>
        )}

        {!loading && applicants.length > 0 && (
          <div className="space-y-4">
            {applicants.map((applicant) => (
              <Card key={applicant.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">
                        {applicant.user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div>
                        <h3 className="text-lg font-semibold">{applicant.user.username}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {applicant.user.email}
                        </p>
                      </div>

                      {/* Bio */}
                      <p className="text-sm">{applicant.bio || "No bio provided"}</p>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {applicant.experience_years} years experience
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${applicant.hourly_rate}/hr
                        </span>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2">
                        {applicant.skills.map((skill) => (
                          <Badge key={skill.id} variant="secondary">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="flex gap-2 pt-2">
                        {applicant.portfolio_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={applicant.portfolio_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Portfolio
                            </a>
                          </Button>
                        )}
                        {applicant.linkedin_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={applicant.linkedin_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              LinkedIn
                            </a>
                          </Button>
                        )}
                        {applicant.github_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={applicant.github_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              GitHub
                            </a>
                          </Button>
                        )}
                        <Button size="sm" className="ml-auto">
                          Contact Freelancer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
