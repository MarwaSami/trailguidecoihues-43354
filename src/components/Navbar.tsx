import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, LogOut, Menu, Bell, Briefcase, Users, Calendar, Clock, CheckCircle, Target, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, token, signOut } = useAuth();
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);

  // Parse user from localStorage if it's a string
  const userData = user ? (typeof user === 'string' ? JSON.parse(user) : user) : null;
  const isFreelancer = userData?.user_type === "freelancer";
  const isActive = (path: string) => location.pathname === path;
  const isLoggedIn = token != null;

  // Get Supabase user ID
  useEffect(() => {
    const getSupabaseUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setSupabaseUserId(user?.id || null);
    };
    if (isLoggedIn) {
      getSupabaseUser();
    }
  }, [isLoggedIn]);

  // Use real-time notifications hook
  const { notifications: realtimeNotifications, loading: notificationsLoading, markAsRead } = useRealtimeNotifications(supabaseUserId);

  // Map real-time notifications to UI format
  const getIconByType = (type: string) => {
    switch (type) {
      case 'proposal_accepted': return 'checkCircle';
      case 'proposal_status': return 'clock';
      case 'new_job': return 'briefcase';
      case 'new_proposal': return 'users';
      case 'interview': return 'calendar';
      case 'interview_completed': return 'award';
      case 'job_match': return 'target';
      default: return 'bell';
    }
  };

  const getColorByType = (type: string) => {
    switch (type) {
      case 'proposal_accepted': return 'green';
      case 'new_job': return 'purple';
      case 'new_proposal': return 'primary';
      case 'interview': return 'blue';
      case 'interview_completed': return 'green';
      case 'job_match': return 'purple';
      default: return 'default';
    }
  };

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const formattedNotifications = realtimeNotifications.map(notif => ({
    id: notif.id,
    type: notif.type,
    text: notif.message,
    time: getRelativeTime(notif.created_at),
    link: notif.link || "/",
    unread: !notif.read,
    icon: getIconByType(notif.type),
    color: getColorByType(notif.type)
  }));

  // Fallback to mock notifications if no real-time data
  const notifications = formattedNotifications.length > 0 ? formattedNotifications : (isFreelancer ? [
    { 
      id: 1, 
      type: 'proposal_status',
      text: "Your proposal for 'Senior React Developer' was accepted", 
      time: "5m ago", 
      link: "/my-proposals", 
      unread: true,
      icon: 'checkCircle',
      color: 'green'
    },
    { 
      id: 2, 
      type: 'new_job',
      text: "New job matching your skills: 'Full Stack Engineer'", 
      time: "1h ago", 
      link: "/job-browse", 
      unread: true,
      icon: 'briefcase',
      color: 'purple'
    },
    { 
      id: 3, 
      type: 'interview',
      text: "Interview scheduled for tomorrow at 10 AM", 
      time: "2h ago", 
      link: "/interview-practice", 
      unread: true,
      icon: 'calendar',
      color: 'blue'
    },
    { 
      id: 4, 
      type: 'proposal_status',
      text: "Your proposal for 'UI Designer' is under review", 
      time: "1d ago", 
      link: "/my-proposals", 
      unread: false,
      icon: 'clock',
      color: 'default'
    },
  ] : [
    { 
      id: 1, 
      type: 'new_proposal',
      text: "3 new candidates applied for 'Senior Developer'", 
      time: "5m ago", 
      link: "/my-jobs", 
      unread: true,
      icon: 'users',
      color: 'primary'
    },
    { 
      id: 2, 
      type: 'job_match',
      text: "AI found 5 matching candidates for your job", 
      time: "1h ago", 
      link: "/candidate-discovery", 
      unread: true,
      icon: 'target',
      color: 'purple'
    },
    { 
      id: 3, 
      type: 'interview_completed',
      text: "Candidate completed interview with 85% score", 
      time: "3h ago", 
      link: "/view-applicants/1", 
      unread: false,
      icon: 'award',
      color: 'green'
    },
    { 
      id: 4, 
      type: 'job_published',
      text: "Your job 'Backend Engineer' was published", 
      time: "1d ago", 
      link: "/my-jobs", 
      unread: false,
      icon: 'checkCircle',
      color: 'default'
    },
  ]);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50 shadow-[var(--shadow-glass)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg group-hover:shadow-[var(--shadow-glow)] transition-all duration-400">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SmartLance
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/") ? "text-primary" : "text-foreground"
                }`}
            >
              Home
            </Link>
            {isFreelancer  ? (
              <>
                <Link
                  to="/freelancer-dashboard"
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/freelancer-dashboard") ? "text-primary" : "text-foreground"
                    }`}
                >
                   Dashboard
                </Link>
                <Link
                  to="/my-proposals"
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/freelancer-profile") ? "text-primary" : "text-foreground"
                    }`}
                >
                   My Proposals
                </Link>
                <Link
                  to="/view-portfolio"
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/add-portfolio") ? "text-primary" : "text-foreground"
                    }`}
                >
                   Portfolio
                </Link>
                <Link
                  to="/job-browse"
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/job-browse") ? "text-primary" : "text-foreground"
                    }`}
                >
                  Job Browsing
                </Link>
              </>
            ) : ((isLoggedIn)?
              <>
                <Link
                  to="/client-dashboard"
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/client-dashboard") ? "text-primary" : "text-foreground"
                    }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/job-posting"
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/job-posting") ? "text-primary" : "text-foreground"
                    }`}
                >
                  Post Job
                </Link>
                <Link
                  to="/my-jobs"
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/my-jobs") ? "text-primary" : "text-foreground"
                    }`}
                >
                  My Jobs
                </Link>
              </>:<></>
            )}




          </div>

          <div className="hidden md:flex items-center gap-3">
            {
              !isLoggedIn &&
              <>

                <Link to="/auth">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button variant="hero">Get Started</Button>
                </Link>
              </>
            }{
              isLoggedIn &&
              <>
                {/* Enhanced Notifications Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="relative rounded-full hover:bg-primary/10 hover:border-primary/50 transition-all">
                      <Bell className="w-5 h-5" />
                      {notifications.filter(n => n.unread).length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center shadow-lg animate-pulse">
                          {notifications.filter(n => n.unread).length}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-96 bg-gradient-to-br from-card/95 via-card/90 to-card/95 backdrop-blur-xl border border-border/30 shadow-2xl">
                    <DropdownMenuLabel className="text-lg font-bold flex items-center gap-2 pb-3">
                      <Bell className="w-5 h-5 text-primary" />
                      Notifications
                      {notifications.filter(n => n.unread).length > 0 && (
                        <Badge variant="default" className="ml-auto">
                          {notifications.filter(n => n.unread).length} new
                        </Badge>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => {
                        const getIcon = () => {
                          switch (notif.icon) {
                            case 'users': return <Users className="w-4 h-4" />;
                            case 'briefcase': return <Briefcase className="w-4 h-4" />;
                            case 'calendar': return <Calendar className="w-4 h-4" />;
                            case 'clock': return <Clock className="w-4 h-4" />;
                            case 'checkCircle': return <CheckCircle className="w-4 h-4" />;
                            case 'target': return <Target className="w-4 h-4" />;
                            case 'award': return <Award className="w-4 h-4" />;
                            default: return <Bell className="w-4 h-4" />;
                          }
                        };

                        const getColorClass = () => {
                          switch (notif.color) {
                            case 'purple': return 'bg-purple-500/10 border-purple-500/20 text-purple-600';
                            case 'green': return 'bg-green-500/10 border-green-500/20 text-green-600';
                            case 'blue': return 'bg-blue-500/10 border-blue-500/20 text-blue-600';
                            case 'primary': return 'bg-primary/10 border-primary/20 text-primary';
                            default: return 'bg-muted/50 border-border/30 text-muted-foreground';
                          }
                        };

                        return (
                          <DropdownMenuItem key={notif.id} asChild>
                            <Link
                              to={notif.link}
                              onClick={() => {
                                if (typeof notif.id === 'string' && notif.unread) {
                                  markAsRead(notif.id);
                                }
                              }}
                              className={`flex items-start gap-3 p-4 cursor-pointer transition-all hover:bg-primary/5 ${
                                notif.unread ? 'bg-gradient-to-r from-primary/10 to-accent/5 border-l-2 border-primary' : ''
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-full ${getColorClass()} flex items-center justify-center shrink-0 shadow-sm`}>
                                {getIcon()}
                              </div>
                              <div className="flex-1 space-y-1">
                                <p className={`text-sm leading-relaxed ${notif.unread ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                                  {notif.text}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">{notif.time}</span>
                                  {notif.unread && (
                                    <Badge variant="outline" className="text-xs px-2 py-0 h-5">New</Badge>
                                  )}
                                </div>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </div>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Button variant="ghost" className="w-full text-sm hover:bg-primary/10 hover:text-primary font-medium">
                        View All Notifications
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile Avatar */}
                <Link to={isFreelancer ? "/freelancer-profile" : "/client-profile"}>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                        {userData?.username?.charAt(0).toUpperCase() || (isFreelancer ? "F" : "C")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </Link>

                <button onClick={() => signOut()}>
                  <Button variant="ghost">Log out</Button>
                </button>
              </>
            }
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border/50 bg-background/40 backdrop-blur-lg">
            <Link to="/" className="block py-2 text-sm font-medium hover:text-primary transition-colors">Home</Link>
            <Link to="/skills" className="block py-2 text-sm font-medium hover:text-primary transition-colors">Skills</Link>
            {
              isLoggedIn && isFreelancer ? (
                <>
                  <Link to="/freelancer-dashboard" className="block py-2 text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
                  <Link to="/freelancer-profile" className="block py-2 text-sm font-medium hover:text-primary transition-colors">Profile</Link>
                  <Link to="/view-portfolio" className="block py-2 text-sm font-medium hover:text-primary transition-colors">Portfolio</Link>
                  <Link to="/job-browse" className="block py-2 text-sm font-medium hover:text-primary transition-colors">Job Browsing</Link>
                </>
              ) : isLoggedIn && !isFreelancer ? (
                <>
                  <Link to="/client-dashboard" className="block py-2 text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
                  <Link to="/job-posting" className="block py-2 text-sm font-medium hover:text-primary transition-colors">Post Job</Link>
                  <Link to="/my-jobs" className="block py-2 text-sm font-medium hover:text-primary transition-colors">My Jobs</Link>
                </>
              ) : (
                <>
            <Link to="/auth" className="block">
              <Button variant="hero" className="w-full">Get Started</Button>
            </Link>
                
                </>
              )
           }
          </div>
        )}
      </div>
    </nav>
  );
};
