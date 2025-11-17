import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Send,
  ArrowLeft,
  FileText,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";
import axios from "axios";
import { baseURL, useAuth } from "@/context/AuthContext";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  job_type: string;
  budget: string;
  match_score: number;
  created_at: string;
  description: string;
  skills: string[];
  applicants: number;
}

const JobProposal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {user}=useAuth();
  const job = location.state?.job as Job;

  const [formData, setFormData] = useState({
    cover_letter: "",
    proposed_budget: "",
    availability: "",
    status: "pending",
    job: 0,
    freelancer: 0,
    ai_suggestion_score: 0,
    ai_feedback: "",
    // experience: "",
    // portfolioLinks: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
            <p className="text-muted-foreground mb-6">
              Please select a job from the browse page to apply.
            </p>
            <Button onClick={() => navigate("/job-browse")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Job Browse
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation utility function for better maintainability
    const validateProposalForm = (data: typeof formData) => {
      const errors: string[] = [];

      // Required fields with trimming for whitespace handling
      if (!data.cover_letter?.trim()) {
        errors.push("Cover letter is required.");
      }

      const proposedBudget = parseFloat(data.proposed_budget);
      if (!data.proposed_budget?.trim() || isNaN(proposedBudget) || proposedBudget <= 0) {
        errors.push("Please provide a valid positive proposed rate.");
      }

      if (!data.availability?.trim()) {
        errors.push("Project timeline is required.");
      }

      return errors;
    };

    const validationErrors = validateProposalForm(formData);
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors.join(" "),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({}); // Clear previous errors

    try {
      // Simulate API call
      await axios.post(
        `${baseURL}jobs/proposals/`,
        {
          cover_letter: formData.cover_letter,
          proposed_budget: formData.proposed_budget,
          availability: formData.availability,
          status: formData.status,
          job: job.id,
          freelancer: JSON.parse(localStorage.getItem("user") || "{}").id,
          ai_suggestion_score: formData.ai_suggestion_score,
          ai_feedback: formData.ai_feedback,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

      toast({
        title: "Proposal Submitted!",
        description: "Your application has been sent to the client.",
      });

      // Navigate to My Proposals after success
      setTimeout(() => {
        navigate("/my-proposals");
      }, 2000);
    } catch (error: any) {
      let errorTitle = "Submission Failed";
      let errorMessage = "An unexpected error occurred.";

      if (error.response) {
        if (error.response.status === 400) {
          // Handle validation errors
          const data = error.response.data;
          if (typeof data === 'object' && data !== null) {
            const fieldErrors: Record<string, string> = {};
            let hasNonFieldErrors = false;

            for (const [field, messages] of Object.entries(data)) {
              if (field === 'non_field_errors') {
                // Handle non-field errors (like unique constraints)
                if (Array.isArray(messages)) {
                  const errorMsg = messages.join(', ');
                  if (errorMsg.includes('must make a unique set')) {
                    errorMessage = "You have already submitted a proposal for this job.";
                  } else {
                    errorMessage = errorMsg;
                  }
                } else if (typeof messages === 'string') {
                  errorMessage = messages;
                }
                hasNonFieldErrors = true;
              } else if (Array.isArray(messages)) {
                fieldErrors[field] = messages.join(', ');
              } else if (typeof messages === 'string') {
                fieldErrors[field] = messages;
              }
            }

            setFieldErrors(fieldErrors);

            if (hasNonFieldErrors) {
              // Show toast for non-field errors
              toast({
                title: "Already Submitted",
                description: errorMessage,
                variant: "default",
              });
              return;
            } else if (Object.keys(fieldErrors).length > 0) {
              // Don't show toast for field errors, just set them
              return;
            } else {
              errorMessage = data?.message || data?.detail || "Invalid request data.";
            }
          } else {
            errorMessage = data?.message || data?.detail || "Invalid request data.";
          }
        } else {
          // Other backend errors
          errorMessage = error.response.data?.message || error.response.data?.detail || `Error ${error.response.status}: ${error.response.statusText}`;
        }
      } else if (error.request) {
        // Network error
        errorMessage = "Network error. Please check your connection.";
      } else {
        // Other error
        errorMessage = error.message || errorMessage;
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  console.log("JobProposal Rendered with job:", job);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/job-browse")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Browse
        </Button>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-3">Submit Your Proposal</h1>
          <p className="text-lg text-muted-foreground">
            Showcase your skills and why you're the perfect fit for this role
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Job Details - Left Side */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)] sticky top-24">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-2xl font-bold">{job.title}</h2>
                  <div className="px-2 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold">
                    {(job.match_score * 100).toFixed(0)}% Match
                  </div>
                </div>
                <p className="text-lg text-muted-foreground mb-4">{job.company}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span>{job.job_type}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="font-bold text-primary">{job.budget}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{job.created_at.split("T")[0]}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-4">
                <h3 className="font-bold mb-2">Job Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-bold mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {(job.skills || []).map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-4 text-center text-sm text-muted-foreground">
                {job.applicants} applicants so far
              </div>
            </Card>
          </div>

          {/* Proposal Form - Right Side */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cover Letter */}
                <div>
                  <label htmlFor="cover_letter" className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4" />
                    Cover Letter *
                  </label>
                  <Textarea
                    id="cover_letter"
                    name="cover_letter"
                    placeholder="Introduce yourself and explain why you're the perfect fit for this role..."
                    value={formData.cover_letter}
                    onChange={handleChange}
                    className="min-h-[200px] bg-background/50"
                    required
                  />
                  {fieldErrors.cover_letter && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.cover_letter}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Tip: Highlight your relevant experience and how you can add value
                  </p>
                </div>

                {/* Proposed Rate */}
                <div>
                  <label htmlFor="proposed_budget" className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4" />
                    Your Proposed Rate (per hour) *
                  </label>
                  <Input
                    id="proposed_budget"
                    name="proposed_budget"
                    type="number"
                    placeholder="e.g., 85"
                    value={formData.proposed_budget}
                    onChange={handleChange}
                    className="bg-background/50"
                    required
                  />
                  {fieldErrors.proposed_budget && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.proposed_budget}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Client's budget: {job.budget}
                  </p>
                </div>
                <div style={{ display: "none" }}>
                  <input type="text"  name="freelancer" value={user.id} />
                  <input type="text"  name="job" value={job.id} />
                  <input type="text" name="status" value="pending" />
                </div>
                {/* Timeline */}
                <div>
                  <label htmlFor="availability" className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    Project Timeline *
                  </label>
                  <Input
                    id="availability"
                    name="availability"
                    placeholder="e.g., I can start immediately and deliver within 4 weeks"
                    value={formData.availability}
                    onChange={handleChange}
                    className="bg-background/50"
                    required
                  />
                  {fieldErrors.availability && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.availability}</p>
                  )}
                </div>


                {/* Submit Button */}
                <div className="pt-4 border-t border-border">
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full gap-2"
                    disabled={isSubmitting}
                  >
                    <Send className="w-5 h-5" />
                    {isSubmitting ? "Submitting..." : "Submit Proposal"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    By submitting, you agree to our terms and conditions
                  </p>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobProposal;
