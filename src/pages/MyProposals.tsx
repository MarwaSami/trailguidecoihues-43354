import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  FileText,
  Calendar,
  ArrowLeft,
  Eye,
} from "lucide-react";
import axios from "axios";
import { baseURL } from "@/context/AuthContext";

interface Proposal {
  id: number;
  cover_letter: string;
  proposed_budget: string;
  availability: string;
  created_at: string;
  ai_suggestion_score?: number;
  ai_feedback?: string;
  job: number;
  freelancer: number;
}

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  job_type: string;
  budget: string;
  match_score: number;
  created_at: string;
  description: string;
  skills: string[];
  applicants: number;
}

const MyProposals = () => {
  const { toast } = useToast();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [jobs, setJobs] = useState<Map<number, Job>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const freelancerId = JSON.parse(localStorage.getItem("user") || "{}").id;
      const response = await axios.get(`${baseURL}/jobs/proposals/?freelancer=${freelancerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProposals(response.data);

      // Fetch job details for each proposal
      const jobIds = [...new Set(response.data.map((p: Proposal) => p.job))];
      const jobPromises = jobIds.map(id => axios.get(`${baseURL}/jobs/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }));
      const jobResponses = await Promise.all(jobPromises);
      const jobMap = new Map<number, Job>();
      jobResponses.forEach(res => {
        jobMap.set(res.data.id, res.data);
      });
      setJobs(jobMap);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center">Loading proposals...</div>
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
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No Proposals Yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't submitted any proposals yet. Start browsing jobs to apply!
            </p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {proposals.map((proposal) => {
              const job = jobs.get(proposal.job);
              return (
                <Card key={proposal.id} className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{job?.title || `Job ${proposal.job}`}</h3>
                      <p className="text-muted-foreground">{job?.company}</p>
                    </div>
                    <Badge variant="secondary">
                      Submitted {new Date(proposal.created_at).toLocaleDateString()}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">Proposed Budget:</span>
                        <span>${proposal.proposed_budget}/hr</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">Availability:</span>
                        <span>{proposal.availability}</span>
                      </div>
                      {proposal.ai_suggestion_score && (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">AI Score:</span>
                          <Badge variant={proposal.ai_suggestion_score > 70 ? "default" : "secondary"}>
                            {proposal.ai_suggestion_score}/100
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{job?.location}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <span>{job?.job_type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>Posted {job ? new Date(job.created_at).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Cover Letter
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {proposal.cover_letter}
                    </p>
                  </div>

                  {proposal.ai_feedback && (
                    <div className="border-t border-border pt-4 mt-4">
                      <h4 className="font-semibold mb-2">AI Feedback</h4>
                      <p className="text-sm text-muted-foreground">{proposal.ai_feedback}</p>
                    </div>
                  )}

                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedProposal(proposal)}
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Job Details
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Job Details Modal/Dialog */}
        {selectedProposal && jobs.get(selectedProposal.job) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">{jobs.get(selectedProposal.job)?.title}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProposal(null)}
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Company</h3>
                    <p>{jobs.get(selectedProposal.job)?.company}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {jobs.get(selectedProposal.job)?.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Skills Required</h3>
                    <div className="flex flex-wrap gap-2">
                      {jobs.get(selectedProposal.job)?.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Location</h3>
                      <p>{jobs.get(selectedProposal.job)?.location}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Job Type</h3>
                      <p>{jobs.get(selectedProposal.job)?.job_type}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyProposals;