import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  MapPin,
  Briefcase,
  Award,
  Star,
  TrendingUp,
  Code,
  Palette,
  Database,
  Globe,
  Mail,
  Phone,
  Edit,
  Download,
  ExternalLink
} from "lucide-react";

const FreelancerProfile = () => {
  const skills = [
    { name: "React.js", level: 95, category: "Frontend" },
    { name: "Node.js", level: 90, category: "Backend" },
    { name: "TypeScript", level: 88, category: "Languages" },
    { name: "UI/UX Design", level: 85, category: "Design" },
    { name: "PostgreSQL", level: 80, category: "Database" },
    { name: "AWS", level: 75, category: "DevOps" },
  ];

  const projects = [
    {
      title: "E-commerce Platform",
      description: "Full-stack web application with React and Node.js",
      tech: ["React", "Node.js", "MongoDB"],
      duration: "3 months",
      rating: 5,
    },
    {
      title: "Mobile Banking App",
      description: "React Native application for financial services",
      tech: ["React Native", "Redux", "Firebase"],
      duration: "4 months",
      rating: 5,
    },
    {
      title: "AI Dashboard",
      description: "Analytics dashboard with real-time data visualization",
      tech: ["React", "D3.js", "Python"],
      duration: "2 months",
      rating: 4,
    },
  ];

  const stats = [
    { label: "Projects Completed", value: "47", icon: Briefcase },
    { label: "Success Rate", value: "98%", icon: TrendingUp },
    { label: "Client Rating", value: "4.9/5", icon: Star },
    { label: "Years Experience", value: "5+", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-8 text-center bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-lg">
                  <User className="w-16 h-16 text-primary-foreground" />
                </div>
                <div className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center border-4 border-background shadow-lg">
                  <Award className="w-5 h-5 text-accent-foreground" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold mb-1">Alex Thompson</h1>
              <p className="text-muted-foreground mb-4">Full-Stack Developer</p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>

              <div className="flex gap-2 mb-6">
                <Button variant="hero" className="flex-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
                <Button variant="outline">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>alex.thompson@email.com</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <a href="#" className="text-primary hover:underline">
                    alexthompson.dev
                  </a>
                </div>
              </div>
            </Card>

            {/* Stats */}
            <Card className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
              <h2 className="text-xl font-bold mb-4">Statistics</h2>
              <div className="space-y-4">
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-background/30 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
                        <stat.icon className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <span className="text-sm">{stat.label}</span>
                    </div>
                    <span className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{stat.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button variant="glass" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </Button>
                <Button variant="glass" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Portfolio
                </Button>
                <Button variant="glass" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  View Reviews
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Content - Skills & Projects */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card className="p-8 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
              <h2 className="text-2xl font-bold mb-4">About Me</h2>
              <p className="text-muted-foreground leading-relaxed">
                Passionate full-stack developer with 5+ years of experience building scalable web applications. 
                Specialized in React, Node.js, and cloud technologies. I love turning complex problems into 
                simple, beautiful solutions. When I'm not coding, you'll find me contributing to open-source 
                projects or mentoring junior developers.
              </p>
            </Card>

            {/* Skills */}
            <Card className="p-8 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Skills & Expertise</h2>
                <Button variant="glass" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Skills
                </Button>
              </div>

              <div className="space-y-6">
                {skills.map((skill, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{skill.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {skill.category}
                        </Badge>
                      </div>
                      <span className="text-sm font-bold text-primary">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border">
                {["JavaScript", "Python", "Docker", "Git", "REST APIs", "GraphQL", "Agile", "TDD"].map((tech, idx) => (
                  <Badge key={idx} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Portfolio Projects */}
            <Card className="p-8 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Portfolio Projects</h2>
                <Button variant="glass" size="sm">
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {projects.map((project, idx) => (
                  <Card key={idx} className="p-6 bg-background/30 backdrop-blur-md border border-border/40 hover:border-primary/40 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-400 hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold">{project.title}</h3>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < project.rating ? "fill-accent text-accent" : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {project.tech.map((tech, techIdx) => (
                            <Badge key={techIdx} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Duration: {project.duration}
                        </p>
                      </div>
                      <Button variant="glass" size="sm" className="self-start">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* AI Recommendations */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">AI Career Insights</h3>
                  <p className="text-muted-foreground mb-4">
                    Based on your profile, we've found 12 jobs that are a perfect match! 
                    Consider adding "Kubernetes" to your skills to increase your match rate by 25%. 
                    Your profile views increased 40% this week.
                  </p>
                  <Button variant="secondary">
                    View Recommended Jobs
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FreelancerProfile;
