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
import { CelebrationAnimation } from "@/components/CelebrationAnimation";
import { interviewApi } from "@/services/interviewApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

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
  interview_availability?: boolean;
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
  const [celebrateProposalId, setCelebrateProposalId] = useState<number | null>(null);
  const [previousStatuses, setPreviousStatuses] = useState<Map<number, string>>(new Map());
  const [interviewReports, setInterviewReports] = useState<Map<number, any>>(new Map());
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

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
      
      // Check for newly accepted proposals
      userProposals.forEach((proposal: Proposal) => {
        const prevStatus = previousStatuses.get(proposal.id);
        if (proposal.status === 'accepted' && prevStatus && prevStatus !== 'accepted') {
          setCelebrateProposalId(proposal.id);
          setTimeout(() => setCelebrateProposalId(null), 3000);
        }
      });
      
      // Update previous statuses
      const newStatuses = new Map<number, string>();
      userProposals.forEach((proposal: Proposal) => {
        newStatuses.set(proposal.id, proposal.status);
      });
      setPreviousStatuses(newStatuses);
      
      setProposals(userProposals);
      
      // Extract unique job IDs from proposals
      const uniqueJobIds = [...new Set(userProposals.map((proposal: Proposal) => proposal.job))] as number[];
      
      // Fetch all jobs that have proposals
      if (uniqueJobIds.length > 0) {
        await fetchJobsForProposals(uniqueJobIds, userProposals);
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

  const fetchJobsForProposals = async (jobIds: number[], proposals: Proposal[]) => {
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

      // Fetch interview reports for proposals where job has interview availability
      const freelancerId = JSON.parse(localStorage.getItem("user") || "{}").id;
      const reportPromises = proposals
        .filter(proposal => jobsMap.get(proposal.job)?.interview_availability)
        .map(async (proposal) => {
          try {
            const report = await interviewApi.getInterviewReport(freelancerId, proposal.job);
            return { proposalId: proposal.id, report };
          } catch (error) {
            console.error('Failed to fetch interview report for proposal:', proposal.id, error);
            return { proposalId: proposal.id, report: null };
          }
        });

      const reportResults = await Promise.all(reportPromises);
      const reportsMap = new Map<number, any>();
      reportResults.forEach(({ proposalId, report }) => {
        reportsMap.set(proposalId, report);
      });
      setInterviewReports(reportsMap);
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

  const viewInterviewReport = (proposal: Proposal) => {
    const report = interviewReports.get(proposal.id);
    if (report) {
      setSelectedReport(report);
      setReportDialogOpen(true);
    }
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
        {/* Enhanced Header with Background Effect */}
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-3xl -z-10" />
          <div className="space-y-3 relative text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-primary/70">
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">Freelancer Dashboard</span>
            </div>
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
              My Proposals
            </h1>
            <p className="text-muted-foreground text-lg">
              Monitor your job applications, track proposal status, and manage interview schedules
            </p>
          </div>
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
            {[...proposals]
              .sort((a, b) => {
                const jobA = jobs.get(a.job);
                const jobB = jobs.get(b.job);
                const hasInterviewA = jobA?.interview_availability ? 1 : 0;
                const hasInterviewB = jobB?.interview_availability ? 1 : 0;
                
                // Priority: interview first, then status
                if (hasInterviewA !== hasInterviewB) {
                  return hasInterviewB - hasInterviewA; // Interviews first
                }
                
                // Status priority: under_review (pending) > accepted > rejected
                const statusPriority: Record<string, number> = {
                  pending: 3,
                  accepted: 2,
                  rejected: 1
                };
                
                return (statusPriority[b.status] || 0) - (statusPriority[a.status] || 0);
              })
              .map((proposal, idx) => {
              const job = jobs.get(proposal.job);
              const hasInterview = job?.interview_availability && proposal.status =='under_review';
              const statusColor = proposal.status === 'pending' ? 'bg-primary/10 text-primary border-primary/30' : 
                                 proposal.status === 'accepted' ? 'bg-green-500/10 text-green-600 border-green-500/30' : 
                                 proposal.status === 'rejected' ? 'bg-red-500/10 text-red-600 border-red-500/30' :
                                 'bg-muted text-muted-foreground border-border';
              const isAccepted = proposal.status === 'accepted';
              const showCelebration = celebrateProposalId === proposal.id;
              
              return (
                <Card
                  key={proposal.id}
                  className={`group relative overflow-hidden border shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-up ${
                    hasInterview
                      ? 'border-purple-500/50 bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-purple-500/10 ring-2 ring-purple-500/20'
                      : isAccepted 
                      ? 'border-green-500/40 bg-gradient-to-br from-green-500/5 via-green-400/5 to-green-500/5' 
                      : 'border-border/30 bg-gradient-to-br from-card/95 via-card/90 to-card/95 backdrop-blur-xl hover:border-primary/40'
                  }`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {showCelebration && <CelebrationAnimation show={showCelebration} />}
                  
                  {/* Interview Badge */}
                  {hasInterview && (
                    <div className="absolute top-4 right-4 z-20">
                      <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold px-4 py-1.5 shadow-lg animate-pulse">
                        <Play className="w-4 h-4 mr-1.5" />
                        Interview Available
                      </Badge>
                    </div>
                  )}
                  
                  {/* Animated Background Effects */}
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    hasInterview ? 'from-purple-500/10 via-purple-400/5 to-purple-500/10' : 'from-primary/5 via-accent/5 to-primary/5'
                  }`} />
                  <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 ${
                    hasInterview ? 'from-purple-500/20' : 'from-primary/10'
                  }`} />
                  
                  <CardContent className="p-7 relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-1 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:via-accent group-hover:to-primary transition-all duration-300">
                          {job?.title || 'Job Title Unavailable'}
                        </h3>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge className={`${statusColor} capitalize shadow-lg backdrop-blur-sm px-4 py-1 text-sm font-semibold`}>
                          {proposal.status== 'pending' ? 'Under Review' : proposal.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs backdrop-blur-sm">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(proposal.created_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6 p-5 rounded-xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border border-primary/20 backdrop-blur-sm">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                            <DollarSign className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Proposed Budget</p>
                            <p className="font-bold text-lg text-primary">${proposal.proposed_budget}/hr</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-md">
                            <Clock className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Duration</p>
                            <p className="font-semibold text-lg">{proposal.duration_in_days} days</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm group/item">
                          <MapPin className="w-4 h-4 text-primary/60 group-hover/item:text-primary transition-colors" />
                          <span className="text-muted-foreground font-medium">{job?.location || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm group/item">
                          <Briefcase className="w-4 h-4 text-primary/60 group-hover/item:text-primary transition-colors" />
                          <span className="text-muted-foreground font-medium">{job?.job_type || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm group/item">
                          <Calendar className="w-4 h-4 text-primary/60 group-hover/item:text-primary transition-colors" />
                          <span className="text-muted-foreground font-medium">
                            Posted {job ? new Date(job.created_at).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border/30 pt-5 mb-5">
                      <h4 className="font-bold mb-3 flex items-center gap-2 text-foreground text-lg">
                        <FileText className="w-5 h-5 text-primary" />
                        Cover Letter
                      </h4>
                      <div className="p-5 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/30 backdrop-blur-sm shadow-sm">
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-1">
                          {proposal.cover_letter}
                        </p>
                      </div>
                    </div>


                    <div className="flex justify-end gap-3 pt-5 border-t border-border/30">
                      {/* Interview button - only show report if available */}
                      {job?.interview_availability && proposal.status !== 'accepted' && proposal.status !== 'rejected' && interviewReports.get(proposal.id) && (
                        <Button
                          variant="default"
                          onClick={() => viewInterviewReport(proposal)}
                          className="gap-2 h-11 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all font-semibold"
                        >
                          <FileText className="w-5 h-5" />
                          View Interview Report
                        </Button>
                      )}

                      {/* View buttons */}
                      <ProposalDetailsDialog proposalId={proposal.id} />

                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedProposal(proposal);
                          setSelectedJob(jobs.get(proposal.job) || null);
                        }}
                        className="gap-2 h-11 border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all font-semibold"
                      >
                        <Eye className="w-5 h-5" />
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
                            <p className="text-xs text-muted-foreground mb-1">Job Location</p>
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

        {/* Interview Report Dialog */}
        <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Interview Report</DialogTitle>
              <DialogDescription>
                Your interview performance and feedback for this job application.
              </DialogDescription>
            </DialogHeader>

            {selectedReport && (
              <div className="space-y-6 mt-4">
                {/* Interview Score */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                  <span className="text-lg font-semibold">Interview Score</span>
                  <span className="text-2xl font-bold text-primary">{selectedReport.interview_score}%</span>
                </div>

                {/* Report Content */}
                <div className="space-y-4">
                  {(() => {
                    const reportData = selectedReport.interview_report;
                    // Parse the report string if it's formatted as specified
                    let parsedReport: {
                      summary?: string;
                      strengths?: string[] | string;
                      weaknesses?: string[] | string;
                      recommendation?: string;
                      transcript_analysis?: string;
                    } = {};
                    if (typeof reportData === 'string') {
                      // Try to parse the formatted string
                      const lines = reportData.split('\n');
                      let currentSection = '';
                      parsedReport = {
                        summary: '',
                        strengths: [],
                        weaknesses: [],
                        recommendation: '',
                        transcript_analysis: ''
                      };
                      lines.forEach(line => {
                        if (line.toLowerCase().includes('summary')) {
                          currentSection = 'summary';
                        } else if (line.toLowerCase().includes('strengths')) {
                          currentSection = 'strengths';
                        } else if (line.toLowerCase().includes('weaknesses')) {
                          currentSection = 'weaknesses';
                        } else if (line.toLowerCase().includes('recommendation')) {
                          currentSection = 'recommendation';
                        } else if (line.toLowerCase().includes('transcript')) {
                          currentSection = 'transcript_analysis';
                        } else if (line.trim()) {
                          if (currentSection === 'strengths' || currentSection === 'weaknesses') {
                            if (!Array.isArray(parsedReport[currentSection])) parsedReport[currentSection] = [];
                            (parsedReport[currentSection] as string[]).push(line.trim());
                          } else if (currentSection) {
                            parsedReport[currentSection] = (parsedReport[currentSection] as string || '') + (parsedReport[currentSection] ? '\n' : '') + line.trim();
                          }
                        }
                      });
                    } else if (typeof reportData === 'object' && reportData !== null) {
                      parsedReport = reportData as typeof parsedReport;
                    }

                    return (
                      <>
                        {/* Summary */}
                        {parsedReport.summary && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2 text-primary">Summary</h3>
                            <div className="p-4 bg-muted/50 rounded-lg border">
                              <p className="text-sm leading-relaxed">{parsedReport.summary}</p>
                            </div>
                          </div>
                        )}

                        {/* Strengths */}
                        {parsedReport.strengths && (Array.isArray(parsedReport.strengths) ? parsedReport.strengths.length > 0 : parsedReport.strengths) && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2 text-green-600">Strengths</h3>
                            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                              {Array.isArray(parsedReport.strengths) ? (
                                <ul className="list-disc list-inside space-y-1">
                                  {parsedReport.strengths.map((strength, idx) => (
                                    <li key={idx} className="text-sm">{strength}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm">{parsedReport.strengths}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Weaknesses */}
                        {parsedReport.weaknesses && (Array.isArray(parsedReport.weaknesses) ? parsedReport.weaknesses.length > 0 : parsedReport.weaknesses) && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2 text-orange-600">Areas for Improvement</h3>
                            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                              {Array.isArray(parsedReport.weaknesses) ? (
                                <ul className="list-disc list-inside space-y-1">
                                  {parsedReport.weaknesses.map((weakness, idx) => (
                                    <li key={idx} className="text-sm">{weakness}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm">{parsedReport.weaknesses}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Recommendation */}
                        {parsedReport.recommendation && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2 text-blue-600">Recommendation</h3>
                            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <p className="text-sm leading-relaxed">{parsedReport.recommendation}</p>
                            </div>
                          </div>
                        )}

                        {/* Transcript Analysis */}
                        {parsedReport.transcript_analysis && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2 text-purple-600">Transcript Analysis</h3>
                            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{parsedReport.transcript_analysis}</p>
                            </div>
                          </div>
                        )}

                        {/* Fallback: Show raw report if parsing failed */}
                        {!parsedReport.summary && !parsedReport.strengths && !parsedReport.weaknesses && !parsedReport.recommendation && !parsedReport.transcript_analysis && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Interview Report</h3>
                            <div className="p-4 bg-muted/50 rounded-lg border">
                              <pre className="text-sm whitespace-pre-wrap">{reportData}</pre>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Status */}
                <Separator />
                <div className="flex items-center justify-center">
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/30 px-4 py-2">
                    Interview Status: Finished
                  </Badge>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default MyProposals;