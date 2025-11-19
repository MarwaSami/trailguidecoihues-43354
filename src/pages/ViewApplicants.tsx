
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Target,
  MapPin,
  Briefcase,
  Star,
  Mail,
  Download,
  Heart,
  CheckCircle,
  Clock,
  Users,
  FileText
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
  DialogTrigger,
} from "@/components/ui/dialog";


const ViewApplicants = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { candidates, fetchCandidates, loading } = useApplicants();
  const { toast } = useToast();
  const [interviewAvailability, setInterviewAvailability] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  useEffect(() => {
    if (jobId) {
   //   console.log('Fetching candidates for jobId:', jobId);
      fetchCandidates(parseInt(jobId));
      // Fetch interview availability
      const fetchInterviewAvailability = async () => {
        //console.log('Starting fetchInterviewAvailability for jobId:', jobId);
        try {
          const token = localStorage.getItem('token');
         // console.log('Token retrieved:', token ? 'present' : 'null');
          const response = await axios.get(`${baseURL}jobs/jobs/${jobId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
         // console.log('Job Details Response:', response.data);
          setInterviewAvailability(response.data.interview_availability);
        } catch (error) {
          console.error('Error fetching interview availability:', error);
        }
      };
      fetchInterviewAvailability();
    }
  }, [jobId, fetchCandidates]);

  const handleProposalUpdate = async (proposalId: number, status: 'accept' | 'reject') => {
    try {
      const response = await axios.post(`${baseURL}jobs/proposal-update/`, {
        status,
        proposal_id: proposalId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      //console.log('Proposal update response:', response.data);
      //show this responce on the UI as a toast notification or alert
       toast({
          title: "Done",
          description: `Proposal ${status}ed successfully.`,
          variant: "success",
        });
    } catch (error) {
      console.error('Error updating proposal:', error);
         toast({
          title: "Done",
          description: `Error During Update.`,
          variant: "destructive",
        });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        {/* Enhanced Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-3xl -z-10" />
          <div className="space-y-3 relative">
            <div className="flex items-center gap-2 text-primary/70">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Candidate Discovery</span>
            </div>
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
              Discover Top Talent
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              AI-powered candidate matching with intelligent scoring and detailed profiles
            </p>
          </div>
        </div>

        {/* Candidates List */}
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
              description="No candidates have applied to this job yet. Share your job posting to attract more applicants!"
            />
          ) : (
            // Sort candidates by AI match score (descending)
            [...candidates]
              .sort((a, b) => (b.ai_match_score || 0) - (a.ai_match_score || 0))
              .map((candidate) => {
            const mappedCandidate = {
              id: candidate.freelancer_id,
              name: candidate.freelancer_name,
              title: 'Freelancer', // Default title
              location: candidate.freelancer_location,
              experience_level: candidate.exprience_level,
              skills: candidate.skills,
              rate: candidate.hourly_rate,
              duration: candidate.duration,
              match: candidate.ai_match_score,
              interview_score: candidate.interview_score,
              proposal_id: candidate.proposal_id,
              proposal_status: candidate.proposal_status,
              saved: false // Default
            };
        //      console.log('Candidate Interview Data:', candidate.interview_score);
            return (
              <Card key={mappedCandidate.id} className="group relative p-7 bg-gradient-to-br from-card/95 via-card/90 to-card/95 backdrop-blur-xl border border-border/30 hover:border-primary/40 shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in overflow-hidden">
                {/* Animated Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 -z-0" />
                
                <Badge 
                  variant={candidate.proposal_status === 'pending' ? 'default' : candidate.proposal_status === 'accepted' ? 'outline' : 'secondary'} 
                  className="absolute top-5 right-5 z-10 capitalize shadow-lg backdrop-blur-sm px-4 py-1 text-sm font-semibold"
                >
                  {candidate.proposal_status === 'pending' ? 'Under Review' : candidate.proposal_status}
                </Badge>
                <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                  {/* Avatar & Basic Info */}
                  <div className="flex gap-5 flex-1">
                    <Avatar className="w-24 h-24 ring-4 ring-primary/20 shadow-lg">
                      <AvatarFallback className="bg-gradient-to-br from-primary via-accent to-primary text-primary-foreground text-2xl font-bold">
                        {mappedCandidate.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{mappedCandidate.name}</h3>
                      <p className="text-muted-foreground mb-4 text-lg font-medium">{mappedCandidate.title}</p>

                      <div className="flex items-center gap-5 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2 group/item">
                          <MapPin className="w-4 h-4 text-primary/60 group-hover/item:text-primary transition-colors" />
                          <span className="font-medium">{mappedCandidate.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 group/item">
                          <Briefcase className="w-4 h-4 text-primary/60 group-hover/item:text-primary transition-colors" />
                          <span className="font-medium">{mappedCandidate.experience_level}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {mappedCandidate.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50 transition-all shadow-sm backdrop-blur-sm font-medium">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-6 text-base">
                        <div className="px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                          <span className="text-muted-foreground font-medium">Rate: </span>
                          <span className="font-bold text-primary text-lg">${mappedCandidate.rate}/hr</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interview Data & Actions */}
                  <div className="flex flex-col gap-4 lg:w-72">
                    <div className="space-y-3 p-5 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 rounded-xl border border-primary/20 backdrop-blur-sm shadow-lg">
                      {/* AI Match Score */}
                      {mappedCandidate.match >= 0 ? (
                        <div className="text-base flex items-center justify-between">
                          <span className="text-muted-foreground font-medium">AI Match Score</span>
                          <span className="font-bold text-accent text-xl">{Math.floor(mappedCandidate.match * 100)}%</span>
                        </div>
                      ) : (
                        <span className="text-red-500 font-medium text-sm">No AI Match Available</span>
                      )}

                      {/* Interview Data - Only show if interview availability is true */}
                      {interviewAvailability && (
                        <>
                          <div className="flex items-center gap-3 text-base">
                            {candidate.interview_score >= 0 ? (
                              <>
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="font-semibold text-green-600">Interviewed</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-5 h-5 text-orange-500" />
                                <span className="font-semibold text-orange-600">Pending Interview</span>
                              </>
                            )}
                          </div>
                          
                          {candidate.interview_score >= 0 && (
                            <div className="text-base flex items-center justify-between pt-2 border-t border-border/30">
                              <span className="text-muted-foreground font-medium">Interview Score</span>
                              <span className="font-bold text-primary text-xl">{candidate.interview_score}%</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {candidate.proposal_status === 'pending' && (
                        <Button 
                          variant="default" 
                          onClick={() => handleProposalUpdate(candidate.proposal_id, 'accept')}
                          className="gap-2 h-11 shadow-md hover:shadow-lg transition-all font-semibold"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Accept Proposal
                        </Button>
                      )}
                      
                      {candidate.proposal_status === 'accepted' && (
                        <Button variant="default" className="gap-2 h-11 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-md hover:shadow-lg transition-all font-semibold">
                          <Mail className="w-5 h-5" />
                          Contact Candidate
                        </Button>
                      )}
                    
                      <ProposalDetailsDialog
                        proposalId={candidate.proposal_id}
                        freelancerName={candidate.freelancer_name}
                        freelancerLocation={candidate.freelancer_location}
                      />
                      {interviewAvailability && (
                        <Button
                          variant="outline"
                          className="gap-2 h-11 border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all font-semibold"
                          onClick={() => {
                            setSelectedReport(candidate.report);
                            setReportDialogOpen(true);
                          }}
                        >
                          <FileText className="w-4 h-4" />
                          View Interview Report
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="self-end hover:bg-primary/10 transition-colors">
                        <Heart className={`w-5 h-5 ${mappedCandidate.saved ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          }))}

          {/* Load More */}
          {!loading && candidates.length > 0 && (
            <div className="text-center pt-8">
              <Button variant="glass" size="lg">
                Load More Candidates
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Interview Report</DialogTitle>
            <DialogDescription>
              Detailed report of the candidate's interview performance.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
              {selectedReport}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewApplicants;
