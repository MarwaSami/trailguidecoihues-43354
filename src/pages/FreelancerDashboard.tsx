import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  TrendingUp,
  Clock,
  CheckCircle,
  Target,
  Zap,
  Eye,
  MessageSquare,
  Calendar,
  Award,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const FreelancerDashboard = () => {
  const stats = [
    { label: "Active Applications", value: "8", icon: Briefcase, trend: "+2 this week", color: "primary" },
    { label: "Profile Views", value: "234", icon: Eye, trend: "+45 today", color: "secondary" },
    { label: "Interviews", value: "3", icon: Calendar, trend: "Upcoming", color: "accent" },
    { label: "Match Score", value: "92%", icon: Target, trend: "Top 5%", color: "primary" },
  ];

  const recommendedJobs = [
    {
      title: "Senior React Developer",
      company: "TechCorp Inc.",
      location: "Remote",
      salary: "$80-120/hr",
      match: 95,
      posted: "2 hours ago",
      tags: ["React", "TypeScript", "Node.js"]
    },
    {
      title: "Full-Stack Engineer",
      company: "StartupHub",
      location: "San Francisco, CA",
      salary: "$90-130/hr",
      match: 92,
      posted: "5 hours ago",
      tags: ["React", "Python", "AWS"]
    },
    {
      title: "Frontend Architect",
      company: "Digital Solutions",
      location: "Remote",
      salary: "$100-140/hr",
      match: 88,
      posted: "1 day ago",
      tags: ["React", "Vue.js", "Architecture"]
    },
  ];

  const recentActivity = [
    {
      action: "Interview scheduled",
      job: "Senior React Developer at TechCorp",
      time: "2 hours ago",
      icon: Calendar,
      color: "primary"
    },
    {
      action: "New message",
      job: "From StartupHub recruiter",
      time: "4 hours ago",
      icon: MessageSquare,
      color: "secondary"
    },
    {
      action: "Application viewed",
      job: "Full-Stack Engineer position",
      time: "1 day ago",
      icon: Eye,
      color: "accent"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome Back, Alex</h1>
            <p className="text-muted-foreground">Your personalized dashboard with AI-powered insights</p>
          </div>
          <Link to="/job-browse">
            <Button variant="hero" size="lg" className="gap-2">
              <Target className="w-5 h-5" />
              Browse Jobs
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="group p-6 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-primary/50 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-400 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg group-hover:scale-110 transition-transform duration-400">
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
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
          {/* Recommended Jobs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold">AI Recommended for You</h2>
              </div>
              <Link to="/job-browse">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>

            {recommendedJobs.map((job, idx) => (
              <Card key={idx} className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-primary/30 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-400">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          {job.match}%
                        </div>
                        <p className="text-xs text-muted-foreground">Match</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.tags.map((tag, tagIdx) => (
                        <Badge key={tagIdx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-bold text-primary">{job.salary}</span>
                      <span className="text-muted-foreground">Posted {job.posted}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button variant="hero" size="sm">
                      Apply Now
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recent Activity</h2>
              <Clock className="w-5 h-5 text-primary" />
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <Card key={idx} className="p-5 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-accent/50 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-400">
                  <div className="flex gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br from-primary to-accent flex-shrink-0`}>
                      <activity.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold mb-1">{activity.action}</p>
                      <p className="text-sm text-muted-foreground mb-2 truncate">{activity.job}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/interview-practice">
                  <Button variant="glass" className="w-full justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    Practice Interview
                  </Button>
                </Link>
                <Link to="/freelancer-profile">
                  <Button variant="glass" className="w-full justify-start">
                    <Award className="w-4 h-4 mr-2" />
                    Update Profile
                  </Button>
                </Link>
                <Link to="/skill-evaluation">
                  <Button variant="glass" className="w-full justify-start">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Take Skill Test
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* AI Insights */}
        <Card className="relative mt-8 p-8 bg-background/40 backdrop-blur-2xl border border-border/50 shadow-[var(--shadow-glass)] overflow-hidden">
          <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-5" />
          <div className="relative flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">AI Career Insights</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Your profile is performing 40% better than last week! Consider adding "Kubernetes" to increase your match rate by 25%. 
                You're in the top 5% of candidates in your category.
              </p>
              <Link to="/reports">
                <Button variant="secondary" size="sm" className="gap-2">
                  View Full Report
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default FreelancerDashboard;
