import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useClientJobs } from "@/context/ClientJobContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Users,
  Eye,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import { ApplicantsDialog } from "@/components/ApplicantsDialog";

const MyJobs = () => {
  const { jobs, loading, error } = useClientJobs();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const userData = user ? JSON.parse(user) : null;
  const clientName = userData?.username || "";

  // Filter jobs by client name and search term
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "default";
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
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No jobs found. Create your first job posting!</p>
                  <Button asChild className="mt-4">
                    <Link to="/job-posting">Post a Job</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredJobs.map((job) => (
                <Card key={job.id} className="shadow-card hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-2xl">{job.title}</CardTitle>
                          <Badge variant={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.job_type}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.budget}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(job.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground line-clamp-2">{job.description}</p>
                    
                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {job.required_skills.map((skill) => (
                        <Badge key={skill.id} variant="outline">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedJobId(job.id)}
                        className="flex items-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        View Applicants
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Applicants Dialog */}
        {selectedJobId && (
          <ApplicantsDialog 
            jobId={selectedJobId} 
            open={!!selectedJobId}
            onOpenChange={(open) => !open && setSelectedJobId(null)}
          />
        )}
      </main>
    </div>
  );
};

export default MyJobs;
