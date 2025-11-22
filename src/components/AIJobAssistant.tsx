import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { baseURL } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  MicOff,
  Send,
  Briefcase,
  DollarSign,
  MapPin,
  Clock,
  Bot,
  CheckCircle2,
  Sparkles,
  Loader2,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export interface JobPosting {
  category: string;
  duration: string;
  required_skills: string[];
  jobTitle: string;
  description: string;
  budget: number;
  location: string;
  jobType: string;
  experienceLevel: string;
  status: string;
  requiredSkills: string;
  qualifications: string;
  interview_availability: boolean;
}

interface ChatMessage {
  role: "user" | "assistant";
  message: string;
  jobData?: Partial<JobPosting>;
}

interface AIAssistResponse {
  data: {
    history: ChatMessage[];
    job: JobPosting;
  };
  issuccess: boolean;
  errors: string[];
}

export const AIJobAssistant = () => {
  const [formData, setFormData] = useState<JobPosting>({
    jobTitle: "",
    category: "",
    jobType: "",
    location: "",
    budget: 0,
    experienceLevel: "",
    duration: "",
    description: "",
    required_skills: [],
    status: "",
    requiredSkills: "",
    qualifications: "",
    interview_availability: false,
  });

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      message: "Hi! I'm here to help you create the perfect job posting. Let's start with the basics - what position are you hiring for?",
    },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        sendChatMessage("", audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak about your job requirements",
        variant: "secondary",
      });
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice input",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendChatMessage = async (message?: string, audioBlob?: Blob) => {
    const isText = message && message.trim().length > 0;
    if (!isText && !audioBlob) return;

    const userMessage: ChatMessage = {
      role: "user",
      message: message || "",
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsSendingMessage(true);

    const formDataToSend = new FormData();
    formDataToSend.append("promptText", message?.trim() || "");
    formDataToSend.append("promptType", isText ? "1" : "2");
    if (!isText && audioBlob) {
      formDataToSend.append("promptAudio", audioBlob, "recording.webm");
    }

    formDataToSend.append("isDone", "false");
    chatMessages.forEach((m, index) => {
      formDataToSend.append(`history[${index}][role]`, m.role);
      formDataToSend.append(`history[${index}][message]`, m.message);
    });

    try {
      const response = await axios.post<AIAssistResponse>(
        `https://localhost:7153/Job/POST`,
        formDataToSend
      );

      if (!response.data.issuccess) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } else {
        // Filter messages to only show clean text responses (no JSON)
        const cleanMessages = response.data.data.history.map((msg: ChatMessage) => ({
          ...msg,
          message: msg.role === "assistant" ? msg.message.replace(/\{[\s\S]*?\}/g, "").trim() : msg.message
        }));
        setChatMessages(cleanMessages);

        if (response.data.data.job?.jobTitle) {
          response.data.data.job.required_skills =
            response.data.data.job.requiredSkills?.split(", ") || [];
          setFormData((prev) => ({ ...prev, ...response.data.data.job }));
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your message",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleSubmitClick = () => {
    if (!formData.jobTitle || !formData.budget || formData.required_skills.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please complete the conversation to fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setShowInterviewDialog(true);
  };

  const handleSubmit = async (interviewAvailability: boolean) => {
    setShowInterviewDialog(false);
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token") || "";
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const list = formData.required_skills.map((s) => ({ name: s }));

      const response = await axios.post(
        `${baseURL}jobs/jobs/`,
        {
          ...formData,
          required_skills: list,
          client: user.id,
          status: "published",
          experience_level: formData.experienceLevel,
          job_type: formData.jobType,
          title: formData.jobTitle,
          interview_availability: interviewAvailability,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        toast({
          title: "Success!",
          description: "Job posting created successfully",
          variant: "secondary",
        });
        navigate("/my-jobs");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job posting",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const JobPreviewCard = () => {
    if (!formData.jobTitle) return null;

    return (
      <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 animate-scale-in">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 rounded-lg bg-primary/10">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base">{formData.jobTitle}</h3>
              <div className="flex items-center gap-3 mt-1">
                {formData.budget > 0 && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {formData.budget}
                  </span>
                )}
                {formData.location && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {formData.location}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetailsDialog(true)}
            className="gap-2 shrink-0"
          >
            <FileText className="w-4 h-4" />
            View Details
          </Button>
        </div>
      </Card>
    );
  };

  const JobDetailsDialog = () => (
    <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Job Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Title</label>
            <p className="text-base font-semibold">{formData.jobTitle}</p>
          </div>

          {formData.category && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Category</label>
              <p className="text-base capitalize">{formData.category}</p>
            </div>
          )}

          {formData.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-base">{formData.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {formData.jobType && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Job Type</label>
                <p className="text-base capitalize">{formData.jobType}</p>
              </div>
            )}
            {formData.location && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <p className="text-base">{formData.location}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {formData.budget > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Budget</label>
                <p className="text-base font-semibold">${formData.budget}</p>
              </div>
            )}
            {formData.duration && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Duration</label>
                <p className="text-base">{formData.duration}</p>
              </div>
            )}
          </div>

          {formData.experienceLevel && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Experience Level</label>
              <p className="text-base capitalize">{formData.experienceLevel}</p>
            </div>
          )}

          {formData.required_skills.length > 0 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Required Skills</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.required_skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {formData.qualifications && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Qualifications</label>
              <p className="text-base">{formData.qualifications}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  const InterviewAvailabilityDialog = () => (
    <Dialog open={showInterviewDialog} onOpenChange={setShowInterviewDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enable Interview Availability?</DialogTitle>
          <DialogDescription>
            Would you like to enable interview availability for this job posting? Candidates will be able to request interviews if enabled.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
          >
            No, Skip Interview
          </Button>
          <Button
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Yes, Enable Interview"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {showForm ? (
        // Form View
        <Card className="bg-background/40 backdrop-blur-xl border border-border/50 overflow-hidden animate-fade-in">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Job Details</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowForm(false)}
                className="gap-2"
              >
                <Bot className="w-4 h-4" />
                Back to Chat
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Job Title</label>
                <Input
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  placeholder="e.g. Senior React Developer"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Software Development"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Job Type</label>
                  <Input
                    value={formData.jobType}
                    onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                    placeholder="e.g. Full-time"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Remote"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Budget ($)</label>
                  <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                    placeholder="e.g. 5000"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Duration</label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 3 months"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Experience Level</label>
                <Input
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  placeholder="e.g. Senior"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <textarea
                  className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the job requirements..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Required Skills (comma-separated)</label>
                <Input
                  value={formData.required_skills.join(", ")}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    required_skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="e.g. React, TypeScript, Node.js"
                />
              </div>

              <Button
                onClick={handleSubmitClick}
                disabled={isSubmitting}
                className="w-full gap-2"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Job Post...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Post Job
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        // Chat View
        <Card className="bg-background/40 backdrop-blur-xl border border-border/50 overflow-hidden">
          <div className="h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold">AI Job Assistant</h3>
                    <p className="text-xs text-muted-foreground">Powered by advanced AI</p>
                  </div>
                </div>
                {formData.jobTitle && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowForm(true)}
                    className="gap-2"
                  >
                    <Briefcase className="w-4 h-4" />
                    Edit Form
                  </Button>
                )}
              </div>
            </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 animate-fade-in ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`p-2 rounded-full h-fit ${
                    msg.role === "assistant"
                      ? "bg-gradient-to-br from-primary/20 to-accent/20"
                      : "bg-secondary/20"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === "assistant"
                      ? "bg-muted/50"
                      : "bg-primary/10 border border-primary/20"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                </div>
              </div>
            ))}

            {isSendingMessage && (
              <div className="flex gap-3 animate-fade-in">
                <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 h-fit">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-muted/50 p-4 rounded-2xl">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border/50 bg-muted/20">
            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendChatMessage(chatInput)
                }
                placeholder={isRecording ? "Recording..." : "Describe your job requirements..."}
                className="bg-background/50"
                disabled={isRecording || isSendingMessage}
              />
              {isRecording ? (
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                  size="icon"
                  className="shrink-0"
                >
                  <MicOff className="w-4 h-4" />
                </Button>
              ) : (
                <>
                  <Button
                    onClick={startRecording}
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    disabled={isSendingMessage}
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => sendChatMessage(chatInput)}
                    size="icon"
                    className="shrink-0"
                    disabled={!chatInput.trim() || isSendingMessage}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Job Preview in Chat View */}
        {formData.jobTitle && (
          <div className="p-4 border-t border-border/50 bg-muted/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Job Preview
              </h3>
            </div>
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <JobPreviewCard />
              </div>
              <Button
                onClick={handleSubmitClick}
                disabled={isSubmitting || !formData.jobTitle || !formData.budget || formData.required_skills.length === 0}
                className="gap-2 shrink-0"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Submit Job
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>
      )}
      
      <JobDetailsDialog />
      <InterviewAvailabilityDialog />
    </div>
  );
};
