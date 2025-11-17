import { Navbar } from "@/components/Navbar";
import { ProfileForm } from "@/components/ProfileForm";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ProfileformProvider, useProfileData } from "@/context/ProfileContext";

const FreelancerProfile = () => {
  const { user, loading } = useAuth();
  const { profile } = useProfileData();
  const navigate = useNavigate();
  const profilestep = 1;
  useEffect(() => {
    // if (!loading && !user) {
    //   navigate('/auth');
    // }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Professional Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your freelancer profile and showcase your skills to potential clients.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Side - User Info Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)] rounded-xl p-6 space-y-6 sticky top-24">
                {/* Profile Image */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group cursor-pointer">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent p-1 shadow-[var(--shadow-glow)]">
                      <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-4xl font-bold text-primary">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm">
                      Edit
                    </div>
                  </div>
                  
                  <div className="text-center space-y-1">
                    <h3 className="text-2xl font-bold">{user?.username || 'User'}</h3>
                    <p className="text-sm text-muted-foreground">Freelancer</p>
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
                    <p className="text-sm font-medium break-all">{user?.email || 'Not provided'}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</label>
                    <p className="text-sm font-medium">{user?.phone_number || 'Not provided'}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bio</label>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {user?.bio || 'No bio added yet. Share something about yourself!'}
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="pt-4 border-t border-border/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-primary/10">
                      <p className="text-2xl font-bold text-primary">
                        {profile?.score || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Profile Score</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-accent/10">
                      <p className="text-2xl font-bold text-accent">
                        {profile?.skills?.length || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Skills</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)] rounded-xl p-8">
                <ProfileForm />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FreelancerProfile;
