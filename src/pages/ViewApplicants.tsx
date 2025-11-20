import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPin,
  Briefcase,
  Mail,
  Heart,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Award
} from "lucide-react";
import { useApplicants } from "@/context/ApplicantContext";
import { ProposalDetailsDialog } from "@/components/ProposalDetailsDialog";
import axios from "axios";
import { baseURL } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AcceptanceDialog } from "@/components/AcceptanceDialog";

const ViewApplicants = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { candidates, fetchCandidates, loading } = useApplicants();
  const { toast } = useToast();
  const [interviewAvailability, setInterviewAvailability] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [acceptedCandidateName, setAcceptedCandidateName] = useState("");

  useEffect(() => {
    if (jobId) {
      fetchCandidates(parseInt(jobId));
      const fetchInterviewAvailability = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${baseURL}jobs/jobs/${jobId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setInterviewAvailability(response.data.interview_availability);
        } catch (error) {
          console.error('Error fetching interview availability:', error);
        }
      };
      fetchInterviewAvailability();
    }
  }, [jobId, fetchCandidates]);

  const handleProposalUpdate = async (proposalId: number, status: 'accept' | 'reject', candidateName?: string) => {
    try {
      await axios.post(`${baseURL}jobs/proposal-update/`, {
        status,
        proposal_id: proposalId
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (status === 'accept' && candidateName) {
        setAcceptedCandidateName(candidateName);
        setAcceptDialogOpen(true);
      } else {
        toast({
          title: "Done",
          description: `Proposal ${status}ed successfully.`,
          variant: "success",
        });
      }
      
      // Refresh candidates list
      if (jobId) {
        fetchCandidates(parseInt(jobId));
      }
    } catch (error) {
      console.error('Error updating proposal:', error);
      toast({
        title: "Error",
        description: `Error during update.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-3xl -z-10" />
          <div className="space-y-3 relative">
            <div className="flex items-center gap-2 text-primary/70">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Candidate Discovery</span>
            </div>
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Discover Top Talent
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              AI-powered candidate matching with intelligent scoring
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-xl border border-border/30 backdrop-blur-sm">
            <p className="text-muted-foreground text-lg">
              <span className="font-bold text-foreground text-2xl">{candidates.length}</span> 
              <span className="ml-2">talented candidates discovered</span>
            </p>
          </div>

          {loading ? (
            <LoadingSpinner size="lg" message="Loading candidates..." />
          ) : candidates.length === 0 ? (
            <EmptyState 
              icon={Users}
              title="No Applicants Yet"
              description="No candidates have applied to this job yet."
            />
          ) : (
            [...candidates]
              .sort((a, b) => {
                // Sort by interview_score if interview is available, otherwise by ai_match_score
                if (interviewAvailability) {
                  return (b.interview_score || 0) - (a.interview_score || 0);
                }
                return (b.ai_match_score || 0) - (a.ai_match_score || 0);
              })
              .map((candidate, index) => {
            const mappedCandidate = {
              id: candidate.freelancer_id,
              name: candidate.freelancer_name,
              title: 'Freelancer',
              location: candidate.freelancer_location,
              experience_level: candidate.exprience_level,
              skills: candidate.skills,
              rate: candidate.hourly_rate,
              duration: candidate.duration,
              match: candidate.ai_match_score,
              interview_score: candidate.interview_score,
              proposal_id: candidate.proposal_id,
              proposal_status: candidate.proposal_status,
              saved: false
            };
            
            const isTopCandidate = index === 0;
            const isAccepted = mappedCandidate.proposal_status === 'accepted';
            
            return (
              <Card 
                key={mappedCandidate.id} 
                className={`group relative p-7 backdrop-blur-xl border shadow-xl hover:shadow-2xl transition-all duration-500 ${
                  isAccepted 
                    ? 'bg-gradient-to-br from-green-500/10 via-green-400/5 to-green-500/10 border-green-500/40 hover:border-green-500/60' 
                    : 'bg-gradient-to-br from-card/95 via-card/90 to-card/95 border-border/30 hover:border-primary/40'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  isAccepted ? 'from-green-500/10 via-green-400/10 to-green-500/10' : 'from-primary/5 via-accent/5 to-primary/5'
                }`} />
                
                <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                  <div className="flex gap-5 flex-1">
                    <Avatar className="w-24 h-24 ring-4 ring-primary/20 shadow-lg">
                      <AvatarFallback className="bg-gradient-to-br from-primary via-accent to-primary text-primary-foreground text-2xl font-bold">
                        {mappedCandidate.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{mappedCandidate.name}</h3>
                      <p className="text-muted-foreground mb-4 text-lg font-medium">{mappedCandidate.title}</p>
                      <div className="flex items-center gap-5 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary/60" />
                          <span className="font-medium">{mappedCandidate.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-primary/60" />
                          <span className="font-medium">{mappedCandidate.experience_level}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {mappedCandidate.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-sm">Hourly Rate:</span>
                        <span className="font-bold text-primary text-xl">${mappedCandidate.rate}/hr</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 lg:w-80">
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                      {isTopCandidate && !isAccepted && (
                        <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold px-4 py-1.5 shadow-lg animate-pulse">
                          <Award className="w-4 h-4 mr-1.5" />
                          Recommended
                        </Badge>
                      )}
                      <Badge variant={candidate.proposal_status === 'pending' ? 'default' : candidate.proposal_status === 'accepted' ? 'outline' : 'secondary'} className="capitalize shadow-lg px-4 py-1.5">
                        {candidate.proposal_status === 'pending' ? 'Under Review' : candidate.proposal_status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 p-5 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 rounded-xl border border-primary/20 shadow-lg">
                      {mappedCandidate.match >= 0 ? (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground font-medium">AI Match Score</span>
                          <span className="font-bold text-accent text-xl">{Math.floor(mappedCandidate.match * 100)}%</span>
                        </div>
                      ) : (
                        <span className="text-red-500 font-medium text-sm">No AI Match</span>
                      )}
                      {interviewAvailability && (
                        <>
                          <div className="flex items-center gap-3 pt-3 mt-3 border-t border-border/30">
                            {candidate.interview_score >= 0 ? (
                              <>
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="font-semibold text-green-600">Interviewed</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-5 h-5 text-orange-500" />
                                <span className="font-semibold text-orange-600">Pending</span>
                              </>
                            )}
                          </div>
                          {candidate.interview_score >= 0 && (
                            <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/30">
                              <span className="text-muted-foreground font-medium">Interview Score</span>
                              <span className="font-bold text-primary text-xl">{candidate.interview_score}%</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {candidate.proposal_status === 'pending' && (
                        <Button variant="default" onClick={() => handleProposalUpdate(candidate.proposal_id, 'accept', candidate.freelancer_name)} className="gap-2 h-11">
                          <CheckCircle className="w-5 h-5" />
                          Accept Proposal
                        </Button>
                      )}
                      {candidate.proposal_status === 'accepted' && (
                        <Button 
                          variant="default" 
                          className="gap-2 h-11"
                          onClick={() => navigate('/chat')}
                        >
                          <Mail className="w-5 h-5" />
                          Contact Candidate
                        </Button>
                      )}
                      <ProposalDetailsDialog proposalId={candidate.proposal_id} freelancerName={candidate.freelancer_name} freelancerLocation={candidate.freelancer_location} />
                      {interviewAvailability && (
                        <Button variant="outline" className="gap-2 h-11" onClick={() => { setSelectedReport(candidate.report); setReportDialogOpen(true); }}>
                          <FileText className="w-4 h-4" />
                          View Report
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          }))}
        </div>
      </main>

      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Interview Report</DialogTitle>
            <DialogDescription>Candidate interview performance details</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">{selectedReport}</pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewApplicants;
