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
    doc.text(`Job Type Preferences: ${profile.job_type_preferences}`, 20, y);
    y += 10;
    doc.text(`Preferred Location: ${profile.preferred_location}`, 20, y);
    y += 10;
    doc.text(`Portfolio Website: ${profile.portfolio_website || 'Not provided'}`, 20, y);
    y += 10;
    doc.text(`LinkedIn Profile: ${profile.linked_in_profile || 'Not provided'}`, 20, y);
    y += 10;
    doc.text(`GitHub Profile: ${profile.github_profile || 'Not provided'}`, 20, y);
    y += 10;
    doc.text(`Categories of Expertise: ${profile.categories_of_expertise}`, 20, y);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={exportToPDF} className="gap-2">
          <Download className="w-4 h-4" />
          Export Profile as PDF
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">Experience Years</label>
          <p className="text-lg">{profile.experience_years} years</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">Hourly Rate</label>
          <p className="text-lg">${profile.hourly_rate}/hr</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">Job Type Preferences</label>
          <p className="text-lg">{profile.job_type_preferences || 'Not specified'}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">Preferred Location</label>
          <p className="text-lg">{profile.preferred_location || 'Not specified'}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">Portfolio Website</label>
          <p className="text-lg">
            {profile.portfolio_website ? (
              <a href={profile.portfolio_website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {profile.portfolio_website}
              </a>
            ) : 'Not provided'}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">LinkedIn Profile</label>
          <p className="text-lg">
            {profile.linked_in_profile ? (
              <a href={profile.linked_in_profile} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {profile.linked_in_profile}
              </a>
            ) : 'Not provided'}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">GitHub Profile</label>
          <p className="text-lg">
            {profile.github_profile ? (
              <a href={profile.github_profile} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {profile.github_profile}
              </a>
            ) : 'Not provided'}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">Categories of Expertise</label>
          <p className="text-lg">{profile.categories_of_expertise || 'Not specified'}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-muted-foreground">Skills</label>
        <div className="flex flex-wrap gap-2">
          {profile.skills && profile.skills.length > 0 ? (
            profile.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1.5">
                {skill}
              </Badge>
            ))
          ) : (
            <p className="text-muted-foreground">No skills listed</p>
          )}
        </div>
      </div>


      {profile.score && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">Profile Score</label>
          <p className="text-lg">{profile.score}/100</p>
        </div>
      )}
    </div>
  );
};