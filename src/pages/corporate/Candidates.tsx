import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Star,
  Download,
  Eye,
  MessageSquare,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
} from "lucide-react";

const candidates = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    position: "Senior Frontend Developer",
    avatar: "SJ",
    score: 92,
    experience: "5+ years",
    location: "San Francisco, CA",
    education: "BS Computer Science",
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    status: "Shortlisted",
    appliedDate: "2 days ago",
    salary: "$140k",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    position: "Product Manager",
    avatar: "MC",
    score: 88,
    experience: "4+ years",
    location: "Seattle, WA",
    education: "MBA, BS Engineering",
    skills: ["Product Strategy", "Analytics", "Agile", "Leadership"],
    status: "Interview Scheduled",
    appliedDate: "3 days ago",
    salary: "$135k",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily.davis@email.com",
    position: "UX Designer",
    avatar: "ED",
    score: 85,
    experience: "3+ years",
    location: "New York, NY",
    education: "BFA Design",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    status: "Under Review",
    appliedDate: "5 days ago",
    salary: "$115k",
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david.wilson@email.com",
    position: "Senior Frontend Developer",
    avatar: "DW",
    score: 78,
    experience: "6+ years",
    location: "Austin, TX",
    education: "MS Computer Science",
    skills: ["Vue.js", "Python", "Docker", "GraphQL"],
    status: "New Application",
    appliedDate: "1 day ago",
    salary: "$125k",
  },
];

export default function CandidateScreening() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPosition, setFilterPosition] = useState("all");

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || candidate.status.toLowerCase().includes(filterStatus.toLowerCase());
    const matchesPosition = filterPosition === "all" || candidate.position.toLowerCase().includes(filterPosition.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Shortlisted": return "default";
      case "Interview Scheduled": return "default";
      case "Under Review": return "secondary";
      case "New Application": return "outline";
      default: return "secondary";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-info";
    if (score >= 70) return "text-warning";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Candidate Screening</h1>
          <p className="text-muted-foreground mt-1">
            Review and rank candidates with AI-powered screening
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New Applications</SelectItem>
            <SelectItem value="review">Under Review</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="scheduled">Interview Scheduled</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterPosition} onValueChange={setFilterPosition}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            <SelectItem value="frontend">Frontend Developer</SelectItem>
            <SelectItem value="product">Product Manager</SelectItem>
            <SelectItem value="designer">UX Designer</SelectItem>
            <SelectItem value="backend">Backend Developer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Candidates</p>
                <p className="text-2xl font-bold">247</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Shortlisted</p>
                <p className="text-2xl font-bold">42</p>
              </div>
              <div className="p-2 bg-success/10 rounded-full">
                <Star className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Interviews</p>
                <p className="text-2xl font-bold">18</p>
              </div>
              <div className="p-2 bg-info/10 rounded-full">
                <Calendar className="h-5 w-5 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
                <p className="text-2xl font-bold">83</p>
              </div>
              <div className="p-2 bg-warning/10 rounded-full">
                <Star className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidate List */}
      <div className="space-y-4">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate.id} className="shadow-card hover:shadow-elegant transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {candidate.avatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground">{candidate.email}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {candidate.position}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {candidate.location}
                      </span>
                      <span className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-1" />
                        {candidate.education}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.slice(0, 4).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{candidate.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(candidate.status)}>
                      {candidate.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">AI Score:</span>
                      <span className={`text-sm font-semibold ${getScoreColor(candidate.score)}`}>
                        {candidate.score}/100
                      </span>
                    </div>
                    <Progress value={candidate.score} className="w-20 h-2" />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span>Applied: {candidate.appliedDate}</span>
                  <span>Experience: {candidate.experience}</span>
                  <span>Expected: {candidate.salary}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    Reject
                  </Button>
                  <Button size="sm">
                    Shortlist
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}