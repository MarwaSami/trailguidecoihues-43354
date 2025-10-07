import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { z } from "zod";
import { evaluateProfile, uploadCVToPythonBackend, ProfileEvaluationResponse } from "@/services/pythonBackendApi";
import { ProfileEvaluationResult } from "@/components/ProfileEvaluationResult";
import { GetProfile } from "@/context/ProfileformContext";

const profileSchema = z.object({
  bio: z.string().max(1000, "Bio must be less than 1000 characters").optional(),
  skills: z.string().max(500, "Skills must be less than 500 characters").optional(),
  experienceYears: z.number().min(0).max(50).optional(),
  hourlyRate: z.number().min(0).max(10000).optional(),
  portfolioUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export interface FreelancerProfile {
  bio: string;
  skills: string[];
  experience_years: number | null;
  hourly_rate: number | null;
  cv_url: string | null;
  portfolio_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
}

export const ProfileForm = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<ProfileEvaluationResponse | null>(null);
  const [profile, setProfile] = useState<FreelancerProfile>({
    bio: "",
    skills: [],
    experience_years: null,
    hourly_rate: null,
    cv_url: null,
    portfolio_url: null,
    linkedin_url: null,
    github_url: null,
  });

  useEffect(() => {
    setLoading(false);
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
    
     
   const data: FreelancerProfile | null = await GetProfile(user?.id);
      if (data !== undefined && data !== null) {
        setProfile(data);
      }
    } catch (error: any) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setEvaluating(true);

    try {
      const validation = profileSchema.safeParse({
        bio: profile.bio,
        skills: profile.skills.join(', '),
        experienceYears: profile.experience_years || 0,
        hourlyRate: profile.hourly_rate || 0,
        portfolioUrl: profile.portfolio_url || "",
        linkedinUrl: profile.linkedin_url || "",
        githubUrl: profile.github_url || "",
      });

      if (!validation.success) {
        toast({
          title: "Validation Error",
          description: validation.error.errors[0].message,
          variant: "destructive"
        });
        setSaving(false);
        setEvaluating(false);
        return;
      }

      // Save to Supabase
      const { error } = await supabase
        .from('freelancer_profiles')
        .upsert({
          user_id: user?.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Send to Python backend for evaluation
      try {
        const token = session?.access_token || '';
        const result = await evaluateProfile({
          userId: user?.id || '',
          bio: profile.bio || '',
          skills: profile.skills,
          experience_years: profile.experience_years,
          hourly_rate: profile.hourly_rate,
          portfolio_url: profile.portfolio_url,
          linkedin_url: profile.linkedin_url,
          github_url: profile.github_url,
        }, token);

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
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
      setEvaluating(false);
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

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      setProfile({ ...profile, cv_url: publicUrl });

      // Send CV to Python backend for evaluation
      try {
        const token = session?.access_token || '';
        const result = await uploadCVToPythonBackend(file, user?.id || '', token);
        
        setEvaluationResult(result);

        toast({
          title: "CV uploaded and evaluated",
          description: `Score: ${result.score}/100 - ${result.comments}`,
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
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          value={profile.bio || ""}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Skills (comma separated)</Label>
        <Input
          id="skills"
          placeholder="React, TypeScript, Node.js"
          value={profile.skills.join(', ')}
          onChange={(e) => setProfile({ 
            ...profile, 
            skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
          })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience</Label>
          <Input
            id="experience"
            type="number"
            min="0"
            max="50"
            value={profile.experience_years || ""}
            onChange={(e) => setProfile({ 
              ...profile, 
              experience_years: e.target.value ? parseInt(e.target.value) : null 
            })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
          <Input
            id="hourlyRate"
            type="number"
            min="0"
            step="0.01"
            value={profile.hourly_rate || ""}
            onChange={(e) => setProfile({ 
              ...profile, 
              hourly_rate: e.target.value ? parseFloat(e.target.value) : null 
            })}
          />
        </div>
      </div>

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
          {profile.cv_url && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open(profile.cv_url!, '_blank')}
            >
              View CV
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="portfolio">Portfolio URL</Label>
        <Input
          id="portfolio"
          type="url"
          placeholder="https://yourportfolio.com"
          value={profile.portfolio_url || ""}
          onChange={(e) => setProfile({ ...profile, portfolio_url: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn URL</Label>
        <Input
          id="linkedin"
          type="url"
          placeholder="https://linkedin.com/in/yourprofile"
          value={profile.linkedin_url || ""}
          onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="github">GitHub URL</Label>
        <Input
          id="github"
          type="url"
          placeholder="https://github.com/yourusername"
          value={profile.github_url || ""}
          onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
        />
      </div>

      <Button
        type="submit"
        disabled={saving || evaluating}
        className="w-full"
      >
        {saving || evaluating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {evaluating ? 'Evaluating...' : 'Saving...'}
          </>
        ) : (
          'Save & Evaluate Profile'
        )}
      </Button>

      <ProfileEvaluationResult result={evaluationResult} />
    </form>
  );
};
