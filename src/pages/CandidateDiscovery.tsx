import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Filter,
  Target,
  MapPin,
  Briefcase,
  Star,
  Award,
  Eye,
  Mail,
  Download,
  Heart,
  TrendingUp,
  Users
} from "lucide-react";

const CandidateDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [matchScore, setMatchScore] = useState([80]);

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

  const categories = ["Development", "Design", "Marketing", "Writing"];
  const experienceLevels = ["Junior", "Intermediate", "Senior", "Expert"];

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
            <Button variant="hero" className="gap-2">
              <Target className="w-4 h-4" />
              AI Match
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="p-6 mb-8 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, skills, or title..."
                className="pl-10 h-11 bg-background/50 backdrop-blur-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="hero" className="gap-2">
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>
        </Card>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Filters</h3>
                <Button variant="ghost" size="sm" className="text-xs">Clear</Button>
              </div>

              {/* Match Score */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Minimum Match Score</h4>
                <div className="space-y-4">
                  <Slider
                    value={matchScore}
                    onValueChange={setMatchScore}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">0%</span>
                    <span className="font-bold text-primary">{matchScore[0]}%</span>
                    <span className="text-muted-foreground">100%</span>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Category</h4>
                <div className="space-y-3">
                  {categories.map((category, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Checkbox id={`cat-${idx}`} />
                      <label htmlFor={`cat-${idx}`} className="text-sm cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Experience Level</h4>
                <div className="space-y-3">
                  {experienceLevels.map((level, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Checkbox id={`exp-${idx}`} />
                      <label htmlFor={`exp-${idx}`} className="text-sm cursor-pointer">
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="font-medium mb-3">Availability</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="avail-now" />
                    <label htmlFor="avail-now" className="text-sm cursor-pointer">
                      Available Now
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="avail-soon" />
                    <label htmlFor="avail-soon" className="text-sm cursor-pointer">
                      Within 2 Weeks
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Candidates List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">
                <span className="font-bold text-foreground">{candidates.length} candidates</span> found • Sorted by match
              </p>
              <Button variant="outline" size="sm" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                Best Match
              </Button>
            </div>

            {candidates.map((candidate) => (
              <Card key={candidate.id} className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-primary/30 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-400">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Avatar & Basic Info */}
                  <div className="flex gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xl font-bold">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{candidate.name}</h3>
                          <p className="text-muted-foreground">{candidate.title}</p>
                        </div>
                      </div>
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
                    </div>
                  </div>

                  {/* Skills & Details */}
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
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
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        {candidate.profileViews} views
                      </div>
                    </div>
                  </div>

                  {/* Match & Actions */}
                  <div className="flex flex-col items-end gap-3 lg:w-48">
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {candidate.match}%
                      </div>
                      <p className="text-xs text-muted-foreground">Match Score</p>
                    </div>
                    
                    <div className="flex flex-col gap-2 w-full">
                      <Button variant="hero" className="gap-2">
                        <Mail className="w-4 h-4" />
                        Contact
                      </Button>
                      <Button variant="outline">
                        View Profile
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Heart className={`w-5 h-5 ${candidate.saved ? 'fill-primary text-primary' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Load More */}
            <div className="text-center pt-8">
              <Button variant="glass" size="lg">
                Load More Candidates
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidateDiscovery;
