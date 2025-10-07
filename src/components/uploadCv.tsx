import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { z } from "zod";
import { uploadCVToPythonBackend, ProfileEvaluationResponse } from "@/services/pythonBackendApi";
import { CvUploadedResponce, uploadCvTodb } from "@/context/ProfileformContext";



export const CVUploadForm = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<ProfileEvaluationResponse | null>(null);
    const [cv, setcv] = useState<File>();

  useEffect(() => {
    setLoading(false);
    if (user) {
      CVUploadForm();
    }
  }, [user]);

  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setEvaluating(true);

        try {
        const token = session?.access_token || '';
        const result = await uploadCVToPythonBackend(cv, user?.id || '', token);
        setEvaluationResult(result);

        toast({
          title: "Profile updated and evaluated",
          description: `Score: ${result.score}/100 - ${result.comments}`,
        });
      } catch (backendError: any) {
        console.error('Python backend error:', backendError);
        toast({
          title: "Profile saved",
          description: "Profile saved to database, but backend evaluation is unavailable.",
          variant: "default"
        });
      }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "CV must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Only PDF files are allowed",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setEvaluating(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `cvs/${fileName}`;
     
    
      // Send CV to Python backend for evaluation
      try {
        const token = session?.access_token || '';
        const result = await uploadCvTodb(file, token);

        // Ensure result matches ProfileEvaluationResponse
        const evaluation: CvUploadedResponce = {
          success: result.success ?? true,
          score: result.score ?? 0,
          comments: result.comments ?? "",
          cvId: result.cvId ?? "",
        };
        setEvaluationResult(evaluation);

        toast({
          title: "CV uploaded and evaluated",
          description: `Score: ${evaluation.score}/100 - ${evaluation.comments}`,
        });
      } catch (backendError: any) {
        console.error('Python backend error:', backendError);
        toast({
          title: "CV uploaded",
          description: "CV uploaded to storage, but backend evaluation is unavailable.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error uploading CV",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      

     
    
       

      <div className="space-y-2">
        <Label htmlFor="cv">CV (PDF, max 5MB)</Label>
        <div className="flex items-center gap-4">
          <Input
            id="cv"
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={uploading}
            className="flex-1"
          />
          {uploading && <Loader2 className="w-5 h-5 animate-spin" />}
        </div>
      </div>
       
        <Button type="submit" disabled={saving || evaluating}>
           
        Save
        </Button>
    </form>
  );
};
