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
} from "lucide-react";

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
        setChatMessages(response.data.data.history);

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

  const handleSubmit = async () => {
    if (!formData.jobTitle || !formData.budget || formData.required_skills.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please complete the conversation to fill all required fields",
        variant: "destructive",
      });
      return;
    }

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
          interview_availability: formData.interview_availability,
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
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 animate-scale-in">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{formData.jobTitle}</h3>
              {formData.category && (
                <p className="text-sm text-muted-foreground capitalize">{formData.category}</p>
              )}
            </div>
          </div>
          {formData.budget > 0 && (
            <div className="text-right">
              <div className="flex items-center gap-1 text-primary font-semibold">
                <DollarSign className="w-4 h-4" />
                {formData.budget}
              </div>
              <p className="text-xs text-muted-foreground">Budget</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {formData.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{formData.location}</span>
            </div>
          )}
          {formData.jobType && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="capitalize">{formData.jobType}</span>
            </div>
          )}
          {formData.required_skills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.required_skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Chat Container */}
      <Card className="bg-background/40 backdrop-blur-xl border border-border/50 overflow-hidden">
        <div className="h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold">AI Job Assistant</h3>
                <p className="text-xs text-muted-foreground">Powered by advanced AI</p>
              </div>
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
      </Card>

      {/* Job Preview */}
      {formData.jobTitle && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Job Preview
            </h3>
          </div>
          <JobPreviewCard />
          <Button
            onClick={handleSubmit}
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
      )}
    </div>
  );
};
