import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useClientJobs } from "@/context/ClientJobContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  DollarSign,
  Briefcase,
  Users,
  Eye,
  Calendar
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { JobDetailsDialog } from "@/components/JobDetailsDialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";

const MyJobs = () => {
  const { jobs, loading, error } = useClientJobs();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const userData = user ? (typeof user === 'string' ? JSON.parse(user) : user) : null;
  const clientName = userData?.username || "";

  // Log jobs data once
  useEffect(() => {
    if (jobs.length > 0) {
      console.log("Jobs Data:", jobs);
    }
  }, []);

  // Check if user is client
  if (userData && userData.user_type !== 'client') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-red-500 mb-4">Access denied. This page is for clients only.</p>
            <Button onClick={() => navigate('/freelancer-dashboard')}>Go to Freelancer Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  // Filter jobs by client name and search term
  const filteredJobs = jobs.filter(job => {
    const matchesClient = job.client === user?.id;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClient && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "draft": return "default";
      case "closed": return "secondary";
      case "reviewing": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Enhanced Header with Background Effect */}
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-3xl -z-10" />
          <div className="space-y-3 relative">
            <div className="flex items-center gap-2 text-primary/70">
              <Briefcase className="w-5 h-5" />
              <span className="text-sm font-medium">Client Dashboard</span>
            </div>
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
              My Job Postings
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Manage your job listings, track applications, and find the perfect talent for your projects
            </p>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mb-8 relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by title, description, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 bg-card/50 backdrop-blur-xl border-border/50 focus:border-primary/50 focus:bg-card shadow-sm hover:shadow-md transition-all"
          />
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner size="lg" message="Loading your jobs..." />}

        {/* Error State */}
        {error && (
          <EmptyState 
            icon={Briefcase}
            title="Error Loading Jobs"
            description={error || "There was an error loading your jobs. Please try again."}
          />
        )}

        {/* Jobs List */}
        {!loading && !error && (
          <div className="space-y-6">
            {filteredJobs.length === 0 ? (
              <EmptyState 
                icon={Briefcase}
                title="No Jobs Found"
                description="Create your first job posting and start receiving applications!"
                actionLabel="Post a Job"
                onAction={() => window.location.href = '/job-posting'}
              />
            ) : (
              filteredJobs.map((job, idx) => (
                <Card 
                  key={job.id} 
                  className="group relative overflow-hidden border-border/30 bg-gradient-to-br from-card/95 via-card/90 to-card/95 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:border-primary/30 transition-all duration-500 animate-fade-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-700" />
                  
                  <CardHeader className="relative z-10 pb-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:via-accent group-hover:to-primary transition-all duration-300">
                            {job.title}
                          </CardTitle>
                          <Badge 
                            variant={getStatusColor(job.status)}
                            className="shrink-0 shadow-md backdrop-blur-sm"
                          >
                            {job.status === "draft" ? "Open" : job.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group/item">
                            <MapPin className="w-4 h-4 text-primary/60 group-hover/item:text-primary" />
                            <span className="font-medium">{job.location}</span>
                          </span>
                          <span className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group/item">
                            <Briefcase className="w-4 h-4 text-primary/60 group-hover/item:text-primary" />
                            <span className="font-medium">{job.job_type}</span>
                          </span>
                          <span className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group/item">
                            <DollarSign className="w-4 h-4 text-primary/60 group-hover/item:text-primary" />
                            <span className="font-bold text-primary">{job.budget}</span>
                          </span>
                          <span className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group/item">
                            <Calendar className="w-4 h-4 text-primary/60 group-hover/item:text-primary" />
                            <span className="font-medium">{new Date(job.created_at).toLocaleDateString()}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 relative z-10">
                    <p className="text-muted-foreground line-clamp-2 leading-relaxed text-base">{job.description}</p>
                    
                    {/* Enhanced Skills */}
                    <div className="flex flex-wrap gap-2">
                      {job.required_skills.map((skill) => (
                        <Badge 
                          key={skill.id} 
                          variant="outline"
                          className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50 transition-all shadow-sm backdrop-blur-sm font-medium"
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>

                    {/* Enhanced Actions */}
                    <div className="flex gap-3 pt-5 border-t border-border/30">
                      <Button
                        variant="outline"
                        asChild
                        className="flex-1 items-center gap-2 h-11 bg-gradient-to-r from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 border-primary/30 hover:border-primary/50 text-foreground hover:text-primary transition-all shadow-sm hover:shadow-md font-semibold"
                      >
                        <Link to={`/view-applicants/${job.id}`}>
                          <Users className="w-4 h-4" />
                          View Applicants
                        </Link>
                      </Button>
                      <JobDetailsDialog job={job} userType="client" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

      </main>
    </div>
  );
};

export default MyJobs;
