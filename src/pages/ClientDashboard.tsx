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
  Target,
  User,
  DollarSign
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useClientJobs } from "@/context/ClientJobContext";
import { JobDetailsDialog } from "@/components/JobDetailsDialog";

const ClientDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { jobs, loading: jobsLoading } = useClientJobs();

  // Parse user if it's a string
  console.log("User Data:", user);
  
  //const userData = user ? (typeof user === 'string' ? JSON.parse(user) : user) : null;
  const username = user?.username || "User";
  
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
  
  const myJobs = jobs.filter(job => job.client === user?.id);
  const activeJobs = myJobs.filter(job => job.status.toLowerCase() === "active");

  const stats = [
    { label: "Active Jobs", value: activeJobs.length.toString(), icon: Briefcase, trend: `${myJobs.length} total`, color: "primary" },
    { label: "Total Jobs Posted", value: myJobs.length.toString(), icon: Target, trend: "All time", color: "secondary" },
    { label: "Avg Response Time", value: "2.4h", icon: Clock, trend: "Last 7 days", color: "accent" },
    { label: "Success Rate", value: "94%", icon: CheckCircle, trend: "This month", color: "primary" },
  ];

  const recentJobs = jobs.slice(0, 3).map(job => ({
    ...job,
    posted: new Date(job.created_at).toLocaleDateString(),
    applicants: 0, // Will be updated when we have applicants data
    views: 0, // Will be updated when we have views data
  }));

  const allMyJobs = myJobs.map(job => ({
    ...job,
    posted: new Date(job.created_at).toLocaleDateString(),
    applicants: 0, // Will be updated when we have applicants data
    views: 0, // Will be updated when we have views data
  }));


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {username}!</h1>
          <p className="text-muted-foreground">Manage your jobs and find the perfect talent</p>
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
                        variant={(job.status === "active" || job.status === "draft") ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {job.status === "draft" ? "open" : job.status}
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
                    <JobDetailsDialog job={job} userType="client" />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* My Job Postings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Job Postings</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/my-jobs">View All</Link>
            </Button>
          </div>

          {jobsLoading ? (
            <p className="text-muted-foreground text-center py-4">Loading jobs...</p>
          ) : allMyJobs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No jobs posted yet</p>
          ) : (
            allMyJobs.map((job) => (
              <Card key={job.id} className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-primary/30 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-400">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">Posted {job.posted}</p>
                      </div>
                      <Badge
                        variant={(job.status === "active" || job.status === "draft") ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {job.status === "draft" ? "open" : job.status}
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
