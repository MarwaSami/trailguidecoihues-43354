import { Navbar } from "@/components/Navbar";
import { ProfileForm } from "@/components/ProfileForm";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ProfileformProvider } from "@/context/ProfileContext";

const FreelancerProfile = () => {
  const { user, loading } = useAuth();
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Your Profile</h1>
            <p className="text-muted-foreground">
              Manage your freelancer profile and showcase your skills to potential clients.
            </p>
          </div>

          <div className="bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)] rounded-lg p-8">
         <ProfileForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FreelancerProfile;
