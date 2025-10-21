import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { label } from "@/components/ui/label";
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
  Mic,
  MicOff,
  Send,
  Plus,
  X,
  Briefcase,
  DollarSign,
  MapPin,
  Clock,
  Users,
  Bot,
  Brain,
  MessageSquare,
  Target,
  Zap,
  FileQuestion,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define API base URL - replace with your actual backend URL
const baseURL = "YOUR_BACKEND_URL";

// Get auth token from localStorage or your auth context
const getAuthToken = () => {
  return localStorage.getItem("authToken") || "";
};

// Define response interfaces
interface AudioToTextResponse {
  is_success: boolean;
  text: string;
  detail?: string;
}

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

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIAssistResponse {
  is_success: boolean;
  message: string;
  suggestions?: Partial<JobPosting>;
  detail?: string;
}

export const AIJobAssistant = () => {
  // Form state
  const [formData, setFormData] = useState<JobPosting>({
    title: "",
    category: "",
    job_type: "",
    location: "",
    budget: 0,
    experience_level: "",
    duration: "",
    description: "",
    required_skills: [],
    screening_questions: "",
    client: 0, // Will be populated from auth context
  });

  // Chat state
  const [inputMethod, setInputMethod] = useState<"text" | "voice">("text");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
        
        toast({
          title: "Recording stopped",
          description: "Converting speech to text...",
        });

        try {
          const transcribedText = await convertAudioToText(audioBlob);
          // Send transcribed text as chat message
          sendChatMessage(transcribedText);
          toast({
            title: "Success",
            description: "Voice input converted to text",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to process voice input",
            variant: "destructive",
          });
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak about your job requirements",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone",
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

  const convertAudioToText = async (audioBlob: Blob): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      
      const token = getAuthToken();
      
      const response = await axios.post<AudioToTextResponse>(
        `${baseURL}/speechToText`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.data.is_success) {
        throw new Error(response.data.detail || 'Failed to convert audio to text');
      }

      return response.data.text;
    } catch (error) {
      console.error('Speech-to-text error:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.detail || 'Failed to process voice input');
      }
      throw error;
    }
  };

  // Handle form input changes
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

    if (!formData.budget || formData.budget <= 0) {
      toast({
        title: "Validation Error",
        description: "Please provide a valid budget",
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

  // Send chat message to AI assistant
  const sendChatMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsSendingMessage(true);

    try {
      const token = getAuthToken();

      const response = await axios.post<AIAssistResponse>(
        `${baseURL}/aiJobAssist`,
        {
          message: message.trim(),
          current_form_data: formData,
          conversation_history: chatMessages.map(m => ({ role: m.role, content: m.content })),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.data.is_success) {
        throw new Error(response.data.detail || 'Failed to get AI response');
      }

      // Add assistant response to chat
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.data.message,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, assistantMessage]);

      // Apply AI suggestions to form if available
      if (response.data.suggestions) {
        setFormData(prev => ({ ...prev, ...response.data.suggestions }));
        toast({
          title: "Form Updated",
          description: "AI suggestions applied to the form",
        });
      }

      // Scroll to bottom
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: axios.isAxiosError(error)
          ? error.response?.data?.detail || "Failed to send message"
          : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Submit job posting
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getAuthToken();

      const response = await axios.post<JobPostingResponse>(
        `${baseURL}/postJob`,
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
          title: "Success!",
          description: response.data.detail || "Job posting created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.data.detail || "Failed to create job posting",
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

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      {/* LEFT SIDE - Job Posting Form */}
      <Card className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
        <div className="mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Job Details
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in the details or use the AI assistant to help you
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Job Title *
            </label>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="category">Category *</label>
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
              <label htmlFor="type">Job Type *</label>
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

          {/* Location & Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., Remote"
                className="bg-background/50 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="budget" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Budget *
              </label>
              <Input
                id="budget"
                type="number"
                value={formData.budget || ""}
                onChange={(e) => handleInputChange("budget", parseFloat(e.target.value) || 0)}
                placeholder="e.g., 5000"
                className="bg-background/50 backdrop-blur-sm"
                required
              />
            </div>
          </div>

          {/* Experience & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="experience">Experience Level *</label>
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
              <label htmlFor="duration" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Duration
              </label>
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
            <label htmlFor="description">Job Description *</label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the role, responsibilities, and requirements..."
              className="min-h-[120px] bg-background/50 backdrop-blur-sm"
              required
            />
          </div>

          {/* Required Skills */}
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Required Skills *
            </label>

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
          </div>

          {/* Screening Questions */}
          <div className="space-y-2">
            <label>Screening Questions (Optional)</label>
            <Textarea
              value={formData.screening_questions}
              onChange={(e) => handleInputChange("screening_questions", e.target.value)}
              placeholder="Add custom questions for applicants..."
              className="min-h-[80px] bg-background/50 backdrop-blur-sm"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="hero"
            className="w-full gap-2"
            disabled={isSubmitting}
          >
            <Briefcase className="w-5 h-5" />
            {isSubmitting ? "Posting..." : "Post Job"}
          </Button>
        </form>
      </Card>

      {/* RIGHT SIDE - AI Chat Assistant */}
      <Card className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)] flex flex-col">
        <div className="mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Job Assistant
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Get AI-powered help to craft the perfect job posting
          </p>
        </div>

        {/* Input Method Toggle */}
        <div className="flex gap-2 mb-4">
          <Button
            type="button"
            variant={inputMethod === "text" ? "default" : "outline"}
            onClick={() => setInputMethod("text")}
            size="sm"
            className="flex-1 gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Text
          </Button>
          <Button
            type="button"
            variant={inputMethod === "voice" ? "default" : "outline"}
            onClick={() => setInputMethod("voice")}
            size="sm"
            className="flex-1 gap-2"
          >
            <Mic className="w-4 h-4" />
            Voice
          </Button>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 pr-4 mb-4 h-[500px]">
          <div className="space-y-4">
            {/* Suggested Prompts - Only show when no messages */}
            {chatMessages.length === 0 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground">
                    Choose a prompt below or ask your own question
                  </p>
                </div>
                
                {/* Suggested Prompts Grid */}
                <div className="grid gap-3">
                  {[
                    {
                      icon: <Target className="w-5 h-5" />,
                      title: "Define Job Role",
                      prompt: "Help me create a job posting for a senior software developer position",
                      gradient: "from-blue-500/10 to-cyan-500/10",
                      border: "border-blue-500/30",
                      iconColor: "text-blue-500"
                    },
                    {
                      icon: <DollarSign className="w-5 h-5" />,
                      title: "Set Budget & Duration",
                      prompt: "What's a competitive budget and timeline for a 3-month web development project?",
                      gradient: "from-purple-500/10 to-pink-500/10",
                      border: "border-purple-500/30",
                      iconColor: "text-purple-500"
                    },
                    {
                      icon: <Zap className="w-5 h-5" />,
                      title: "Required Skills",
                      prompt: "What skills should I require for a full-stack developer role?",
                      gradient: "from-orange-500/10 to-red-500/10",
                      border: "border-orange-500/30",
                      iconColor: "text-orange-500"
                    },
                    {
                      icon: <Sparkles className="w-5 h-5" />,
                      title: "Improve Description",
                      prompt: "Review my job description and suggest improvements to attract top talent",
                      gradient: "from-indigo-500/10 to-violet-500/10",
                      border: "border-indigo-500/30",
                      iconColor: "text-indigo-500"
                    },
                  ].map((suggestion, idx) => (
                    <Card
                      key={idx}
                      className={`p-4 cursor-pointer transition-all bg-gradient-to-br ${suggestion.gradient} border-2 ${suggestion.border} hover:scale-[1.02] group`}
                      onClick={() => setChatInput(suggestion.prompt)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-background/50 ${suggestion.iconColor}`}>
                          {suggestion.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                            {suggestion.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {suggestion.prompt}
                          </p>
                        </div>
                        <Sparkles className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                    </Card>
                  ))}
                </div>

             
              </div>
            )}

            {/* Chat Messages */}
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* AI Thinking Indicator */}
            {isSendingMessage && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </ScrollArea>

        {/* Chat Input */}
        {inputMethod === "text" ? (
          <div className="flex gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask AI to help with your job posting..."
              className="bg-background/50 backdrop-blur-sm"
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendChatMessage(chatInput);
                }
              }}
              disabled={isSendingMessage}
            />
            <Button
              type="button"
              onClick={() => sendChatMessage(chatInput)}
              disabled={isSendingMessage || !chatInput.trim()}
              variant="default"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className={`p-6 rounded-full ${isRecording ? 'bg-destructive/20 animate-pulse' : 'bg-primary/20'}`}>
              {isRecording ? (
                <MicOff className="w-8 h-8 text-destructive" />
              ) : (
                <Mic className="w-8 h-8 text-primary" />
              )}
            </div>
            <Button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              className="gap-2"
            >
              {isRecording ? (
                <>
                  <MicOff className="w-4 h-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Start Recording
                </>
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
