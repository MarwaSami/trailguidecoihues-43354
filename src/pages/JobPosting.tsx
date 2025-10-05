import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Plus,
  X,
  FileText,
  DollarSign,
  MapPin,
  Briefcase,
  Clock,
  Users,
  Zap
} from "lucide-react";

const JobPosting = () => {
  const [skills, setSkills] = useState<string[]>(["React", "Node.js"]);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const suggestedSkills = ["TypeScript", "AWS", "PostgreSQL", "Docker", "REST APIs"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">Post a New Job</h1>
            <p className="text-muted-foreground">Let AI help you create the perfect job posting</p>
          </div>

          {/* AI Assistant Card */}
          <Card className="relative p-6 mb-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2 border-primary/20 overflow-hidden">
            <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-5" />
            <div className="relative flex items-start gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">AI Job Assistant</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  I can help you write a compelling job description, suggest required skills, and optimize for the best candidates.
                </p>
                <Button variant="secondary" size="sm" className="gap-2">
                  <Zap className="w-4 h-4" />
                  Generate with AI
                </Button>
              </div>
            </div>
          </Card>

          {/* Form */}
          <Card className="p-8 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
            <form className="space-y-6">
              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Job Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Senior Full-Stack Developer"
                  className="bg-background/50 backdrop-blur-sm"
                />
              </div>

              {/* Category & Job Type */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 backdrop-blur-sm">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Job Type *</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 backdrop-blur-sm">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fulltime">Full-time</SelectItem>
                      <SelectItem value="parttime">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location & Salary */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Remote or San Francisco, CA"
                    className="bg-background/50 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Salary Range *
                  </Label>
                  <Input
                    id="salary"
                    placeholder="e.g., $80-120/hr"
                    className="bg-background/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Experience & Duration */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level *</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50 backdrop-blur-sm">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Project Duration
                  </Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 3-6 months"
                    className="bg-background/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Job Description *
                  </Label>
                  <Button type="button" variant="ghost" size="sm" className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Generate
                  </Button>
                </div>
                <Textarea
                  id="description"
                  placeholder="Describe the role, responsibilities, and requirements..."
                  className="min-h-[200px] bg-background/50 backdrop-blur-sm"
                />
              </div>

              {/* Required Skills */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Required Skills *
                </Label>
                
                {/* Current Skills */}
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1.5 gap-2">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                {/* Add Skill */}
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    className="bg-background/50 backdrop-blur-sm"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} variant="secondary">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Suggested Skills */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">AI Suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors"
                        onClick={() => {
                          if (!skills.includes(skill)) {
                            setSkills([...skills, skill]);
                          }
                        }}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Screening Questions */}
              <div className="space-y-2">
                <Label>Screening Questions (Optional)</Label>
                <Textarea
                  placeholder="Add custom questions for applicants..."
                  className="min-h-[100px] bg-background/50 backdrop-blur-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button type="submit" variant="hero" className="flex-1 gap-2">
                  <Briefcase className="w-5 h-5" />
                  Post Job
                </Button>
                <Button type="button" variant="outline" className="flex-1">
                  Save as Draft
                </Button>
              </div>
            </form>
          </Card>

          {/* Preview Card */}
          <Card className="mt-8 p-6 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
            <h3 className="text-lg font-bold mb-4">Preview</h3>
            <p className="text-sm text-muted-foreground">
              Your job posting will appear to candidates with a {' '}
              <span className="font-bold text-primary">92% average match rate</span> based on the skills you've selected.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default JobPosting;
