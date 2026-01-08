import { baseURL, useAuth } from "@/context/AuthContext";
import { Plus, X } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AddProfileinDB, Profile, uploadCvTodb, useProfileData } from "@/context/ProfileContext";
import { number } from "zod/v4-mini";
import { set } from "date-fns";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ProfileForm = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false); // handles spinner
  const [isProcessing, setIsProcessing] = useState(false); // handles API CV processing state
  const { user, token } = useAuth();
  const { profile, setProfile } = useProfileData();
  const [newSkill, setNewSkill] = useState("");
  const navigate = useNavigate();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // validation
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "CV must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Only PDF files are allowed",
        variant: "destructive",
      });
      return;
    }

    // start loader
    setUploading(true);
    setIsProcessing(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const user_id = user?.id || 0;
      const result = await uploadCvTodb(file, user_id, token);

      if (result.is_success) {
        toast({
          title: "Upload Complete 🎉",
          description: `Your CV has been uploaded and processed.`,
          variant: "success",
        });
      
        setProfile(result.profile);
      } else {
        throw new Error(result.detail || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "An error occurred during upload",
        variant: "destructive",
      });
    } finally {
      // stop loader after upload complete
      setUploading(false);
      setIsProcessing(false);
    }
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // Optional: simple validation
    if (!profile.skills || profile.skills.length === 0) {
      toast({ title: "Please add your skills", variant: "destructive" });
      return;
    }

    // Send data to backend
    const response = await AddProfileinDB(profile, token, user.id);
    console.log(response);
    if (response.is_success && response.data.id) {
      toast({ title: `Profile saved successfully!` , variant: "success" });
      setProfile(response.data); // update with returned profile
      navigate('/freelancer-dashboard'); // redirect to view portfolio page
    } else {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  } catch (error: any) {
    toast({
      title: "Submission failed", 
      description: error.message,
      variant: "destructive",
    });
  }

};
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* ===== FILE UPLOAD ===== */}
      <div className="space-y-2">
        <Label htmlFor="cv">Upload CV (PDF)</Label>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              id="cv"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex items-center gap-3 px-4 py-3 bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg hover:border-primary/50 hover:bg-background/70 transition-all cursor-pointer">
              <div className="p-2 rounded-lg bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">Choose PDF file</span>
                <span className="text-xs text-muted-foreground">Max 5MB</span>
              </div>
            </div>
          </div>
          {uploading && (
             <LoadingSpinner size="lg" message="Processing CV, please wait..." />
          )}
        </div>
      </div>
     <div className="space-y-2">
        <Label htmlFor="categories_of_expertise">Job Title</Label>
        <Input
          id="profiecategories_of_expertiseleViews"
          value={profile.category || ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              category:  e.target.value,
            })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="preferred_location">Preferred Location</Label>
        <Input
          id="preferred_location"
          value={profile.preferred_location || ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              preferred_location: e.target.value,
            })
          }
        />
      </div>
      {/* ===== SKILLS SECTION ===== */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Skills *</Label>
        
        {/* Current Skills as Badges */}
        <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg min-h-[60px] border border-border/50">
          {profile.skills && profile.skills.length > 0 ? (
            profile.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1.5 gap-2 text-sm bg-primary/10 hover:bg-primary/20 transition-colors">
                {skill}
                <button
                  type="button"
                  onClick={() => {
                    const updatedSkills = profile.skills?.filter((_, i) => i !== index) || [];
                    setProfile({ ...profile, skills: updatedSkills });
                  }}
                  className="hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No skills added yet. Add your skills below.</p>
          )}
        </div>

        {/* Add New Skill */}
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill (e.g., React, Python, Design)..."
            className="bg-background/50 backdrop-blur-sm"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (newSkill.trim() && !profile.skills?.includes(newSkill.trim())) {
                  setProfile({
                    ...profile,
                    skills: [...(profile.skills || []), newSkill.trim()]
                  });
                  setNewSkill("");
                }
              }
            }}
          />
          <Button 
            type="button" 
            onClick={() => {
              if (newSkill.trim() && !profile.skills?.includes(newSkill.trim())) {
                setProfile({
                  ...profile,
                  skills: [...(profile.skills || []), newSkill.trim()]
                });
                setNewSkill("");
              }
            }}
            variant="secondary"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experienceyears">Experience Years</Label>
        <Input
          id="experienceyears"
          value={profile.experience_years || ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              experience_years: Number(e.target.value),
            })
          }
        />
      </div>


      <div className="space-y-2">
        <Label htmlFor="portfolio_website">Portfolio Website</Label>
        <Input
          id="portfolio_website"
          value={profile.portfolio_website || ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              portfolio_website: e.target.value,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linked_in_profile">LinkedIn Profile</Label>
        <Input
          id="linked_in_profile"
          value={profile.linked_in_profile || ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              linked_in_profile: e.target.value,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="github_profile">GitHub Profile</Label>
        <Input
          id="github_profile"
          value={profile.github_profile || ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              github_profile: e.target.value,
            })
          }
        />
      </div>
 <div className="space-y-2">
       <Label htmlFor="hourly_rate">Hourly Rate</Label>
       <Input
         id="hourly_rate"
         value={profile.hourly_rate || ""}
         onChange={(e) =>
           setProfile({
             ...profile,
             hourly_rate: e.target.value,
           })
         }
       />
     </div>
      
      <Button type="submit" className="w-full" disabled={uploading}>
        {uploading ? (
             <LoadingSpinner size="lg" message="CV..." />
        ) : (
          "Save Profile"
        )}
      </Button>
    </form>
  );
}
