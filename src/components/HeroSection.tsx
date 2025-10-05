import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Play } from "lucide-react";

const HeroSection =() => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-subtle overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                🚀 Find Your Dream Job with 
              </div>
              
              <h1 className="text-2xl md:text-6xl font-bold leading-tight">
               <span className="text-primary bg-clip-text bg-gradient-primary">AI-Powered </span> & Matching 
                 <br />
                 <span className="text-primary bg-clip-text bg-gradient-primary">Freelancing</span>
                  Platform
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-xl">
                Connect talented freelancers with top clients through intelligent matching, automated evaluations, and seamless collaboration tools.
              </p>
            </div>
            
            {/* Key benefits */}
            <div className="space-y-3">
              {[
                "Free to start",
                "AI-driven job matching and evaluations",
                "No credit card",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="default" size="lg" className="group">
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" size="lg" className="group">
                Explore Skills
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-primary border-2 border-background"></div>
                  ))}
                </div>
                <span>Join 10,000+ Freelancers</span>
              </div>
              <div className="text-success font-medium">⭐ 4.9/5 rating</div>
            </div>
          </div>
          
          {/* Right side - Hero image */}
          <div className="relative animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative rounded-2xl overflow-hidden shadow-strong">
              <img 
                src={"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"} 
                alt="Professional interview coaching platform showing diverse professionals in modern office setting"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-primary/10"></div>
            </div>
            
            {/* Floating cards */}
            <div className="absolute -top-6 -left-6 bg-card border shadow-medium rounded-xl p-4 animate-float">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success-foreground" />
                </div>
                <div>
                  <div className="font-medium text-sm">Candidate Score</div>
                  <div className="text-xs text-muted-foreground">95% Match</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-card border shadow-medium rounded-xl p-4 animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-medium text-sm">Interview Practice</div>
                  <div className="text-xs text-muted-foreground">Practice Mode</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;