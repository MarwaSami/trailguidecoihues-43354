import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader2, Briefcase, Target, TrendingUp, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const ClientProfile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Parse user if it's a string
  const userData = user ? (typeof user === 'string' ? JSON.parse(user) : user) : null;

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { label: "Total Jobs Posted", value: "12", icon: Briefcase, trend: "All time", color: "primary" },
    { label: "Active Jobs", value: "3", icon: Target, trend: "Currently hiring", color: "secondary" },
    { label: "Completed Projects", value: "8", icon: CheckCircle, trend: "Success rate 94%", color: "accent" },
    { label: "Total Spent", value: "$15,200", icon: TrendingUp, trend: "This year", color: "primary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Client Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your client profile and track your hiring activities.
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
                        {userData?.username?.charAt(0).toUpperCase() || 'C'}
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm">
                      Edit
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <h3 className="text-2xl font-bold">{userData?.username || 'Client'}</h3>
                    <p className="text-sm text-muted-foreground">Client</p>
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
                    <p className="text-sm font-medium break-all">{userData?.email || 'Not provided'}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company</label>
                    <p className="text-sm font-medium">{userData?.company || 'Not provided'}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bio</label>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {userData?.bio || 'No bio added yet. Share something about your company!'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Stats and Activity */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.map((stat, idx) => (
                  <Card key={idx} className="group p-6 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-primary/50 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-400 hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg group-hover:scale-110 transition-transform duration-400`}>
                        <stat.icon className={`w-6 h-6 text-primary-foreground`} />
                      </div>
                      <TrendingUp className="w-4 h-4 text-accent" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-xs text-accent font-medium">{stat.trend}</p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <Card className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
                <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Briefcase className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Posted new job: Senior React Developer</p>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/5">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <CheckCircle className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Accepted proposal from John Doe</p>
                      <p className="text-sm text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientProfile;