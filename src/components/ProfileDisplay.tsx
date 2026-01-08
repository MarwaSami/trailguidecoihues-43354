import { Profile } from "@/context/ProfileContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
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
    doc.text(`Job Type: ${profile.job_type || 'Not specified'}`, 20, y);
    y += 10;
    doc.text(`Preferred Location: ${profile.preferred_location || 'Not specified'}`, 20, y);
    y += 10;
    doc.text(`Portfolio Website: ${profile.portfolio_website || 'Not provided'}`, 20, y);
    y += 10;
    doc.text(`LinkedIn Profile: ${profile.linked_in_profile || 'Not provided'}`, 20, y);
    y += 10;
    doc.text(`GitHub Profile: ${profile.github_profile || 'Not provided'}`, 20, y);
    y += 10;
    doc.text(`Category: ${profile.category || 'Not specified'}`, 20, y);
    y += 10;

    doc.text("Skills:", 20, y);
    y += 10;
    profile.skills.forEach((skill, index) => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={exportToPDF} className="gap-2">
          <Download className="w-4 h-4" />
          Export Profile as PDF
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hasValue(profile.experience_years) && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Experience Years</label>
            <p className="text-lg">{profile.experience_years} years</p>
          </div>
        )}
        {hasValue(profile.hourly_rate) && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Hourly Rate</label>
            <p className="text-lg">${profile.hourly_rate}/hr</p>
          </div>
        )}
        {hasValue(profile.job_type) && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Job Type</label>
            <p className="text-lg">{profile.job_type}</p>
          </div>
        )}
        {hasValue(profile.preferred_location) && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Preferred Location</label>
            <p className="text-lg">{profile.preferred_location}</p>
          </div>
        )}
        {hasValue(profile.portfolio_website) && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Portfolio Website</label>
            <p className="text-lg">
              <a href={profile.portfolio_website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {profile.portfolio_website}
              </a>
            </p>
          </div>
        )}
        {hasValue(profile.linked_in_profile) && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">LinkedIn Profile</label>
            <p className="text-lg">
              <a href={profile.linked_in_profile} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {profile.linked_in_profile}
              </a>
            </p>
          </div>
        )}
        {hasValue(profile.github_profile) && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">GitHub Profile</label>
            <p className="text-lg">
              <a href={profile.github_profile} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {profile.github_profile}
              </a>
            </p>
          </div>
        )}
        {hasValue(profile.category) && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground">Category</label>
            <p className="text-lg">{profile.category}</p>
          </div>
        )}
      </div>

      {profile.skills && profile.skills.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">Skills</label>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1.5">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {profile.score && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">Profile Score</label>
          <p className="text-lg">{profile.score}/100</p>
        </div>
      )}
    </div>
  );
};