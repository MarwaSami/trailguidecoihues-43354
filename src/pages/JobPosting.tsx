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
        <div className="max-w-5xl mx-auto">
          {selectedMethod === "select" ? (
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Post a New Job
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Choose your preferred method to create a job posting
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Card
                  className="relative p-8 bg-background/40 backdrop-blur-xl border-2 border-border/50 hover:border-secondary/50 cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-elegant)] group overflow-hidden"
                  onClick={() => setSelectedMethod("regular")}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative space-y-5">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 w-fit group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Traditional Form</h3>
                      <p className="text-muted-foreground text-sm">
                        Complete control with a structured form
                      </p>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        <span>Full manual control</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        <span>Quick and straightforward</span>
                      </li>
                    </ul>
                  </div>
                </Card>

                <Card
                  className="relative p-8 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent backdrop-blur-xl border-2 border-primary/40 hover:border-primary/70 cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-glow)] group overflow-hidden"
                  onClick={() => setSelectedMethod("ai")}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="absolute top-3 right-3">
                    <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-xs font-bold text-primary animate-pulse">
                      ✨ AI POWERED
                    </div>
                  </div>
                  <div className="relative space-y-5">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg w-fit group-hover:scale-110 transition-transform duration-300">
                      <Brain className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">AI Assistant</h3>
                      <p className="text-muted-foreground text-sm">
                        Conversational job creation with AI guidance
                      </p>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>Natural conversation flow</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>Smart suggestions & optimization</span>
                      </li>
                    </ul>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedMethod("select")}
                className="gap-2 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Options
              </Button>
              
              {selectedMethod === "regular" && <RegularJobForm />}
              {selectedMethod === "ai" && <AIJobAssistant />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JobPosting;
