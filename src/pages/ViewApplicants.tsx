
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Clock
} from "lucide-react";
import { useApplicants } from "@/context/ApplicantContext";
import { ProposalDetailsDialog } from "@/components/ProposalDetailsDialog";

const ViewApplicants = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { candidates, fetchCandidates, loading } = useApplicants();
  const [allPrepared, setAllPrepared] = useState(false);
  const [candidatesData, setCandidatesData] = useState<Record<number, {
    interviewed: boolean;
    passingScore: number;
  }>>({});

  useEffect(() => {
    if (jobId) {
      console.log('Fetching candidates for jobId:', jobId);
      fetchCandidates(parseInt(jobId));
    }
  }, [jobId, fetchCandidates]);
  const handlePrepareAllCandidates = () => {
    const newData: Record<number, { interviewed: boolean; passingScore: number }> = {};
    candidates.forEach(candidate => {
      newData[candidate.freelancer_id] = {
        interviewed: Math.random() > 0.5,
        passingScore: Math.floor(Math.random() * 30) + 70
      };
    });
    setCandidatesData(newData);
    setAllPrepared(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Discover Candidates</h1>
            <p className="text-muted-foreground">AI-matched talent for your job postings</p>
          </div>
          {/* <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Results
            </Button>
            {!allPrepared && (
              <Button variant="hero" className="gap-2" onClick={handlePrepareAllCandidates}>
                <Target className="w-4 h-4" />
                Make Candidates Prepare for Interview
              </Button>
            )}
          </div> */}
        </div>

        {/* Candidates List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-muted-foreground">
              <span className="font-bold text-foreground">{candidates.length} candidates</span> found
              {allPrepared && <span className="ml-2 text-primary">• All prepared for interview</span>}
            </p>
          </div>

          {candidates.map((candidate) => {
            const mappedCandidate = {
              id: candidate.freelancer_id,
              name: candidate.freelancer_name,
              title: 'Freelancer', // Default title
              location: candidate.freelancer_location,
              experience_level: candidate.exprience_level,
              skills: candidate.skills,
              rate: candidate.hourly_rate,
              match: candidate.ai_match_score,
              saved: false // Default
            };
            const prepData = candidatesData[mappedCandidate.id];

            return (
              <Card key={mappedCandidate.id} className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-primary/30 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-400">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Avatar & Basic Info */}
                  <div className="flex gap-4 flex-1">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xl font-bold">
                        {mappedCandidate.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{mappedCandidate.name}</h3>
                      <p className="text-muted-foreground mb-3">{mappedCandidate.title}</p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {mappedCandidate.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {mappedCandidate.experience_level}
                        </div>

                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {mappedCandidate.skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">Rate: </span>
                          <span className="font-bold text-primary">${mappedCandidate.rate}/hr</span>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Interview Data & Actions */}
                  <div className="flex flex-col gap-3 lg:w-64">
                    <ProposalDetailsDialog
                      proposalId={candidate.proposal_id}
                      freelancerName={candidate.freelancer_name}
                      freelancerLocation={candidate.freelancer_location}
                    />
                    {allPrepared && prepData ? (
                      <>
                        <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2 text-sm">
                            {prepData.interviewed ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="font-medium">Interviewed</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-4 h-4 text-orange-500" />
                                <span className="font-medium">Not Interviewed</span>
                              </>
                            )}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Passing Score: </span>
                            <span className="font-bold text-primary">{prepData.passingScore}%</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">AI Match: </span>
                            <span className="font-bold text-accent">{mappedCandidate.match}%</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="hero" className="gap-2">
                            <Mail className="w-4 h-4" />
                            Contact
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          {mappedCandidate.match}%
                        </div>
                        <p className="text-xs text-muted-foreground">AI Match</p>
                      </div>
                    )}
                    <Button variant="ghost" size="icon" className="self-end">
                      <Heart className={`w-5 h-5 ${mappedCandidate.saved ? 'fill-primary text-primary' : ''}`} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Load More */}
          <div className="text-center pt-8">
            <Button variant="glass" size="lg">
              Load More Candidates
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewApplicants;
