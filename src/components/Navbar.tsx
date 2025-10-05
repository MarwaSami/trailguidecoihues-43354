import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Menu } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
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
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-foreground"
              }`}
            >
              Home
            </Link>
            <Link 
              to="/skills" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/skills") ? "text-primary" : "text-foreground"
              }`}
            >
              Skills
            </Link>
            <Link 
              to="/client-dashboard" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/client-dashboard") ? "text-primary" : "text-foreground"
              }`}
            >
              For Clients
            </Link>
            <Link 
              to="/freelancer-profile" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/freelancer-profile") ? "text-primary" : "text-foreground"
              }`}
            >
              For Freelancers
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button variant="hero">Get Started</Button>
            </Link>
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
            <Link to="/client-dashboard" className="block py-2 text-sm font-medium hover:text-primary transition-colors">For Clients</Link>
            <Link to="/freelancer-profile" className="block py-2 text-sm font-medium hover:text-primary transition-colors">For Freelancers</Link>
            <Link to="/auth" className="block">
              <Button variant="hero" className="w-full">Get Started</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
