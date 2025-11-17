import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Target,
  Bell,
  User,
  DollarSign
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useClientJobs } from "@/context/ClientJobContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ClientDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { jobs, loading: jobsLoading } = useClientJobs();

  // Parse user if it's a string
  const userData = user ? (typeof user === 'string' ? JSON.parse(user) : user) : null;
  const username = userData?.username || "User";
  
  // Show loading state while auth or jobs are loading
  if (authLoading || jobsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }
  
  const activeJobs = jobs.filter(job => job.status.toLowerCase() === "active");
  
  const stats = [
    { label: "Active Jobs", value: activeJobs.length.toString(), icon: Briefcase, trend: `${jobs.length} total`, color: "primary" },
    { label: "Total Jobs Posted", value: jobs.length.toString(), icon: Target, trend: "All time", color: "secondary" },
    { label: "Avg Response Time", value: "2.4h", icon: Clock, trend: "Last 7 days", color: "accent" },
    { label: "Success Rate", value: "94%", icon: CheckCircle, trend: "This month", color: "primary" },
  ];

  const notifications = [
    { id: 1, text: "New application for Senior Developer position", time: "5m ago", link: "/candidate-discovery", unread: true },
    { id: 2, text: "Interview scheduled with candidate tomorrow", time: "1h ago", link: "/candidate-discovery", unread: true },
    { id: 3, text: "Job posting approved and published", time: "3h ago", link: "/job-posting", unread: false },
    { id: 4, text: "Freelancer submitted final deliverables", time: "1d ago", link: "/client-dashboard", unread: false },
  ];

  const recentJobs = jobs.slice(0, 3).map(job => ({
    id: job.id,
    title: job.title,
    posted: new Date(job.created_at).toLocaleDateString(),
    applicants: 0, // Will be updated when we have applicants data
    status: job.status,
    views: 0, // Will be updated when we have views data
    budget: job.budget,
  }));


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        {/* Header with Profile & Notifications */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, {username}!</h1>
            <p className="text-muted-foreground">Manage your jobs and find the perfect talent</p>
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
            <Link to="/client-dashboard">
              <Button variant="outline" size="icon" className="rounded-full">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                    {user?.username?.charAt(0).toUpperCase() || "C"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </Link>

            <Link to="/job-posting">
              <Button variant="hero" size="lg" className="gap-2">
                <Target className="w-5 h-5" />
                Post New Job
              </Button>
            </Link>
          </div>
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

        {/* Recent Jobs */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Job Postings</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>

          {jobsLoading ? (
            <p className="text-muted-foreground text-center py-4">Loading jobs...</p>
          ) : recentJobs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No jobs posted yet</p>
          ) : (
            recentJobs.map((job) => (
              <Card key={job.id} className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-primary/30 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-400">
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
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>{job.budget}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button variant="default" size="sm" asChild>
                      <Link to="/my-jobs">View Details</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
