import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, FileText, ArrowLeft, Zap, Brain } from "lucide-react";
import { RegularJobForm } from "@/components/RegularJobForm";
import { AIJobAssistant } from "@/components/AIJobAssistant";

const JobPosting = () => {
  const [selectedMethod, setSelectedMethod] = useState<"select" | "regular" | "ai">("select");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            {selectedMethod !== "select" && (
              <Button
                variant="ghost"
                onClick={() => setSelectedMethod("select")}
                className="mb-4 gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Options
              </Button>
            )}
            <h1 className="text-4xl font-bold mb-3">Post a New Job</h1>
            <p className="text-muted-foreground">
              {selectedMethod === "select"
                ? "Choose how you'd like to create your job posting"
                : selectedMethod === "regular"
                ? "Fill in the details to create your job posting"
                : "Let AI help you create the perfect job posting"}
            </p>
          </div>

          {/* Method Selection */}
          {selectedMethod === "select" && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Regular Job Posting */}
              <Card
                className="relative p-8 bg-background/40 backdrop-blur-xl border-2 border-border/50 hover:border-primary/50 cursor-pointer transition-all hover:shadow-[var(--shadow-elegant)] group overflow-hidden"
                onClick={() => setSelectedMethod("regular")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 w-fit">
                    <FileText className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold">Regular Job Offer</h3>
                  <p className="text-muted-foreground">
                    Create a job posting manually with full control over every detail. Perfect for when you know exactly what you need.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Complete form with all job details</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Manual skill selection and requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Full customization options</span>
                    </li>
                  </ul>
                  <Button variant="secondary" className="w-full mt-4 group-hover:bg-secondary/80">
                    Get Started
                  </Button>
                </div>
              </Card>

              {/* AI Job Assistant */}
              <Card
                className="relative p-8 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent backdrop-blur-xl border-2 border-primary/30 hover:border-primary/60 cursor-pointer transition-all hover:shadow-[var(--shadow-glow)] group overflow-hidden"
                onClick={() => setSelectedMethod("ai")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-xs font-bold text-primary">
                    AI POWERED
                  </div>
                </div>
                <div className="relative space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg w-fit">
                    <Brain className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold">AI Job Assistant</h3>
                  <p className="text-muted-foreground">
                    Describe your needs using text or voice, and let AI generate a professional job posting for you.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Text or voice input options</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>AI-generated professional content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>Smart skill suggestions and optimization</span>
                    </li>
                  </ul>
                  <Button variant="hero" className="w-full mt-4 gap-2">
                    <Sparkles className="w-4 h-4" />
                    Try AI Assistant
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Regular Form */}
          {selectedMethod === "regular" && <RegularJobForm />}

          {/* AI Assistant */}
          {selectedMethod === "ai" && <AIJobAssistant />}
        </div>
      </main>
    </div>
  );
};

export default JobPosting;
