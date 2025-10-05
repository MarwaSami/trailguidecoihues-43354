import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Code,
  MessageSquare,
  CheckCircle,
  Clock,
  Award,
  Target,
  TrendingUp,
  Zap,
  FileText,
  Languages,
  Radio
} from "lucide-react";

const SkillEvaluation = () => {
  const [activeTest, setActiveTest] = useState<string | null>(null);

  const testCategories = [
    {
      id: "technical",
      title: "Technical Skills",
      description: "Code-based challenges and problem-solving",
      icon: Code,
      duration: "60 min",
      questions: 20,
      difficulty: "Intermediate",
      badge: "Most Popular"
    },
    {
      id: "language",
      title: "Language Proficiency",
      description: "English and Arabic language assessment",
      icon: Languages,
      duration: "30 min",
      questions: 40,
      difficulty: "All Levels",
      badge: "AI Evaluated"
    },
    {
      id: "communication",
      title: "Communication Skills",
      description: "Written and verbal communication assessment",
      icon: MessageSquare,
      duration: "45 min",
      questions: 15,
      difficulty: "All Levels",
      badge: "New"
    },
    {
      id: "problem-solving",
      title: "Problem Solving",
      description: "Logic and analytical thinking challenges",
      icon: Brain,
      duration: "45 min",
      questions: 25,
      difficulty: "Hard",
      badge: null
    },
  ];

  const completedTests = [
    {
      name: "React.js Advanced",
      date: "2 days ago",
      score: 92,
      percentile: 85,
      badge: "Expert",
      icon: Code
    },
    {
      name: "English Proficiency",
      date: "1 week ago",
      score: 88,
      percentile: 78,
      badge: "Proficient",
      icon: Languages
    },
    {
      name: "System Design",
      date: "2 weeks ago",
      score: 85,
      percentile: 72,
      badge: "Advanced",
      icon: Brain
    },
  ];

  const recommendedTests = [
    "TypeScript Fundamentals",
    "Node.js Backend Development",
    "AWS Cloud Practitioner",
    "SQL Database Design"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-3">Skill Evaluation Center</h1>
          <p className="text-lg text-muted-foreground">
            Showcase your expertise with AI-powered skill assessments
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Test Categories */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Available Assessments</h2>
              {testCategories.map((test) => (
                <Card key={test.id} className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-primary/30 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-400">
                  <div className="flex items-center gap-6">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg flex-shrink-0">
                      <test.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{test.title}</h3>
                        {test.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {test.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{test.description}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {test.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {test.questions} questions
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {test.difficulty}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="hero" className="whitespace-nowrap">
                        Start Test
                      </Button>
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Completed Tests */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Completed Assessments</h2>
              {completedTests.map((test, idx) => (
                <Card key={idx} className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
                  <div className="flex items-center gap-6">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-accent">
                      <test.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold">{test.name}</h3>
                        <Badge variant="default">{test.badge}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{test.date}</span>
                        <span>Top {test.percentile}% of test-takers</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {test.score}%
                      </div>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm">
                        View Report
                      </Button>
                      <Button variant="ghost" size="sm">
                        Retake
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* How It Works */}
            <Card className="p-8 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
              <h3 className="text-xl font-bold mb-6">How Skill Evaluation Works</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-primary-foreground">1</span>
                  </div>
                  <h4 className="font-bold">Choose Assessment</h4>
                  <p className="text-sm text-muted-foreground">
                    Select from technical, language, or soft skill tests
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-primary-foreground">2</span>
                  </div>
                  <h4 className="font-bold">Take the Test</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete AI-generated questions at your own pace
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-primary-foreground">3</span>
                  </div>
                  <h4 className="font-bold">Get Certified</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive badges and certificates for your profile
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Overall Stats */}
            <Card className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Your Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Tests Completed</span>
                    <span className="font-bold">12/20</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Average Score</span>
                    <span className="font-bold text-primary">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Badges Earned</span>
                    <span className="font-bold">8</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                        <Award className="w-4 h-4 text-primary-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Recommended Tests */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2 border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold">Recommended for You</h3>
              </div>
              <div className="space-y-2">
                {recommendedTests.map((test, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-background/50 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{test}</span>
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Benefits */}
            <Card className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
              <h3 className="font-bold mb-4">Why Take Tests?</h3>
              <ul className="space-y-3">
                {[
                  "Boost your profile visibility by 60%",
                  "Stand out to potential clients",
                  "Earn verifiable skill badges",
                  "Get AI-powered improvement tips"
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SkillEvaluation;
