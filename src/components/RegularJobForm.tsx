import { useState } from "react";
import axios from "axios";
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
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

// Base URL - Replace with your actual API base URL
const baseURL = "http://127.0.0.1:8000/api/v1/";

// TypeScript interfaces
export interface JobPosting {
  title: string;
  category: string;
  job_type: string;
  location: string;
  budget: number;
  experience_level: string;
  duration: string;
  description: string;
  required_skills: string[];
  screening_questions: string;
  client: number;
}

export interface JobPostingResponse {
  is_success: boolean;
  detail: string;
  job_id?: number;
}

export const RegularJobForm = () => {
  const {user,token} = useAuth()
  const navigate = useNavigate();
  // Form state
  const [formData, setFormData] = useState<JobPosting>({
    title: "",
    category: "",
    job_type: "",
    location: "",
    budget: 1,
    experience_level: "",
    duration: "",
    description: "",
    required_skills: ["React", "Node.js"],
    screening_questions: "",
    client: user.id || 0,
  });
  
  const [newSkill, setNewSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleInputChange = (field: keyof JobPosting, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill && !formData.required_skills.includes(newSkill)) {
      setFormData(prev => ({
        ...prev,
        required_skills: [...prev.required_skills, newSkill]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      required_skills: prev.required_skills.filter(s => s !== skill)
    }));
  };

  // Validation function
  const validateForm = (): boolean => {
    if (!formData.title || formData.title.trim().length < 3) {
      toast({
        title: "Validation Error",
        description: "Job title must be at least 3 characters long",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.category) {
      toast({
        title: "Validation Error",
        description: "Please select a job category",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.job_type) {
      toast({
        title: "Validation Error",
        description: "Please select a job type",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.budget || formData.budget < 5) {
      toast({
        title: "Validation Error",
        description: "Please provide a valid Budget (minimum $5)",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.experience_level) {
      toast({
        title: "Validation Error",
        description: "Please select an experience level",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.description || formData.description.trim().length < 50) {
      toast({
        title: "Validation Error",
        description: "Job description must be at least 50 characters long",
        variant: "destructive",
      });
      return false;
    }

    if (formData.required_skills.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one required skill",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Submit job posting to backend
  const submitJobPosting = async (jobData: JobPosting, token: string,userId:number): Promise<object> => {
  
  const list = formData.required_skills.map(s => ({ name: s }));

    const response = await axios.post<JobPostingResponse>(
      `${baseURL}jobs/jobs/`,
      {...jobData ,required_skills: list, client:userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get token from your auth context/storage
      const token = localStorage.getItem("token") || "";
      const user = JSON.parse(localStorage.getItem("user") || "");
      
      const response = await submitJobPosting(formData, token,user.id);

      if (response) {
        toast({
          title: "Success!",
          description:"Job posting created successfully",
        });
        navigate("/job-browse")
        // Reset form or redirect
        // resetForm();
      } else {
        toast({
          title: "Error",
          description:  "Failed to create job posting",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting job posting:", error);
      toast({
        title: "Error",
        description: axios.isAxiosError(error) 
          ? error.response?.data?.detail || error.message 
          : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save as draft
  const handleSaveAsDraft = async () => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token") || "";
      
      const response = await axios.post<JobPostingResponse>(
        `${baseURL}/saveDraft`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.is_success) {
        toast({
          title: "Draft Saved",
          description: response.data.detail || "Job draft saved successfully",
        });
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestedSkills = ["TypeScript", "AWS", "PostgreSQL", "Docker", "REST APIs"];

  return (
    <Card className="p-8 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Job Title *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="e.g., Senior Full-Stack Developer"
            className="bg-background/50 backdrop-blur-sm"
            required
          />
        </div>

        {/* Category & Job Type */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
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
            <Select value={formData.job_type} onValueChange={(value) => handleInputChange("job_type", value)}>
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
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="e.g., Remote or San Francisco, CA"
              className="bg-background/50 backdrop-blur-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Budget *
            </Label>
            <Input
              id="budget"
              value={formData.budget.toString()}
              onChange={(e) => handleInputChange("budget", parseInt(e.target.value) || 0)}
              placeholder="e.g., $80-120/hr"
              className="bg-background/50 backdrop-blur-sm"
              required
            />
          </div>
        </div>

        {/* Experience & Duration */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="experience">Experience Level *</Label>
            <Select value={formData.experience_level} onValueChange={(value) => handleInputChange("experience_level", value)}>
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
              value={formData.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
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
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe the role, responsibilities, and requirements..."
            className="min-h-[200px] bg-background/50 backdrop-blur-sm"
            required
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
            {formData.required_skills.map((skill) => (
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
                    if (!formData.required_skills.includes(skill)) {
                      setFormData(prev => ({
                        ...prev,
                        required_skills: [...prev.required_skills, skill]
                      }));
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
            value={formData.screening_questions}
            onChange={(e) => handleInputChange("screening_questions", e.target.value)}
            placeholder="Add custom questions for applicants..."
            className="min-h-[100px] bg-background/50 backdrop-blur-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button 
            type="submit" 
            variant="hero" 
            className="flex-1 gap-2"
            disabled={isSubmitting}
          >
            <Briefcase className="w-5 h-5" />
            {isSubmitting ? "Posting..." : "Post Job"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1"
            onClick={handleSaveAsDraft}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save as Draft"}
          </Button>
        </div>
      </form>
    </Card>
  );
};