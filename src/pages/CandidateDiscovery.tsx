import { useState } from "react";
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

const CandidateDiscovery = () => {
  const [allPrepared, setAllPrepared] = useState(false);
  const [candidatesData, setCandidatesData] = useState<Record<number, {
    interviewed: boolean;
    passingScore: number;
  }>>({});

  const candidates = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Senior Full-Stack Developer",
      location: "San Francisco, CA",
      rate: "$120/hr",
      match: 95,
      rating: 4.9,
      reviews: 47,
      availability: "Available",
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      experience: "8 years",
      profileViews: 234,
      saved: false
    },
    {
      id: 2,
      name: "Ahmed Hassan",
      title: "UI/UX Designer",
      location: "Remote",
      rate: "$90/hr",
      match: 92,
      rating: 5.0,
      reviews: 38,
      availability: "Available",
      skills: ["Figma", "User Research", "Prototyping", "Branding"],
      experience: "6 years",
      profileViews: 189,
      saved: true
    },
    {
      id: 3,
      name: "Maria Garcia",
      title: "DevOps Engineer",
      location: "New York, NY",
      rate: "$110/hr",
      match: 88,
      rating: 4.8,
      reviews: 52,
      availability: "In 2 weeks",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      experience: "7 years",
      profileViews: 167,
      saved: false
    },
  ];

  const handlePrepareAllCandidates = () => {
    const newData: Record<number, { interviewed: boolean; passingScore: number }> = {};
    candidates.forEach(candidate => {
      newData[candidate.id] = {
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
          <div className="flex gap-3">
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
          </div>
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
            const prepData = candidatesData[candidate.id];
            
            return (
              <Card key={candidate.id} className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-primary/30 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-400">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Avatar & Basic Info */}
                  <div className="flex gap-4 flex-1">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xl font-bold">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{candidate.name}</h3>
                      <p className="text-muted-foreground mb-3">{candidate.title}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {candidate.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {candidate.experience}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          {candidate.rating} ({candidate.reviews})
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {candidate.skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">Rate: </span>
                          <span className="font-bold text-primary">{candidate.rate}</span>
                        </div>
                        <div>
                          <Badge variant={candidate.availability === "Available" ? "default" : "secondary"}>
                            {candidate.availability}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interview Data & Actions */}
                  <div className="flex flex-col gap-3 lg:w-64">
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
                            <span className="font-bold text-accent">{candidate.match}%</span>
                          </div>
                        </div>
                        <Button variant="hero" className="gap-2">
                          <Mail className="w-4 h-4" />
                          Contact
                        </Button>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          {candidate.match}%
                        </div>
                        <p className="text-xs text-muted-foreground">AI Match</p>
                      </div>
                    )}
                    <Button variant="ghost" size="icon" className="self-end">
                      <Heart className={`w-5 h-5 ${candidate.saved ? 'fill-primary text-primary' : ''}`} />
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

export default CandidateDiscovery;
