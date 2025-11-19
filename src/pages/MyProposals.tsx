import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ProposalDetailsDialog } from "@/components/ProposalDetailsDialog";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  FileText,
  Calendar,
  ArrowLeft,
  Eye,
  Users,
  Play,
} from "lucide-react";
import axios from "axios";
import { baseURL } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";

interface Proposal {
  id: number;
  cover_letter: string;
  proposed_budget: string;
  duration_in_days: number;
  experience: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  job: number;
  freelancer: number;
}

interface Job {
  id: number;
  title: string;
  description: string;
  budget: string;
  location: string;
  job_type: string;
  experience_level: string;
  status: string;
  created_at: string;
  updated_at: string;
  ai_generated_criteria: string | null;
  client: number;
  required_skills: Array<{ id: number; name: string }>;
}

const MyProposals = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [jobs, setJobs] = useState<Map<number, Job>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const freelancerId = JSON.parse(localStorage.getItem("user") || "{}").id;
      const response = await axios.get(`${baseURL}jobs/proposals/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Filter proposals to ensure they belong to the current user
      const userProposals = response.data.filter((proposal: Proposal) => proposal.freelancer === freelancerId);
      setProposals(userProposals);
      
      // Extract unique job IDs from proposals
      const uniqueJobIds = [...new Set(userProposals.map((proposal: Proposal) => proposal.job))] as number[];
      
      // Fetch all jobs that have proposals
      if (uniqueJobIds.length > 0) {
        await fetchJobsForProposals(uniqueJobIds);
      }
    } catch (error: any) {
      let errorTitle = "Failed to load proposals";
      let errorMessage = "Please try again later.";

      if (error.response) {
        if (error.response.status === 400) {
          // Handle validation errors
          errorTitle = "Validation Error";
          const data = error.response.data;
          if (typeof data === 'object' && data !== null) {
            const fieldErrors: string[] = [];
            for (const [field, messages] of Object.entries(data)) {
              if (Array.isArray(messages)) {
                fieldErrors.push(`${field}: ${messages.join(', ')}`);
              } else if (typeof messages === 'string') {
                fieldErrors.push(`${field}: ${messages}`);
              }
            }
            errorMessage = fieldErrors.join('; ') || "Please check your request and try again.";
          } else {
            errorMessage = data?.message || data?.detail || "Invalid request data.";
          }
        } else {
          // Other backend errors
          errorMessage = error.response.data?.message || error.response.data?.detail || `Error ${error.response.status}: ${error.response.statusText}`;
        }
      } else if (error.request) {
        // Network error
        errorMessage = "Network error. Please check your connection.";
      } else {
        // Other error
        errorMessage = error.message || errorMessage;
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchJobsForProposals = async (jobIds: number[]) => {
    try {
      // Fetch jobs in parallel for better performance
      const jobPromises = jobIds.map(async (jobId) => {
        const response = await axios.get(`${baseURL}jobs/jobs/${jobId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return { id: jobId, data: response.data };
      });

      const jobResults = await Promise.all(jobPromises);
      
      // Create a map of job ID to job data
      const jobsMap = new Map<number, Job>();
      jobResults.forEach(({ id, data }) => {
        jobsMap.set(id, data);
      });
      
      setJobs(jobsMap);
    } catch (error: any) {
      console.error('Failed to fetch jobs for proposals:', error);
      toast({
        title: "Failed to load job details",
        description: "Some job details could not be loaded. Please refresh the page.",
        variant: "destructive",
      });
    }
  };



  const startInterview = (proposal: Proposal) => {
    localStorage.setItem('interview_freelancer_id', proposal.freelancer.toString());
    localStorage.setItem('interview_job_id', proposal.job.toString());
    navigate('/interview-practice');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <LoadingSpinner size="lg" message="Loading your proposals..." />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-3">My Proposals</h1>
          <p className="text-lg text-muted-foreground">
            View all your submitted proposals and track their status
          </p>
        </div>

        {proposals.length === 0 ? (
          <EmptyState 
            icon={FileText}
            title="No Proposals Yet"
            description="You haven't submitted any proposals yet. Start browsing jobs to apply!"
            actionLabel="Browse Jobs"
            onAction={() => window.location.href = '/job-browse'}
          />
        ) : (
          <div className="grid gap-6">
            {proposals.map((proposal, idx) => {
              const job = jobs.get(proposal.job);
              const statusColor = proposal.status === 'pending' ? 'bg-primary/10 text-primary border-primary/30' : 
                                 proposal.status === 'accepted' ? 'bg-green-500/10 text-green-600 border-green-500/30' : 
                                 'bg-muted text-muted-foreground border-border';
              
              return (
                <Card 
                  key={proposal.id} 
                  className="group relative overflow-hidden border-border/50 bg-card/95 backdrop-blur-[var(--blur-glass)] shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-[var(--gradient-card)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-1 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                          {job?.title || 'Job Title Unavailable'}
                        </h3>
                        {/* <p className="text-sm text-muted-foreground">{proposal.proposed_budget}</p> */}
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge className={`${statusColor} capitalize shadow-sm`}>
                          {proposal.status== 'pending' ? 'Under Review' : proposal.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(proposal.created_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6 p-4 rounded-lg bg-muted/30 border border-border/50">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Proposed Budget</p>
                            <p className="font-semibold text-lg">${proposal.proposed_budget}/hr</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-accent" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Duration</p>
                            <p className="font-semibold">{proposal.duration_in_days} days</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-primary/70" />
                          <span className="text-muted-foreground">{job?.location || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="w-4 h-4 text-primary/70" />
                          <span className="text-muted-foreground">{job?.job_type || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-primary/70" />
                          <span className="text-muted-foreground">
                            Posted {job ? new Date(job.created_at).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border/50 pt-4 mb-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                        <FileText className="w-4 h-4 text-primary" />
                        Cover Letter
                      </h4>
                      <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {proposal.cover_letter}
                        </p>
                      </div>
                    </div>

                    {proposal.experience && (
                      <div className="border-t border-border/50 pt-4 mb-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-primary" />
                          Experience
                        </h4>
                        <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                          <p className="text-sm text-muted-foreground leading-relaxed">{proposal.experience}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
                      <ProposalDetailsDialog proposalId={proposal.id} />
                      <Button
                        variant="outline"
                        onClick={() => startInterview(proposal)}
                        className="gap-2 hover:bg-primary/5 hover:border-primary/50 hover:text-primary transition-all shadow-sm"
                      >
                        <Play className="w-4 h-4" />
                        Start Interview
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedProposal(proposal);
                          setSelectedJob(jobs.get(proposal.job) || null);
                        }}
                        className="gap-2 hover:bg-primary/5 hover:border-primary/50 hover:text-primary transition-all shadow-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View Job Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Job Details Modal/Dialog */}
        {selectedProposal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <Card className="max-w-3xl w-full max-h-[85vh] overflow-y-auto bg-white border-border/50 shadow-[var(--shadow-glow)] animate-scale-in">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6 border-b border-border/50 pb-4">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground/80 bg-clip-text">
                    {selectedJob?.title || "Job Details"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedProposal(null);
                      setSelectedJob(null);
                    }}
                    className="hover:bg-destructive/10 hover:text-destructive rounded-full"
                  >
                    <span className="text-2xl">×</span>
                  </Button>
                </div>

                {selectedJob ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold">Description</h3>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                        <p className="text-muted-foreground leading-relaxed">
                          {selectedJob.description}
                        </p>
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
                        {selectedJob.required_skills.map((skill) => (
                          <Badge 
                            key={skill.id} 
                            className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 transition-colors shadow-sm"
                          >
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                        <div className="flex flex-col gap-2">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Budget</p>
                            <p className="text-lg font-bold text-primary">${selectedJob.budget}/hr</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
                        <div className="flex flex-col gap-2">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Location</p>
                            <p className="font-semibold">{selectedJob.location}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20">
                        <div className="flex flex-col gap-2">
                          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Job Type</p>
                            <p className="font-semibold">{selectedJob.job_type}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                        <div className="flex flex-col gap-2">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Experience</p>
                            <p className="font-semibold">{selectedJob.experience_level}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
                        <div className="flex flex-col gap-2">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                            <Badge className="w-5 h-5 rounded-full bg-accent/30" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Status</p>
                            <p className="font-semibold capitalize">{selectedJob.status}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20">
                        <div className="flex flex-col gap-2">
                          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Posted</p>
                            <p className="font-semibold text-sm">{new Date(selectedJob.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-destructive text-2xl">!</span>
                    </div>
                    <p className="text-destructive font-semibold">Job details not available</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyProposals;