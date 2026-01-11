import { Profile } from "@/context/ProfileContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Briefcase, MapPin, Clock, Globe, Linkedin, Github, FolderOpen } from "lucide-react";
import jsPDF from "jspdf";

interface ProfileDisplayProps {
  profile: Profile;
}

export const ProfileDisplay = ({ profile }: ProfileDisplayProps) => {
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Freelancer Profile", 20, 30);

    doc.setFontSize(12);
    let y = 50;

    doc.text(`Experience Years: ${profile.experience_years}`, 20, y);
    y += 10;
    doc.text(`Hourly Rate: $${profile.hourly_rate}/hr`, 20, y);
    y += 10;
    doc.text(`Job Type: ${profile.job_type_preferences || profile.job_type || 'Not specified'}`, 20, y);
    y += 10;
    doc.text(`Preferred Location: ${profile.preferred_location || 'Not specified'}`, 20, y);
    y += 10;
    doc.text(`Portfolio Website: ${profile.portfolio_website || 'Not provided'}`, 20, y);
    y += 10;
    doc.text(`LinkedIn Profile: ${profile.linked_in_profile || 'Not provided'}`, 20, y);
    y += 10;
    doc.text(`GitHub Profile: ${profile.github_profile || 'Not provided'}`, 20, y);
    y += 10;
    doc.text(`Category: ${profile.categories_of_expertise || profile.category || 'Not specified'}`, 20, y);
    y += 10;

    doc.text("Skills:", 20, y);
    y += 10;
    profile.skills.forEach((skill) => {
      doc.text(`- ${skill}`, 30, y);
      y += 8;
    });

    if (profile.score) {
      y += 10;
      doc.text(`Profile Score: ${profile.score}/100`, 20, y);
    }

    doc.save("freelancer-profile.pdf");
  };

  // Helper function to check if a value should be displayed
  const hasValue = (value: string | number | undefined | null): boolean => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return true;
    return false;
  };

  // Format category for display
  const formatCategory = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-8">
      {/* Header with Export Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Profile Details</h2>
        <Button onClick={exportToPDF} className="gap-2">
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
      </div>

      {/* Main Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hasValue(profile.experience_years) && (
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Experience</p>
                <p className="text-xl font-bold">{profile.experience_years} years</p>
              </div>
            </div>
          </div>
        )}

        {hasValue(profile.hourly_rate) && (
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-4 border border-accent/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Briefcase className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Hourly Rate</p>
                <p className="text-xl font-bold">${profile.hourly_rate}/hr</p>
              </div>
            </div>
          </div>
        )}

        {hasValue(profile.preferred_location) && (
          <div className="bg-gradient-to-br from-secondary/50 to-secondary/30 rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <MapPin className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                <p className="text-xl font-bold">{profile.preferred_location}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Job Type & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hasValue(profile.job_type_preferences || profile.job_type) && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Job Type Preference</label>
            <p className="text-lg capitalize">{profile.job_type_preferences || profile.job_type}</p>
          </div>
        )}
        {hasValue(profile.categories_of_expertise || profile.category) && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Category of Expertise</label>
            <p className="text-lg">{formatCategory(profile.categories_of_expertise || profile.category || '')}</p>
          </div>
        )}
      </div>

      {/* Links Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-border/50 pb-2">Links & Profiles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hasValue(profile.portfolio_website) && (
            <a 
              href={profile.portfolio_website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
            >
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-muted-foreground">Portfolio</p>
                <p className="text-sm font-medium truncate text-primary">{profile.portfolio_website}</p>
              </div>
            </a>
          )}

          {hasValue(profile.linked_in_profile) && (
            <a 
              href={profile.linked_in_profile} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
            >
              <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <Linkedin className="w-5 h-5 text-blue-500" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-muted-foreground">LinkedIn</p>
                <p className="text-sm font-medium truncate text-blue-500">View Profile</p>
              </div>
            </a>
          )}

          {hasValue(profile.github_profile) && (
            <a 
              href={profile.github_profile} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
            >
              <div className="p-2 bg-foreground/10 rounded-lg group-hover:bg-foreground/20 transition-colors">
                <Github className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-muted-foreground">GitHub</p>
                <p className="text-sm font-medium truncate">{profile.github_profile.replace('https://github.com/', '')}</p>
              </div>
            </a>
          )}
        </div>
      </div>

      {/* Skills Section */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border/50 pb-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Skills ({profile.skills.length})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="px-3 py-1.5 text-sm bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 transition-colors"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Score Section */}
      {profile.score && (
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-xl p-6 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Profile Score</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {profile.score}/100
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{profile.score}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};