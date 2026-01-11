import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";

import { 
  Brain, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Users, 
  Briefcase,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Award
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import freelancerHappy from "@/assets/freelancer-happy.png";
import clientHappy from "@/assets/client-happy.png";
import HeroSection from "@/components/HeroSection";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-5"
          style={{ 
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/20 backdrop-blur-md border border-border/30 shadow-[var(--shadow-glass)]">
              <Sparkles className="w-4 h-4 text-primary animate-glow" />
              <span className="text-sm font-medium">SmartLance</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Find Perfect Talent,
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect top freelancers with amazing opportunities using intelligent matching, 
              automated screening, and AI-powered insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="hero" size="xl" className="gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/skills">
                <Button variant="outline" size="xl">
                  Explore Skills
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-8 pt-8 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-secondary" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-secondary" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-secondary" />
                <span>AI-powered</span>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <HeroSection />
      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-muted-foreground">
              We leverage cutting-edge AI to revolutionize how freelancers and clients connect
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group p-8 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-primary/50 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-500 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-400">
                <Brain className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Matching</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our advanced algorithms match freelancers with perfect opportunities based on skills, 
                experience, and preferences.
              </p>
            </Card>
            
            <Card className="group p-8 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-accent/50 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-500 hover:-translate-y-1 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-400">
                <Target className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Screening</h3>
              <p className="text-muted-foreground leading-relaxed">
                Automated CV filtering and skill evaluation save time and ensure quality matches 
                for every project.
              </p>
            </Card>
            
            <Card className="group p-8 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-accent/50 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-500 hover:-translate-y-1 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary via-accent to-primary-glow flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-400">
                <Sparkles className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Insights</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get personalized recommendations, performance analytics, and continuous improvement 
                suggestions.
              </p>
            </Card>
          </div>
        </div>
      </section>
      
      {/* For Freelancers & Clients */}
      <section className="py-24" id="about">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* For Freelancers */}
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="lg:w-1/2 flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-3xl blur-2xl" />
                  <img 
                    src={freelancerHappy} 
                    alt="Happy Freelancer" 
                    className="relative w-full max-w-[280px] mx-auto rounded-2xl shadow-xl"
                  />
                </div>
              </div>
              <div className="lg:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
                  <Users className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium text-secondary">For Freelancers</span>
                </div>
                
                <h2 className="text-3xl font-bold">
                  Grow Your Career with AI
                </h2>
                
                <p className="text-muted-foreground">
                  Get matched with opportunities that fit your skills, receive AI-powered interview 
                  preparation, and track your growth.
                </p>
                
                <ul className="space-y-3">
                  {[
                    "AI-powered job recommendations",
                    "Automated proposal generation",
                    "Interview practice with AI",
                    "Skill evaluation & feedback",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3 h-3 text-secondary" />
                      </div>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/freelancer-profile">
                  <Button variant="secondary" size="lg" className="gap-2 mt-4">
                    View Freelancer Features
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* For Clients */}
            <div className="flex flex-col lg:flex-row-reverse gap-8 items-center">
              <div className="lg:w-1/2 flex-shrink-0">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
                  <img 
                    src={clientHappy} 
                    alt="Happy Client" 
                    className="relative w-full max-w-[280px] mx-auto rounded-2xl shadow-xl"
                  />
                </div>
              </div>
              <div className="lg:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">For Clients</span>
                </div>
                
                <h2 className="text-3xl font-bold">
                  Hire Top Talent Faster
                </h2>
                
                <p className="text-muted-foreground">
                  Post jobs and let AI find the perfect candidates. Automated screening and 
                  intelligent ranking make hiring effortless.
                </p>
                
                <ul className="space-y-3">
                  {[
                    "Automatic Proposal filtering",
                    "AI-assisted job posting",
                    "Validated skill assessments",
                    "Candidate ranking & comparison",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/client-dashboard">
                  <Button variant="hero" size="lg" className="gap-2 mt-4">
                    View Client Features
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-10" />
        <div className="container mx-auto px-4 relative">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "50K+", label: "Active Freelancers" },
              { icon: Briefcase, value: "10K+", label: "Projects Completed" },
              { icon: Award, value: "95%", label: "Success Rate" },
              { icon: Zap, value: "24/7", label: "AI Support" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center space-y-4 p-6 rounded-2xl bg-background/30 backdrop-blur-lg border border-border/50 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-400 hover:scale-105">
                <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <stat.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden p-16 text-center bg-background/40 backdrop-blur-2xl border border-border/50 shadow-[var(--shadow-glass)]">
            <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-10" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Transform Your Career?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of freelancers and clients using AI to achieve their goals
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button variant="hero" size="xl" className="gap-2">
                    Start Free Today
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <a href="#about">
                  <Button variant="glass" size="xl">
                    Learn More
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">SmartLance</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 AI Freelance Platform. Powered by SmartLance 
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
