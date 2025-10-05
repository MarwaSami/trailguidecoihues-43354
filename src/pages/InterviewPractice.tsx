import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MessageSquare,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Play,
  RotateCcw,
  Award,
  Target,
  TrendingUp,
  Clock,
  Brain,
  CheckCircle,
  XCircle,
  Sparkles
} from "lucide-react";

const InterviewPractice = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  const practiceCategories = [
    {
      title: "Technical Interview",
      description: "Practice coding problems and technical questions",
      icon: Brain,
      difficulty: "Hard",
      duration: "45 min",
      questions: 12
    },
    {
      title: "Behavioral Interview",
      description: "Common behavioral and situational questions",
      icon: MessageSquare,
      difficulty: "Medium",
      duration: "30 min",
      questions: 8
    },
    {
      title: "System Design",
      description: "Architecture and system design scenarios",
      icon: Target,
      difficulty: "Hard",
      duration: "60 min",
      questions: 5
    },
  ];

  const recentSessions = [
    {
      date: "2 days ago",
      type: "Technical",
      score: 85,
      duration: "42 min",
      feedback: "Great problem-solving approach"
    },
    {
      date: "1 week ago",
      type: "Behavioral",
      score: 92,
      duration: "28 min",
      feedback: "Excellent communication skills"
    },
  ];

  const aiTips = [
    "Maintain eye contact with the camera",
    "Speak clearly and at a moderate pace",
    "Structure your answers using STAR method",
    "Take a moment to think before answering",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/20 backdrop-blur-md border border-border/30 shadow-[var(--shadow-glass)] mb-4">
            <Sparkles className="w-4 h-4 text-primary animate-glow" />
            <span className="text-sm font-medium">AI-Powered Practice</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Interview Practice</h1>
          <p className="text-lg text-muted-foreground">
            Practice with AI, get instant feedback, and improve your interview skills
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Practice Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Practice Card */}
            <Card className="p-8 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
              <div className="space-y-6">
                {/* Video Preview */}
                <div className="relative aspect-video bg-muted/20 rounded-xl overflow-hidden border-2 border-border/50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {!isRecording ? (
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                          <Video className="w-10 h-10 text-primary-foreground" />
                        </div>
                        <p className="text-muted-foreground">Start a practice session</p>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-full bg-destructive flex items-center justify-center shadow-lg animate-pulse">
                          <Mic className="w-10 h-10 text-destructive-foreground" />
                        </div>
                        <p className="font-bold">Recording in progress...</p>
                        <p className="text-sm text-muted-foreground">Question 1 of 10</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant={isMicOn ? "destructive" : "secondary"}
                    size="icon"
                    className="w-12 h-12 rounded-full"
                    onClick={() => setIsMicOn(!isMicOn)}
                  >
                    {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </Button>
                  
                  <Button
                    variant={isRecording ? "destructive" : "hero"}
                    size="lg"
                    className="w-20 h-20 rounded-full gap-2"
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    {isRecording ? (
                      <RotateCcw className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8" />
                    )}
                  </Button>
                  
                  <Button
                    variant={isVideoOn ? "destructive" : "secondary"}
                    size="icon"
                    className="w-12 h-12 rounded-full"
                    onClick={() => setIsVideoOn(!isVideoOn)}
                  >
                    {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </Button>
                </div>

                {/* Current Question */}
                {isRecording && (
                  <Card className="p-6 bg-background/60 backdrop-blur-md border border-border/50">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <MessageSquare className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-2">Current Question</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Tell me about a challenging project you worked on and how you overcame the obstacles.
                        </p>
                        <Progress value={30} className="mt-4 h-2" />
                        <p className="text-xs text-muted-foreground mt-2">Time remaining: 2:30</p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </Card>

            {/* Practice Categories */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Practice Sessions</h2>
              {practiceCategories.map((category, idx) => (
                <Card key={idx} className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-primary/30 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-400 cursor-pointer">
                  <div className="flex items-center gap-6">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                      <category.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{category.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <Badge variant="secondary">{category.difficulty}</Badge>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {category.duration}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MessageSquare className="w-4 h-4" />
                          {category.questions} questions
                        </div>
                      </div>
                    </div>
                    <Button variant="hero">
                      Start Practice
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Tips */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2 border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold">AI Interview Tips</h3>
              </div>
              <ul className="space-y-3">
                {aiTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Recent Sessions */}
            <Card className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
              <h3 className="font-bold mb-4">Recent Sessions</h3>
              <div className="space-y-4">
                {recentSessions.map((session, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-background/30 backdrop-blur-sm border border-border/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{session.type}</span>
                      <div className="text-right">
                        <div className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          {session.score}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Clock className="w-3 h-3" />
                      {session.duration} • {session.date}
                    </div>
                    <p className="text-xs text-muted-foreground italic">{session.feedback}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Sessions
              </Button>
            </Card>

            {/* Stats */}
            <Card className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
              <h3 className="font-bold mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Average Score</span>
                    <span className="font-bold text-primary">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Sessions Completed</span>
                    <span className="font-bold">24</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Time Practiced</span>
                    <span className="font-bold">18 hours</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewPractice;
