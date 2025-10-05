import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Target,
  Bookmark,
  Send,
  Zap,
  TrendingUp
} from "lucide-react";

const JobBrowse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [salaryRange, setSalaryRange] = useState([50]);

  const jobs = [
    {
      id: 1,
      title: "Senior Full-Stack Developer",
      company: "TechCorp Inc.",
      location: "Remote",
      type: "Full-time",
      salary: "$80-120/hr",
      match: 95,
      posted: "2 hours ago",
      description: "Looking for an experienced developer to join our growing team...",
      tags: ["React", "Node.js", "TypeScript", "AWS"],
      applicants: 24,
      saved: false
    },
    {
      id: 2,
      title: "React Native Developer",
      company: "Mobile Innovations",
      location: "San Francisco, CA",
      type: "Contract",
      salary: "$70-100/hr",
      match: 92,
      posted: "5 hours ago",
      description: "Build cutting-edge mobile applications for top-tier clients...",
      tags: ["React Native", "iOS", "Android", "Firebase"],
      applicants: 18,
      saved: true
    },
    {
      id: 3,
      title: "Frontend Architect",
      company: "Digital Solutions",
      location: "Remote",
      type: "Full-time",
      salary: "$100-140/hr",
      match: 88,
      posted: "1 day ago",
      description: "Lead the frontend architecture for enterprise applications...",
      tags: ["React", "Architecture", "Leadership", "TypeScript"],
      applicants: 31,
      saved: false
    },
    {
      id: 4,
      title: "UI/UX Developer",
      company: "Creative Studio",
      location: "New York, NY",
      type: "Part-time",
      salary: "$60-90/hr",
      match: 85,
      posted: "2 days ago",
      description: "Design and implement beautiful user interfaces...",
      tags: ["UI/UX", "Figma", "React", "CSS"],
      applicants: 12,
      saved: false
    },
  ];

  const categories = ["Development", "Design", "Marketing", "Writing", "Data Science"];
  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-3">
            Find Your Perfect Job
          </h1>
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
                <Button variant="ghost" size="sm" className="text-xs">Clear All</Button>
              </div>

              {/* Job Type */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Job Type</h4>
                <div className="space-y-3">
                  {jobTypes.map((type, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Checkbox id={`type-${idx}`} />
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
                      <Checkbox id={`cat-${idx}`} />
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
                  <Slider
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                    max={200}
                    step={10}
                    className="w-full"
                  />
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
                      <Checkbox id={`match-${score}`} />
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
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">
                <span className="font-bold text-foreground">{jobs.length} jobs</span> found • Sorted by match
              </p>
              <Button variant="outline" size="sm" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                Best Match
              </Button>
            </div>

            {jobs.map((job) => (
              <Card key={job.id} className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-primary/30 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-400">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{job.title}</h3>
                          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold">
                            {job.match}% Match
                          </div>
                        </div>
                        <p className="text-muted-foreground">{job.company}</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Bookmark className={`w-5 h-5 ${job.saved ? 'fill-primary text-primary' : ''}`} />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-bold text-primary">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.posted}
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:w-48">
                    <Button variant="hero" className="gap-2">
                      <Send className="w-4 h-4" />
                      Apply Now
                    </Button>
                    <Button variant="outline">
                      View Details
                    </Button>
                    <div className="text-center text-sm text-muted-foreground mt-2">
                      {job.applicants} applicants
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobBrowse;
