import { baseURL, useAuth } from "@/context/AuthContext";
import { Plus, X, MapPin, Globe } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AddProfileinDB, Profile, uploadCvTodb, useProfileData } from "@/context/ProfileContext";
import { useNavigate } from "react-router-dom";

// Predefined location options (countries)
const LOCATION_OPTIONS = [
  { value: "Remote", label: "Remote", icon: Globe },
  { value: "Egypt", label: "Egypt", icon: MapPin },
  { value: "United States", label: "United States", icon: MapPin },
  { value: "United Kingdom", label: "United Kingdom", icon: MapPin },
  { value: "Germany", label: "Germany", icon: MapPin },
  { value: "Canada", label: "Canada", icon: MapPin },
  { value: "Australia", label: "Australia", icon: MapPin },
  { value: "United Arab Emirates", label: "United Arab Emirates", icon: MapPin },
  { value: "Saudi Arabia", label: "Saudi Arabia", icon: MapPin },
  { value: "France", label: "France", icon: MapPin },
  { value: "Netherlands", label: "Netherlands", icon: MapPin },
  { value: "Singapore", label: "Singapore", icon: MapPin },
  { value: "Japan", label: "Japan", icon: MapPin },
  { value: "India", label: "India", icon: MapPin },
  { value: "Brazil", label: "Brazil", icon: MapPin },
  { value: "South Africa", label: "South Africa", icon: MapPin },
];

export const ProfileForm = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user, token } = useAuth();
  const { profile, setProfile } = useProfileData();
  const [newSkill, setNewSkill] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const navigate = useNavigate();

  // Parse preferred_location as array
  const getLocationsArray = (): string[] => {
    if (!profile?.preferred_location) return [];
    if (Array.isArray(profile.preferred_location)) return profile.preferred_location;
    return profile.preferred_location.split(',').map(l => l.trim()).filter(Boolean);
  };

  const setLocationsArray = (locations: string[]) => {
    setProfile({
      ...profile,
      preferred_location: locations.join(', ')
    });
  };

  const addLocation = (location: string) => {
    const current = getLocationsArray();
    if (!current.includes(location)) {
      setLocationsArray([...current, location]);
    }
    setNewLocation("");
    setShowLocationSuggestions(false);
  };

  const removeLocation = (location: string) => {
    const current = getLocationsArray();
    setLocationsArray(current.filter(l => l !== location));
  };

  const filteredLocationOptions = LOCATION_OPTIONS.filter(
    opt => !getLocationsArray().includes(opt.value) &&
    opt.label.toLowerCase().includes(newLocation.toLowerCase())
  );

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

    // Start saving loader
    setIsSaving(true);

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
  } finally {
    setIsSaving(false);
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
      {/* ===== PREFERRED LOCATIONS SECTION ===== */}
      <div className="space-y-3">
        <Label className="text-base font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Preferred Locations
        </Label>
        
        {/* Current Locations as Badges */}
        <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg min-h-[60px] border border-border/50">
          {getLocationsArray().length > 0 ? (
            getLocationsArray().map((location, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className={`px-3 py-1.5 gap-2 text-sm transition-colors ${
                  location === "Remote" 
                    ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300" 
                    : "bg-primary/10 hover:bg-primary/20"
                }`}
              >
                {location === "Remote" ? (
                  <Globe className="w-3 h-3" />
                ) : (
                  <MapPin className="w-3 h-3" />
                )}
                {location}
                <button
                  type="button"
                  onClick={() => removeLocation(location)}
                  className="hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No locations added. Select or type your preferred work locations.</p>
          )}
        </div>

        {/* Quick Select Buttons */}
        <div className="flex flex-wrap gap-2">
          {LOCATION_OPTIONS.slice(0, 5).filter(opt => !getLocationsArray().includes(opt.value)).map((opt) => (
            <Button
              key={opt.value}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addLocation(opt.value)}
              className={`gap-1.5 text-xs ${
                opt.value === "Remote" 
                  ? "border-emerald-500/50 hover:bg-emerald-500/10 hover:border-emerald-500" 
                  : ""
              }`}
            >
              <opt.icon className="w-3 h-3" />
              {opt.label}
            </Button>
          ))}
        </div>

        {/* Add Custom Location */}
        <div className="relative">
          <div className="flex gap-2">
            <Input
              value={newLocation}
              onChange={(e) => {
                setNewLocation(e.target.value);
                setShowLocationSuggestions(true);
              }}
              onFocus={() => setShowLocationSuggestions(true)}
              placeholder="Search or add custom location..."
              className="bg-background/50 backdrop-blur-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (newLocation.trim() && !getLocationsArray().includes(newLocation.trim())) {
                    addLocation(newLocation.trim());
                  }
                }
              }}
            />
            <Button 
              type="button" 
              onClick={() => {
                if (newLocation.trim() && !getLocationsArray().includes(newLocation.trim())) {
                  addLocation(newLocation.trim());
                }
              }}
              variant="secondary"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
          
          {/* Suggestions Dropdown */}
          {showLocationSuggestions && newLocation && filteredLocationOptions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-48 overflow-auto">
              {filteredLocationOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => addLocation(opt.value)}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-accent flex items-center gap-2 transition-colors ${
                    opt.value === "Remote" ? "text-emerald-600 dark:text-emerald-400" : ""
                  }`}
                >
                  <opt.icon className="w-4 h-4" />
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* ===== SKILLS SECTION ===== */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Skills *</Label>
        
        {/* Current Skills as Badges */}
        <div className="flex flex-wrap gap-2 p-4  rounded-lg min-h-[60px] border border-border/50">
          {profile.skills && profile.skills.length > 0 ? (
            profile.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1.5 gap-2 text-sm ">
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
      
      <Button type="submit" className="w-full" disabled={uploading || isSaving}>
        {isSaving ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span>Saving Profile...</span>
          </div>
        ) : uploading ? (
          <LoadingSpinner size="sm" message="Processing CV..." />
        ) : (
          "Save Profile"
        )}
      </Button>
      
      {isSaving && (
        <div className="flex justify-center mt-4">
          <LoadingSpinner size="md" message="Saving your profile, please wait..." />
        </div>
      )}
    </form>
  );
}
