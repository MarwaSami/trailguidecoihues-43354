import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Users,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  BarChart3,
  Search,
  Target
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const ClientDashboard = () => {
  const stats = [
    { label: "Active Jobs", value: "12", icon: Briefcase, trend: "+3 this week", color: "primary" },
    { label: "Total Applicants", value: "148", icon: Users, trend: "+24 new", color: "secondary" },
    { label: "Interviews Scheduled", value: "8", icon: Clock, trend: "This week", color: "accent" },
    { label: "Hired", value: "34", icon: CheckCircle, trend: "This month", color: "primary" },
  ];

  const recentJobs = [
    {
      title: "Senior Full-Stack Developer",
      posted: "2 days ago",
      applicants: 24,
      status: "active",
      views: 156,
    },
    {
      title: "UI/UX Designer",
      posted: "1 week ago",
      applicants: 18,
      status: "active",
      views: 98,
    },
    {
      title: "DevOps Engineer",
      posted: "3 days ago",
      applicants: 12,
      status: "reviewing",
      views: 67,
    },
  ];

  const topCandidates = [
    {
      name: "Sarah Johnson",
      role: "Full-Stack Developer",
      match: 95,
      skills: ["React", "Node.js", "PostgreSQL"],
      status: "interview",
    },
    {
      name: "Ahmed Hassan",
      role: "UI/UX Designer",
      match: 92,
      skills: ["Figma", "Sketch", "User Research"],
      status: "review",
    },
    {
      name: "Maria Garcia",
      role: "DevOps Engineer",
      match: 88,
      skills: ["AWS", "Docker", "Kubernetes"],
      status: "review",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Client Dashboard</h1>
            <p className="text-muted-foreground">Manage your jobs and find the perfect talent</p>
          </div>

           <Link to="/job-posting">
            <Button variant="hero" size="lg" className="gap-2">
              <Target className="w-5 h-5" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="group p-6 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-primary/50 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-400 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg group-hover:scale-110 transition-transform duration-400`}>
                  <stat.icon className={`w-6 h-6 text-primary-foreground`} />
                </div>
                <TrendingUp className="w-4 h-4 text-accent" />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-accent font-medium">{stat.trend}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Jobs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recent Job Postings</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>

            {recentJobs.map((job, idx) => (
              <Card key={idx} className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-primary/30 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-400">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">Posted {job.posted}</p>
                      </div>
                      <Badge 
                        variant={job.status === "active" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {job.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{job.applicants} applicants</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <span>{job.views} views</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button variant="default" size="sm">
                      View Applicants
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit Job
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Top Candidates */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Top AI Matches</h2>
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>

            <div className="space-y-4">
              {topCandidates.map((candidate, idx) => (
                <Card key={idx} className="p-5 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-accent/50 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-400 hover:scale-[1.02]">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold">{candidate.name}</h3>
                        <p className="text-sm text-muted-foreground">{candidate.role}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{candidate.match}%</div>
                        <p className="text-xs text-muted-foreground">Match</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, skillIdx) => (
                        <Badge key={skillIdx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="default" size="sm" className="flex-1">
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        Contact
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button variant="outline" className="w-full">
              View All Candidates
            </Button>
          </div>
        </div>

        {/* AI Insights */}
        <Card className="relative mt-8 p-8 bg-background/40 backdrop-blur-2xl border border-border/50 shadow-[var(--shadow-glass)] overflow-hidden">
          <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-5" />
          <div className="relative flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">AI Insights</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Based on your hiring patterns, we recommend posting jobs on Mondays for 30% more quality applicants. 
                Your average time-to-hire is 14 days, which is 20% faster than industry average.
              </p>
              <Button variant="secondary" size="sm">
                View Full Report
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ClientDashboard;
