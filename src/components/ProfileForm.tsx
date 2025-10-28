import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AddProfileinDB, uploadCvTodb, useProfileData } from "@/context/ProfileContext";
import { number } from "zod/v4-mini";

export const ProfileForm = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false); // handles spinner
  const [isProcessing, setIsProcessing] = useState(false); // handles API CV processing state
  const { user, token } = useAuth();
  const { profile, setProfile } = useProfileData();

  useEffect(() => {
    if (user) setUploading(false);
  }, [user]);

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
      const user_id = user?.id || 0;
      const result = await uploadCvTodb(file, user_id, token);

      if (result.is_success) {
        toast({
          title: "CV Uploaded Successfully",
          description: `Score: ${result.profile.score}/100`,
        });

        setProfile(result.profile);
      } else {
        throw new Error(result.detail);
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
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
    console.log(response)
    if (response.is_success) {
      toast({ title: `Profile saved successfully! with score ${response.score}` });
  
    } else {
      toast({
        title: "Error",
        description: response.detail || "Something went wrong.",
        variant: "destructive",
      });

    }
  } catch (error: any) {
    toast({
      title: "Failed to save profile",
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
          <input
            id="cv"
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
          />
          {uploading && (
            <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
          )}
        </div>
        {isProcessing && (
          <div className="flex flex-col items-center justify-center p-4 text-gray-600">
            <Loader2 className="w-6 h-6 animate-spin mb-2" />
            <p>Processing CV, please wait...</p>
          </div>
        )}
      </div>

      {/* ===== FORM REMAINS VISIBLE ===== */}
      <div className="space-y-2">
        <Label htmlFor="skills">Skills</Label>
        <Input
          id="skills"
          value={profile.skills?.join(",") || ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              skills: e.target.value.split(","),
            })
          }
        />
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
        <Label htmlFor="jobtype">Job Type</Label>
        <Input
          id="jobtype"
          value={profile.job_type || ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              job_type: e.target.value,
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
        <Label htmlFor="linkedin_profile">LinkedIn Profile</Label>
        <Input
          id="linkedin_profile"
          value={profile.linkedin_profile || ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              linkedin_profile: e.target.value,
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
        <Label htmlFor="Hourlyrate">Hourlyrate</Label>
        <Input
          id="github_profile"
          value={profile.hourly_rate || 0}
          type="number"
          onChange={(e) =>
            setProfile({
              ...profile,
              hourly_rate:  Number(e.target.value),
            })
          }
        />
      </div>
       {/* <div className="space-y-2">
        <Label htmlFor="categories_of_expertise">categories_of_expertise </Label>
        <Input
          id="github_profile"
          value={profile.categories_of_expertise || 0}
          onChange={(e) =>
            setProfile({
              ...profile,
              categories_of_expertise:  e.target.value,
            })
          }
        />
      </div> */}
      <Button type="submit" className="w-full" disabled={uploading}>
        {uploading ? (
          <Loader2 className="w-4 h-4 animate-spin mx-auto" />
        ) : (
          "Save Profile"
        )}
      </Button>
    </form>
  );
};
