import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, Mail, Lock, User, Code, Briefcase, Sparkles, PenTool, Lightbulb, Users } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement authentication logic
    setTimeout(() => setIsLoading(false), 1000);
  };

  const categories = [
    { icon: Code, title: "Development", subtitle: "Web & Mobile Apps" },
    { icon: PenTool, title: "Design", subtitle: "UI/UX & Graphics" },
    { icon: Briefcase, title: "Business", subtitle: "Consulting & Strategy" },
    { icon: Sparkles, title: "Marketing", subtitle: "Digital & Content" },
    { icon: Lightbulb, title: "Creative", subtitle: "Writing & Video" },
    { icon: Users, title: "Support", subtitle: "Customer Service" },
  ];

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
        <div className="absolute inset-0 bg-background" />
        
        <div className="w-full max-w-md relative z-10 animate-fade-in">
          <Link to="/" className="flex items-center gap-2 mb-12 group">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg group-hover:shadow-[var(--shadow-glow)] transition-all duration-400">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Freelance
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3">Welcome back</h1>
            <p className="text-muted-foreground">
              New here?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-primary hover:underline font-medium"
              >
                Create an account
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10 h-11 bg-background/50 border-border/50 focus:bg-background transition-colors"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Enter email id
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 h-11 bg-background/50 border-border/50 focus:bg-background transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Enter password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11 bg-background/50 border-border/50 focus:bg-background transition-colors"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">I am a</Label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 p-3 rounded-lg border-2 border-border/50 hover:border-primary cursor-pointer transition-all">
                    <input type="radio" name="user-type" value="freelancer" required className="text-primary" />
                    <span className="font-medium">Freelancer</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-lg border-2 border-border/50 hover:border-primary cursor-pointer transition-all">
                    <input type="radio" name="user-type" value="client" required className="text-primary" />
                    <span className="font-medium">Client</span>
                  </label>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm cursor-pointer">
                    Remember me?
                  </Label>
                </div>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              variant="hero"
              disabled={isLoading}
            >
              {isLoading ? (isLogin ? "Signing in..." : "Creating account...") : (isLogin ? "Login" : "Create Account")}
            </Button>

            {isLogin && (
              <p className="text-center text-sm text-muted-foreground pt-4">
                Don't have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </button>
              </p>
            )}

            {!isLogin && (
              <p className="text-center text-sm text-muted-foreground pt-4">
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </form>

          <div className="mt-8 text-center text-xs text-muted-foreground">
            Copyrights © 2024 AI Freelance. Built with AI
          </div>
        </div>
      </div>

      {/* Right Side - Categories */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-90" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        
        <div className="relative z-10 w-full p-16 flex flex-col">
          <div className="grid grid-cols-2 gap-6 mb-auto">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-background/95 backdrop-blur-xl rounded-2xl p-8 border border-border/20 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] hover:scale-[1.02] transition-all duration-400 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <category.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-1">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.subtitle}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-end mt-8">
            <div className="text-center text-primary-foreground/90">
              <Sparkles className="w-12 h-12 mx-auto mb-4 animate-glow" />
              <p className="text-lg font-medium">AI-Powered Matching</p>
              <p className="text-sm opacity-80">Connect with the perfect opportunities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
