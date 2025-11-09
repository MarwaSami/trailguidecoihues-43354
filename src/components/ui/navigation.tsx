import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  BrainCircuit,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/corporate",
    icon: BarChart3,
  },
  {
    name: "Job Management",
    href: "/corporate/jobs",
    icon: FileText,
  },
  {
    name: "Candidates",
    href: "/corporate/candidates",
    icon: Users,
  },
  {
    name: "Interviews",
    href: "/corporate/interviews",
    icon: Calendar,
  },
  {
    name: "Reports",
    href: "/corporate/reports",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/corporate/settings",
    icon: Settings,
  },
];

export function CorporateNavigation() {
  const location = useLocation();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

export function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <BrainCircuit className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                CareerAce Corporate
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="hidden sm:inline-flex">
              HR Dashboard
            </Badge>
            <Button variant="outline" size="sm">
              Switch to Applicant View
            </Button>
            <Button size="sm">
              Account
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}