import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useJobs } from "@/context/JobContext";
import { Loader2, Search, MapPin, Briefcase, Clock, DollarSign, Bookmark, Send, Zap, TrendingUp, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobBrowse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [salaryRange, setSalaryRange] = useState([50]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMatchScores, setSelectedMatchScores] = useState<number[]>([]);
  const { jobs, loading, error } = useJobs();
  const navigate = useNavigate();

  const categories = ["Development", "Design", "Marketing", "Writing", "Data Science"];
  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote"];

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

    const matchesJobType =
      selectedJobTypes.length === 0 || selectedJobTypes.includes(job.job_type);

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((cat) =>
        job.required_skills?.some((skill) =>
          skill.toLowerCase().includes(cat.toLowerCase())
        )
      );

    // Salary comparison (budget is a number)
    const matchesSalary = Number(job.budget) >= salaryRange[0];

    return matchesSearch && matchesLocation && matchesJobType && matchesCategory && matchesSalary;
  });

  const toggleJobType = (type: string) => {
    setSelectedJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const toggleMatchScore = (score: number) => {
    setSelectedMatchScores((prev) =>
      prev.includes(score) ? prev.filter((s) => s !== score) : [...prev, score]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setLocationQuery("");
    setSalaryRange([50]);
    setSelectedJobTypes([]);
    setSelectedCategories([]);
    setSelectedMatchScores([]);
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
                        checked={selectedJobTypes.includes(type)}
                        onCheckedChange={() => toggleJobType(type)}
                      />
                      <label htmlFor={`type-${idx}`} className="text-sm cursor-pointer">
                        {type}
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

              {/* Match Score */}
              <div>
                <h4 className="font-medium mb-3">Minimum Match</h4>
                <div className="space-y-2">
                  {[90, 80, 70].map((score) => (
                    <div key={score} className="flex items-center space-x-2">
                      <Checkbox
                        id={`match-${score}`}
                        checked={selectedMatchScores.includes(score)}
                        onCheckedChange={() => toggleMatchScore(score)}
                      />
                      <label htmlFor={`match-${score}`} className="text-sm cursor-pointer">
                        {score}%+ match
                      </label>
                    </div>
                  ))}
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
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <Card className="p-8 text-center bg-background/40 backdrop-blur-xl border border-border/50">
                <p className="text-destructive mb-2">{error}</p>
                <p className="text-sm text-muted-foreground">Please make sure your Python backend is running.</p>
              </Card>
            ) : filteredJobs.length === 0 ? (
              <Card className="p-8 text-center bg-background/40 backdrop-blur-xl border border-border/50">
                <p className="text-muted-foreground">No jobs found matching your filters</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
              </Card>
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
                              <Badge variant="secondary">{job.status}</Badge>
                            </div>
                            <p className="text-muted-foreground">Client Name: {job.client_name}</p>
                          </div>
                          <Button variant="ghost" size="icon">
                            {/* <Bookmark className="w-5 h-5" /> */}
                           <div>
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                             <Star className="w-5 h-5" />Matched Score : {Math.floor( job.match_score*100)}%
                             
                           </div>

                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.job_type}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-bold text-primary">
                              ${job.budget.toLocaleString()}
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
                        <Button variant="hero" className="gap-2">
                          <Send className="w-4 h-4" />
                          Apply Now
                        </Button>
                        <Button 
                          variant="hero" 
                          className="gap-2"
                          onClick={() => navigate("/job-proposal", { state: { job } })}
                        ></Button>
                        
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
