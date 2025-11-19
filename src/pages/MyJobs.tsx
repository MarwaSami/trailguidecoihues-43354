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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Job Postings</h1>
          <p className="text-muted-foreground">Manage all your job postings and view applicants</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search your jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your jobs...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Jobs List */}
        {!loading && !error && (
          <div className="space-y-6">
            {filteredJobs.length === 0 ? (
              <Card className="border-dashed border-2 border-border/50 bg-[var(--gradient-card)] backdrop-blur-[var(--blur-glass)]">
                <CardContent className="pt-12 pb-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                  <p className="text-muted-foreground mb-6">Create your first job posting and start receiving applications!</p>
                  <Button asChild size="lg" className="shadow-[var(--shadow-glow)]">
                    <Link to="/job-posting">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Post a Job
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredJobs.map((job, idx) => (
                <Card 
                  key={job.id} 
                  className="group relative overflow-hidden border-border/50 bg-card/95 backdrop-blur-[var(--blur-glass)] shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-[var(--gradient-card)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardHeader className="relative z-10">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">{job.title}</CardTitle>
                          <Badge 
                            variant={getStatusColor(job.status)}
                            className="shrink-0 shadow-sm"
                          >
                            {job.status === "draft" ? "Open" : job.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                            <MapPin className="w-4 h-4 text-primary/70" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                            <Briefcase className="w-4 h-4 text-primary/70" />
                            {job.job_type}
                          </span>
                          <span className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors font-semibold">
                            <DollarSign className="w-4 h-4 text-primary/70" />
                            {job.budget}
                          </span>
                          <span className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                            <Calendar className="w-4 h-4 text-primary/70" />
                            {new Date(job.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    <p className="text-muted-foreground line-clamp-2 leading-relaxed">{job.description}</p>
                    
                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {job.required_skills.map((skill) => (
                        <Badge 
                          key={skill.id} 
                          variant="outline"
                          className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-border/50">
                      <Button
                        variant="outline"
                        asChild
                        className="flex-1 items-center gap-2 hover:bg-primary/5 hover:border-primary/50 hover:text-primary transition-all"
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
