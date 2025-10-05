import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Code,
  Palette,
  Database,
  Cloud,
  Shield,
  Cpu,
  Search,
  TrendingUp,
  Star,
  Plus,
  Filter
} from "lucide-react";

const Skills = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      name: "Frontend Development",
      icon: Code,
      color: "primary",
      skills: [
        { name: "React.js", demand: "High", avg_rate: "$80/hr", projects: 1250 },
        { name: "Vue.js", demand: "High", avg_rate: "$75/hr", projects: 890 },
        { name: "Angular", demand: "Medium", avg_rate: "$75/hr", projects: 760 },
        { name: "TypeScript", demand: "High", avg_rate: "$85/hr", projects: 1100 },
      ],
    },
    {
      name: "Backend Development",
      icon: Database,
      color: "secondary",
      skills: [
        { name: "Node.js", demand: "High", avg_rate: "$85/hr", projects: 1450 },
        { name: "Python", demand: "High", avg_rate: "$80/hr", projects: 1320 },
        { name: "Java", demand: "Medium", avg_rate: "$75/hr", projects: 980 },
        { name: "Go", demand: "Medium", avg_rate: "$90/hr", projects: 560 },
      ],
    },
    {
      name: "UI/UX Design",
      icon: Palette,
      color: "accent",
      skills: [
        { name: "Figma", demand: "High", avg_rate: "$70/hr", projects: 950 },
        { name: "Adobe XD", demand: "Medium", avg_rate: "$65/hr", projects: 680 },
        { name: "User Research", demand: "High", avg_rate: "$75/hr", projects: 540 },
        { name: "Prototyping", demand: "High", avg_rate: "$70/hr", projects: 720 },
      ],
    },
    {
      name: "Cloud & DevOps",
      icon: Cloud,
      color: "primary",
      skills: [
        { name: "AWS", demand: "High", avg_rate: "$95/hr", projects: 1180 },
        { name: "Docker", demand: "High", avg_rate: "$85/hr", projects: 890 },
        { name: "Kubernetes", demand: "High", avg_rate: "$100/hr", projects: 670 },
        { name: "CI/CD", demand: "Medium", avg_rate: "$80/hr", projects: 540 },
      ],
    },
    {
      name: "AI & Machine Learning",
      icon: Cpu,
      color: "secondary",
      skills: [
        { name: "TensorFlow", demand: "High", avg_rate: "$110/hr", projects: 450 },
        { name: "PyTorch", demand: "High", avg_rate: "$110/hr", projects: 420 },
        { name: "NLP", demand: "High", avg_rate: "$115/hr", projects: 380 },
        { name: "Computer Vision", demand: "Medium", avg_rate: "$105/hr", projects: 340 },
      ],
    },
    {
      name: "Cybersecurity",
      icon: Shield,
      color: "accent",
      skills: [
        { name: "Penetration Testing", demand: "High", avg_rate: "$120/hr", projects: 280 },
        { name: "Security Auditing", demand: "High", avg_rate: "$115/hr", projects: 310 },
        { name: "Network Security", demand: "Medium", avg_rate: "$100/hr", projects: 250 },
        { name: "Cryptography", demand: "Medium", avg_rate: "$110/hr", projects: 190 },
      ],
    },
  ];

  const trendingSkills = [
    { name: "AI/ML", growth: "+145%" },
    { name: "React", growth: "+85%" },
    { name: "Kubernetes", growth: "+120%" },
    { name: "TypeScript", growth: "+95%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/20 backdrop-blur-md border border-border/30 shadow-[var(--shadow-glass)] mb-4">
            <TrendingUp className="w-4 h-4 text-primary animate-glow" />
            <span className="text-sm font-medium">In-Demand Skills 2024</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-4">
            Explore Skills & Expertise
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover the most sought-after skills and build your expertise with AI-powered recommendations
          </p>
        </div>

        {/* Search & Filter */}
        <Card className="p-6 mb-8 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search skills..."
                className="pl-10 h-11 bg-background/50 backdrop-blur-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="glass" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="hero" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Skill
            </Button>
          </div>
        </Card>

        {/* Trending Skills Banner */}
        <Card className="relative p-8 mb-8 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)] overflow-hidden">
          <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-5" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                <Star className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Trending This Month</h3>
                <p className="text-sm text-muted-foreground">Skills with highest demand growth</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {trendingSkills.map((skill, idx) => (
                <Badge key={idx} className="px-4 py-2 bg-gradient-to-r from-accent to-primary text-accent-foreground border-0 shadow-md">
                  {skill.name}
                  <span className="ml-2 font-bold">{skill.growth}</span>
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Skills Categories */}
        <div className="space-y-8">
          {categories.map((category, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg`}>
                  <category.icon className={`w-6 h-6 text-primary-foreground`} />
                </div>
                <h2 className="text-2xl font-bold">{category.name}</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.skills.map((skill, skillIdx) => (
                  <Card
                    key={skillIdx} 
                    className="group p-6 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-primary/50 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-400 cursor-pointer hover:-translate-y-1"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{skill.name}</h3>
                        <Badge 
                          variant={skill.demand === "High" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {skill.demand}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Avg. Rate</span>
                          <span className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{skill.avg_rate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Active Projects</span>
                          <span className="font-medium">{skill.projects}</span>
                        </div>
                      </div>

                      <Button variant="glass" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        <Card className="relative mt-12 p-12 text-center bg-background/40 backdrop-blur-2xl border border-border/50 shadow-[var(--shadow-glass)] overflow-hidden">
          <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-10" />
          <div className="max-w-2xl mx-auto relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <Cpu className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Get AI-Powered Skill Recommendations</h3>
            <p className="text-muted-foreground mb-6">
              Let our AI analyze your profile and suggest the best skills to learn based on your goals, 
              experience, and market demand.
            </p>
            <Button variant="hero" size="lg">
              Get Personalized Recommendations
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Skills;
