import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  ArrowRight,
  Send,
  Bookmark,
  Receipt,
  Notebook,
  Bell
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useJobs } from "@/context/JobContext";
import { useAuth } from "@/context/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FreelancerDashboard = () => {
    const navigate = useNavigate();
    const { jobs } = useJobs();
    const { user } = useAuth();
    
    const recommendedJobs = jobs.slice(0, 4);
    const firstJobScore = jobs.length > 0 ? jobs[0].match_score : 0;
    const username = user?.username || 'User';

  const stats = [
    { label: "Active Applications", value: "8", icon: Briefcase, trend: "+2 this week", color: "primary" },
    { label: "Profile Views", value: "234", icon: Eye, trend: "+45 today", color: "secondary" },
    { label: "Recommended Jobs", value: String(jobs.length), icon: Bookmark, trend: "AI Matched", color: "accent" },
    { label: "Match Score", value: `${Math.round(firstJobScore)}%`, icon: Target, trend: "Top Match", color: "primary" },
  ];

  const notifications = [
    { id: 1, text: "New job match: Senior React Developer", time: "5m ago", link: "/job-browse", unread: true },
    { id: 2, text: "Your proposal was viewed by the client", time: "1h ago", link: "/job-browse", unread: true },
    { id: 3, text: "Interview scheduled for tomorrow at 2 PM", time: "3h ago", link: "/interview-practice", unread: false },
    { id: 4, text: "Payment received for completed project", time: "1d ago", link: "/freelancer-dashboard", unread: false },
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
        {/* Header with Profile & Notifications */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome Back, {username}</h1>
            <p className="text-muted-foreground">Your personalized dashboard with AI-powered insights</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative rounded-full">
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => n.unread).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                      {notifications.filter(n => n.unread).length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notif) => (
                  <DropdownMenuItem key={notif.id} asChild>
                    <Link 
                      to={notif.link} 
                      className={`flex flex-col items-start p-3 cursor-pointer ${notif.unread ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex items-start justify-between w-full gap-2">
                        <p className={`text-sm ${notif.unread ? 'font-semibold' : ''}`}>{notif.text}</p>
                        {notif.unread && <div className="w-2 h-2 bg-primary rounded-full mt-1" />}
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">{notif.time}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Avatar */}
            <Link to="/freelancer-profile">
              <Button variant="outline" size="icon" className="rounded-full">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </Link>

            <Link to="/job-browse">
              <Button variant="hero" size="lg" className="gap-2">
                <Target className="w-5 h-5" />
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>

        {/* Counter */}
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
                        <p className="text-sm text-muted-foreground">{job.client_name} </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          {Math.floor(job.match_score * 100)}%
                        </div>
                        <p className="text-xs text-muted-foreground">Match</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                          {job.required_skills?.map((skill, idx) => (
                            <Badge key={idx} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                    </div>
                   <div className="flex flex-wrap gap-2 mb-3">
                          {job.required_skills?.map((skill, idx) => (
                            <Badge key={idx} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-bold text-primary">{job.budget} $</span>
                      <span className="text-muted-foreground">Posted at  {new Date(job.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                   <div className="flex flex-col gap-3 lg:w-48">
                        <Button 
                          variant="hero" 
                          className="gap-2"
                          onClick={() => navigate("/job-proposal", { state: { job } })}
                        >
                          <Send className="w-4 h-4" />
                          Apply Now
                        </Button>
                        <Button variant="outline">
                          <Notebook className="w-4 h-4" />
                          View Details
                        </Button>
                        {
                          job.proposal_status === "SUBMITTED" ? (
                           <p className="w-full text-center text-muted-foreground">
                              Proposal Submitted
                            </p>
                          ) : job.proposal_status === "ACCEPTED" ? (
                            <Badge variant="default" className="w-full text-center">
                              Proposal Accepted
                            </Badge>
                          ) : job.proposal_status === "REJECTED" ? (
                            <Badge variant="destructive" className="w-full text-center">
                              Proposal Rejected
                            </Badge>
                          ) : (
                            <p className="w-full text-center text-green">
                              Proposal Drafted
                            </p>
                          )
         
                        }
                        
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
