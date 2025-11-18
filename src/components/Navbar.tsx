import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, LogOut, Menu, Bell } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, token, signOut } = useAuth();

  // Parse user from localStorage if it's a string
  const userData = user ? (typeof user === 'string' ? JSON.parse(user) : user) : null;
  const isFreelancer = userData?.user_type === "freelancer";
  const isActive = (path: string) => location.pathname === path;
  const isLoggedIn = token != null;

  const notifications = [
    { id: 1, text: "New application for Senior Developer position", time: "5m ago", link: "/candidate-discovery", unread: true },
    { id: 2, text: "Interview scheduled with candidate tomorrow", time: "1h ago", link: "/candidate-discovery", unread: true },
    { id: 3, text: "Job posting approved and published", time: "3h ago", link: "/job-posting", unread: false },
    { id: 4, text: "Freelancer submitted final deliverables", time: "1d ago", link: "/client-dashboard", unread: false },
  ];
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
                  to="/freelancer-profile"
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/freelancer-profile") ? "text-primary" : "text-foreground"
                    }`}
                >
                   Profile
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
                {/* Notifications Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="relative rounded-full">
                      <Bell className="w-5 h-5" />
                      {notifications.filter(n => n.unread).length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                          {notifications.filter(n => n.unread).length}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.map((notif) => (
                      <DropdownMenuItem key={notif.id} asChild>
                        <Link
                          to={notif.link}
                          className={`flex flex-col items-start p-3 cursor-pointer ${notif.unread ? 'bg-primary/5' : ''}`}
                        >
                          <div className="flex items-start justify-between w-full gap-2">
                            <p className={`text-sm ${notif.unread ? 'font-semibold' : ''}`}>{notif.text}</p>
                            {notif.unread && <div className="w-2 h-2 bg-primary rounded-full mt-1" />}
                          </div>
                          <span className="text-xs text-muted-foreground mt-1">{notif.time}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
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
