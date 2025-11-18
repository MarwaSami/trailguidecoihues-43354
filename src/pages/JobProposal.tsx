import { useState, useEffect } from "react";
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
  User,
  Mail,
  Github,
  Linkedin,
  Globe,
  Award,
  Loader2,
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

interface FreelancerProfile {
  id: number;
  user: number;
  bio: string;
  skills: string[];
  experience_years: number;
  hourly_rate: number;
  portfolio_website: string;
  linkedin_profile: string;
  github_profile: string;
  categories_of_expertise: string;
}

interface ExistingProposal {
  id: number;
  cover_letter: string;
  proposed_budget: string;
  duration_in_days: number;
  experience: string;
  status: string;
  job: number;
  freelancer: number;
}

const JobProposal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const job = location.state?.job as Job;

  const userData = user ? (typeof user === 'string' ? JSON.parse(user) : user) : null;

  const [formData, setFormData] = useState({
    cover_letter: "",
    proposed_budget: "",
    duration_in_days: "",
    experience: "",
    status: "pending",
    job: 0,
    freelancer: 0,
  });


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [proposalData, setProposalData] = useState<any>(null);
  const [proposalId, setProposalId] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Generate proposal on load
  useEffect(() => {
    const generateProposal = async () => {
      if (!job?.id || !userData?.id) return;

      setIsGeneratingProposal(true);

      try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
          `${baseURL}jobs/post-proposal/`,
          { job_id: job.id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProposalData(response.data.data);
        setProposalId(response.data.data.id);

        // Set form data from the generated proposal
        setFormData({
          cover_letter: response.data.data.cover_letter,
          proposed_budget: response.data.data.proposed_budget,
          duration_in_days: response.data.data.duration_in_days.toString(),
          experience: response.data.data.experience || "",
          status: response.data.data.status,
          job: job.id,
          freelancer: userData.id,
        });
      } catch (error) {
        console.error("Error generating proposal:", error);
        toast({
          title: "Error",
          description: "Failed to generate proposal",
          variant: "destructive",
        });
      } finally {
        setIsGeneratingProposal(false);
      }
    };

    generateProposal();
  }, [job?.id, userData?.id]);

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

  if (isGeneratingProposal) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="ml-4 text-lg">Generating your proposal...</p>
          </div>
        </main>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const validateProposalForm = (data: typeof formData) => {
      const errors: string[] = [];

      if (!data.cover_letter?.trim()) {
        errors.push("Cover letter is required.");
      }

      const proposedBudget = parseFloat(data.proposed_budget);
      if (!data.proposed_budget?.trim() || isNaN(proposedBudget) || proposedBudget <= 0) {
        errors.push("Please provide a valid positive proposed rate.");
      }

      const duration = parseInt(data.duration_in_days);
      if (!data.duration_in_days?.trim() || isNaN(duration) || duration <= 0) {
        errors.push("Please provide a valid project duration in days.");
      }

      if (!data.experience?.trim()) {
        errors.push("Experience summary is required.");
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

    try {
      const payload = {
        cover_letter: formData.cover_letter,
        proposed_budget: formData.proposed_budget,
        duration_in_days: parseInt(formData.duration_in_days),
        experience: formData.experience,
        status: "pending",
        job: job.id,
        freelancer: userData.id,
      };

      await axios.put(
        `${baseURL}jobs/proposals/${proposalId}/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast({
        title: "Proposal Submitted!",
        description: "Your proposal has been sent to the client.",
      });

      setTimeout(() => {
        navigate("/my-proposals");
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting proposal:", error);
      toast({
        title: "Submission Failed",
        description: error.response?.data?.detail || "An unexpected error occurred.",
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate("/job-browse")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Browse
        </Button>

        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-3">
            Review Your Generated Proposal
          </h1>
          <p className="text-lg text-muted-foreground">
            Review the AI-generated proposal below and submit when ready
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Freelancer CV Preview - Left Side */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)] sticky top-24">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Your Profile
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg">{userData?.username || "Freelancer"}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3" />
                    {userData?.email}
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <h3 className="font-bold mb-2">Job Details</h3>
                <h4 className="text-lg font-semibold mb-1">{job.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{job.company}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    {job.job_type}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="font-bold text-primary">{job.budget}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Proposal Form - Right Side */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="cover_letter" className="flex items-center gap-2 mb-2 font-medium">
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
                    <p className="text-xs text-destructive mt-1">{fieldErrors.cover_letter}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Tip: Highlight your relevant experience and how you can add value
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="proposed_budget" className="flex items-center gap-2 mb-2 font-medium">
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
                      <p className="text-xs text-destructive mt-1">{fieldErrors.proposed_budget}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Client's budget: {job.budget}
                    </p>
                  </div>

                  <div>
                    <label htmlFor="duration_in_days" className="flex items-center gap-2 mb-2 font-medium">
                      <Calendar className="w-4 h-4" />
                      Duration (in days) *
                    </label>
                    <Input
                      id="duration_in_days"
                      name="duration_in_days"
                      type="number"
                      placeholder="e.g., 30"
                      value={formData.duration_in_days}
                      onChange={handleChange}
                      className="bg-background/50"
                      required
                    />
                    {fieldErrors.duration_in_days && (
                      <p className="text-xs text-destructive mt-1">{fieldErrors.duration_in_days}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      How many days will this project take?
                    </p>
                  </div>
                </div>

                <div>
                  <label htmlFor="experience" className="flex items-center gap-2 mb-2 font-medium">
                    <Award className="w-4 h-4" />
                    Relevant Experience *
                  </label>
                  <Textarea
                    id="experience"
                    name="experience"
                    placeholder="Describe your relevant experience for this project..."
                    value={formData.experience}
                    onChange={handleChange}
                    className="min-h-[120px] bg-background/50"
                    required
                  />
                  {fieldErrors.experience && (
                    <p className="text-xs text-destructive mt-1">{fieldErrors.experience}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Share specific projects or achievements related to this job
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Proposal
                      </>
                    )}
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
