import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Mic, MicOff, FileText, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// Define API base URL - replace with your actual backend URL
const baseURL = "YOUR_BACKEND_URL";

// Get auth token from localStorage or your auth context
const getAuthToken = () => {
  return localStorage.getItem("authToken") || ""; // Adjust based on your auth implementation
};

// Define response interfaces
interface AudioToTextResponse {
  is_success: boolean;
  text: string;
  detail?: string;
}

interface GeneratedJobPosting {
  title: string;
  description: string;
  requirements: string[];
  skills_required: string[];
  budget_range: {
    min: number;
    max: number;
  };
  experience_level: string;
  job_type: string;
  duration?: string;
}

interface GenerateJobResponse {
  is_success: boolean;
  job_posting: GeneratedJobPosting;
  detail?: string;
}

export const AIJobAssistant = () => {
  const [inputMethod, setInputMethod] = useState<"text" | "voice">("text");
  const [jobDescription, setJobDescription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
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
          setJobDescription(transcribedText);
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

  const validateJobDescription = (description: string): { valid: boolean; error?: string } => {
    const trimmedDesc = description.trim();
    
    if (!trimmedDesc) {
      return { valid: false, error: "Job description cannot be empty" };
    }
    
    if (trimmedDesc.length < 50) {
      return { valid: false, error: "Job description must be at least 50 characters" };
    }
    
    if (trimmedDesc.length > 5000) {
      return { valid: false, error: "Job description must not exceed 5000 characters" };
    }
    
    // Check for required information keywords
    const hasRoleInfo = /\b(role|position|job|title)\b/i.test(trimmedDesc);
    const hasSkillsInfo = /\b(skill|experience|knowledge|requirement)\b/i.test(trimmedDesc);
    
    if (!hasRoleInfo || !hasSkillsInfo) {
      return { 
        valid: false, 
        error: "Please include information about the role and required skills/experience" 
      };
    }
    
    return { valid: true };
  };

  const generateJobPosting = async () => {
    // Validate input
    const validation = validateJobDescription(jobDescription);
    if (!validation.valid) {
      toast({
        title: "Validation Error",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      const response = await axios.post<GenerateJobResponse>(
        `${baseURL}/generateJobPosting`,
        {
          description: jobDescription.trim(),
          format: 'structured',
          includeKeywords: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.data.is_success) {
        throw new Error(response.data.detail || 'Failed to generate job posting');
      }

      const generatedData = response.data.job_posting;
      
      console.log('Generated job posting:', generatedData);
      
      toast({
        title: "Job posting generated!",
        description: "Review and publish your AI-generated job posting",
      });

      // Here you would typically navigate to a review page or update state
      // with the generated job posting data
      // Example: navigate('/job-review', { state: { jobPosting: generatedData } });
      
    } catch (error) {
      console.error('Job generation error:', error);
      
      let errorMessage = "Failed to generate job posting. Please try again.";
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data?.detail || "Invalid input. Please check your job description.";
        } else if (error.response?.data?.detail) {
          errorMessage = error.response.data.detail;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Method Selection */}
      <Card className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
        <Label className="mb-4 block">Choose Input Method</Label>
        <div className="grid sm:grid-cols-2 gap-4">
          <Button
            variant={inputMethod === "text" ? "default" : "outline"}
            onClick={() => setInputMethod("text")}
            className="h-auto py-4 flex-col gap-2"
          >
            <FileText className="w-6 h-6" />
            <span>Text Input</span>
          </Button>
          <Button
            variant={inputMethod === "voice" ? "default" : "outline"}
            onClick={() => setInputMethod("voice")}
            className="h-auto py-4 flex-col gap-2"
          >
            <Mic className="w-6 h-6" />
            <span>Voice Input</span>
          </Button>
        </div>
      </Card>

      {/* Input Area */}
      <Card className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
        {inputMethod === "text" ? (
          <div className="space-y-4">
            <Label htmlFor="ai-description">
              Describe Your Job Requirements
            </Label>
            <Textarea
              id="ai-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Tell us about the position you're hiring for. Include role title, required skills, experience level, job type, salary range, and any other important details..."
              className="min-h-[300px] bg-background/50 backdrop-blur-sm"
            />
            <p className="text-sm text-muted-foreground">
              Example: "I need a senior React developer with 5+ years experience for a full-time remote position. Must know TypeScript, Node.js, and have experience with AWS. Salary range $100-150k annually."
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Label>Record Your Job Requirements</Label>
            <div className="flex flex-col items-center justify-center py-12 gap-6">
              <div className={`p-8 rounded-full ${isRecording ? 'bg-destructive/20 animate-pulse' : 'bg-primary/20'}`}>
                {isRecording ? (
                  <MicOff className="w-16 h-16 text-destructive" />
                ) : (
                  <Mic className="w-16 h-16 text-primary" />
                )}
              </div>
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
                size="lg"
                className="gap-2"
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    Start Recording
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {isRecording
                  ? "Recording... Click stop when you're done describing the position"
                  : "Click to start recording. Describe the role, requirements, and any details about the position."}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Generate Button */}
      <div className="flex gap-4">
        <Button
          onClick={generateJobPosting}
          variant="hero"
          className="flex-1 gap-2"
          disabled={isGenerating}
        >
          <Sparkles className="w-5 h-5" />
          {isGenerating ? "Generating..." : "Generate Job Posting"}
        </Button>
        <Button variant="outline" className="flex-1">
          Cancel
        </Button>
      </div>

      {/* AI Preview Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">AI-Powered Job Creation</h3>
            <p className="text-sm text-muted-foreground">
              Our AI will analyze your input and generate a professional job posting with proper formatting, skill requirements, and optimized content to attract the best candidates.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
