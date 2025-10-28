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

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  match: number;
  posted: string;
  description: string;
  tags: string[];
  applicants: number;
}

const JobProposal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const job = location.state?.job as Job;

  const [formData, setFormData] = useState({
    coverLetter: "",
    proposedRate: "",
    timeline: "",
    experience: "",
    portfolioLinks: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    // Validation
    if (!formData.coverLetter || !formData.proposedRate || !formData.timeline) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Proposal Submitted!",
        description: "Your application has been sent to the client.",
      });

      // Navigate back after success
      setTimeout(() => {
        navigate("/job-browse");
      }, 2000);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
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
  };

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
                    {job.match}% Match
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
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="font-bold text-primary">{job.salary}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{job.posted}</span>
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
                  {job.tags.map((tag, idx) => (
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
                  <label htmlFor="coverLetter" className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4" />
                    Cover Letter *
                  </label>
                  <Textarea
                    id="coverLetter"
                    name="coverLetter"
                    placeholder="Introduce yourself and explain why you're the perfect fit for this role..."
                    value={formData.coverLetter}
                    onChange={handleChange}
                    className="min-h-[200px] bg-background/50"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Tip: Highlight your relevant experience and how you can add value
                  </p>
                </div>

                {/* Proposed Rate */}
                <div>
                  <label htmlFor="proposedRate" className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4" />
                    Your Proposed Rate (per hour) *
                  </label>
                  <Input
                    id="proposedRate"
                    name="proposedRate"
                    type="number"
                    placeholder="e.g., 85"
                    value={formData.proposedRate}
                    onChange={handleChange}
                    className="bg-background/50"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Client's budget: {job.salary}
                  </p>
                </div>

                {/* Timeline */}
                <div>
                  <label htmlFor="timeline" className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" />
                    Project Timeline *
                  </label>
                  <Input
                    id="timeline"
                    name="timeline"
                    placeholder="e.g., I can start immediately and deliver within 4 weeks"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="bg-background/50"
                    required
                  />
                </div>

                {/* Relevant Experience */}
                <div>
                  <label htmlFor="experience" className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4" />
                    Relevant Experience
                  </label>
                  <Textarea
                    id="experience"
                    name="experience"
                    placeholder="Share specific projects or experience related to this job..."
                    value={formData.experience}
                    onChange={handleChange}
                    className="min-h-[120px] bg-background/50"
                  />
                </div>

                {/* Portfolio Links */}
                <div>
                  <label htmlFor="portfolioLinks" className="flex items-center gap-2 mb-2">
                    <LinkIcon className="w-4 h-4" />
                    Portfolio / Work Samples
                  </label>
                  <Textarea
                    id="portfolioLinks"
                    name="portfolioLinks"
                    placeholder="Add links to your portfolio, GitHub, or relevant work samples (one per line)"
                    value={formData.portfolioLinks}
                    onChange={handleChange}
                    className="min-h-[100px] bg-background/50"
                  />
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