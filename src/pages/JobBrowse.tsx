import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useJobs } from "@/context/JobContext";
import { Search, MapPin, Briefcase, Clock, DollarSign, Bookmark, Send, Zap, TrendingUp, Star, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";
import { JobDetailsDialog } from "@/components/JobDetailsDialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";


const JobBrowse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [salaryRange, setSalaryRange] = useState([50]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedExpereincelevel, setSelectedExperiencelevel] = useState<string[]>([]);
  const [minMatchScore, setMinMatchScore] = useState(0); // New: minimum match score
  const { jobs, loading, error } = useJobs();
  const navigate = useNavigate();
  const experience_level = ["begineer", "intermediate", "Mid", "Expert"];
  const categories = ["Development", "Design", "Marketing", "Writing", "Data Science"];
  const jobTypes = ["Fulltime", "Parttime", "Contract", "Remote"];

  // Helper to capitalize job type
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  // Filter and search logic
  const filteredJobs = jobs.filter((job) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      job.title.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower) ||
      job.required_skills?.some((skill) => skill.toLowerCase().includes(searchLower));

    const matchesLocation =
      !locationQuery || job.location.toLowerCase().includes(locationQuery.toLowerCase());

    // Case-insensitive job type filter
    const matchesJobType =
      selectedJobTypes.length === 0 ||
      selectedJobTypes.some((type) => type.toLowerCase() === String(job.job_type).toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((cat) =>
        job.required_skills?.some((skill) =>
          skill.toLowerCase().includes(cat.toLowerCase())
        )
      );
  const matchesExperience_level =
     selectedExpereincelevel.length === 0 ||
      selectedExpereincelevel.some((exper) => exper.toLowerCase() === String(job.experience_level).toLowerCase());


    // Salary comparison - extract number from budget string if needed
    const budgetValue = typeof job.budget === 'string' 
      ? parseFloat(job.budget.replace(/[^0-9.]/g, '')) || 0
      : Number(job.budget) || 0;
    const matchesSalary = budgetValue >= salaryRange[0];

    // Match score filter (exclude jobs below minMatchScore)
    const matchesMinMatch = (typeof job.match_score === 'number' ? job.match_score * 100 : 0) >= minMatchScore;

    return matchesSearch && matchesLocation && matchesJobType && matchesCategory&&matchesExperience_level && matchesSalary && matchesMinMatch;
  });

  // Always store selected job types as lower case for consistency
  const toggleJobType = (type: string) => {
    const typeLower = type.toLowerCase();
    setSelectedJobTypes((prev) =>
      prev.includes(typeLower) ? prev.filter((t) => t !== typeLower) : [...prev, typeLower]
    );
  };
  const toggleExperience_level = (experiencelevel: string) => {
    const typeLower = experiencelevel.toLowerCase();
    setSelectedExperiencelevel((prev) =>
      prev.includes(typeLower) ? prev.filter((t) => t !== typeLower) : [...prev, typeLower]
    );
  };
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setLocationQuery("");
    setSalaryRange([50]);
    setSelectedJobTypes([]);
    setSelectedCategories([]);
    setMinMatchScore(0);
    setSelectedExperiencelevel([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-3">Find Your Perfect Job</h1>
          <p className="text-lg text-muted-foreground">
            AI-powered job matching based on your skills and preferences
          </p>
        </div>

        {/* Search Bar */}
        <Card className="p-6 mb-8 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search jobs by title, skill, or company..."
                className="pl-10 h-11 bg-background/50 backdrop-blur-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative md:w-64">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Location"
                className="pl-10 h-11 bg-background/50 backdrop-blur-sm"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
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
                <Button variant="ghost" size="sm" className="text-xs" onClick={clearAllFilters}>
                  Clear All
                </Button>
              </div>

              {/* Job Type */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Job Type</h4>
                <div className="space-y-3">
                  {jobTypes.map((type, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${idx}`}
                        checked={selectedJobTypes.includes(type.toLowerCase())}
                        onCheckedChange={() => toggleJobType(type)}
                      />
                      <label htmlFor={`type-${idx}`} className="text-sm cursor-pointer">
                        {capitalize(type)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
                  {/* Experience Level */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Experience Level</h4>
                <div className="space-y-3">
                  {experience_level.map((type, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${idx}`}
                        checked={selectedExpereincelevel.includes(type.toLowerCase())}
                        onCheckedChange={() => toggleExperience_level(type)}
                      />
                      <label htmlFor={`type-${idx}`} className="text-sm cursor-pointer">
                        {capitalize(type)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Category</h4>
                <div className="space-y-3">
                  {categories.map((category, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${idx}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <label htmlFor={`cat-${idx}`} className="text-sm cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Minimum Hourly Rate</h4>
                <div className="space-y-4">
                  <Slider value={salaryRange} onValueChange={setSalaryRange} max={200} step={10} />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">$0</span>
                    <span className="font-bold text-primary">${salaryRange[0]}/hr</span>
                    <span className="text-muted-foreground">$200</span>
                  </div>
                </div>
              </div>

              {/* Match Score (Minimum) */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Minimum Match Score</h4>
                <div className="space-y-4">
                  <Slider value={[minMatchScore]} onValueChange={([v]) => setMinMatchScore(v)} max={100} step={5} />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">0%</span>
                    <span className="font-bold text-primary">{minMatchScore}%</span>
                    <span className="text-muted-foreground">100%</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* AI Tip */}
            <Card className="p-5 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2 border-primary/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold mb-1 text-sm">AI Tip</h4>
                  <p className="text-xs text-muted-foreground">
                    Add "Docker" to your skills to unlock 23 more high-match jobs!
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <LoadingSpinner size="lg" message="Finding perfect jobs for you..." />
            ) : error ? (
              <div className="">
              <EmptyState 
                icon={Briefcase}
                title={error.includes("profile") ? "No Jobs Available" : "Connection Error" }
                description={error || "Please make sure your backend is running and try again."}
              />
              {
                error.includes("profile") && (
                  <div className="text-center mt-2">
                    <Button variant="hero" onClick={() => navigate("/profile")}>
                      <Eye className="w-4 h-4 mr-2" />
                      Create Profile to See Jobs  
                    </Button>
                  </div>
                )
              }
              </div>
                
            ) : filteredJobs.length === 0 ? (
              <EmptyState 
                icon={Search}
                title="No Jobs Found"
                description="We couldn't find any jobs matching your filters. Try adjusting your search criteria."
                actionLabel="Clear Filters"
                onAction={clearAllFilters}
              />
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-muted-foreground">
                    <span className="font-bold text-foreground">
                      {filteredJobs.length} jobs
                    </span>{" "}
                    found • Sorted by match
                  </p>
                  <Button variant="outline" size="sm" className="gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Best Match
                  </Button>
                </div>

                {filteredJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-primary/30 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-400"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold">{job.title}</h3>
                            </div>
                            <p className="text-muted-foreground">Client Name: {job.client_name}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant="secondary" className="mb-2">{job.status === "draft" ? "open" : job.status}</Badge>
                            <Button variant="ghost" size="icon">
                              <Bookmark className="w-5 h-5" />
                            </Button>
                            <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 px-3 py-2 rounded-lg">
                              <Star className="w-5 h-5 text-primary fill-primary" />
                              <div className="text-right">
                                <div className="text-2xl font-bold text-primary">
                                  {Math.floor(job.match_score * 100)}%
                                </div>
                                <div className="text-xs text-muted-foreground">Match</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {capitalize(String(job.job_type))}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-bold text-primary">
                              {typeof job.budget === 'string' 
                                ? job.budget 
                                : `$${Number(job.budget).toLocaleString()}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(job.created_at).toLocaleDateString()}
                          </div>
                        </div>

                        {/* <p className="text-muted-foreground mb-4 leading-relaxed">
                          {job.description.substring(0,10)}
                        </p> */}

                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.required_skills?.map((skill, idx) => (
                            <Badge key={idx} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="text-sm text-muted-foreground">
                          Experience Level:{" "}
                          <span className="font-medium text-foreground">
                            {job.experience_level}
                          </span>
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
                        <div className="flex gap-2">
                          <JobDetailsDialog job={job} userType="freelancer" />
                          <Button variant="outline" size="sm">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Load More */}
                <div className="text-center pt-8">
                  <Button variant="glass" size="lg">
                    Load More Jobs
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobBrowse;
