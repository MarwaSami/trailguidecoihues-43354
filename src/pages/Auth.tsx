import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Mail, Lock, User, Code, Briefcase, Sparkles, PenTool, Lightbulb, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])/,
    "Password must contain at least 1 number and 1 special character"),
  role: z.enum(['freelancer', 'client'])
});

const signInSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "freelancer" as "freelancer" | "client",
  });
  
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/freelancer-dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const validation = signInSchema.safeParse({
          email: formData.email,
          password: formData.password
        });
         
        if (!validation.success) {
          toast({
            title: "Validation Error",
            description: validation.error.errors[0].message,
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        const { error } = await signIn(formData.email, formData.password);
        if (!error) {
          navigate('/freelancer-dashboard');
        }
      } else {
        const validation = signUpSchema.safeParse(formData);

        if (!validation.success) {
          toast({
            title: "Validation Error",
            description: validation.error.errors[0].message,
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.fullName,
           formData.role      
        );
        
        if (!error) {
          setIsLogin(true);
          setFormData({
            fullName: "",
            email: "",
            password: "",
            role: "freelancer",
          });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleSignIn = async () => {
  //   setIsLoading(true);
  //   await signInWithGoogle();
  //   setIsLoading(false);
  // };

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
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                    <input 
                      type="radio" 
                      name="user-type" 
                      value="freelancer" 
                      checked={formData.role === 'freelancer'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'freelancer' | 'client' })}
                      required 
                      className="text-primary" 
                    />
                    <span className="font-medium">Freelancer</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-lg border-2 border-border/50 hover:border-primary cursor-pointer transition-all">
                    <input 
                      type="radio" 
                      name="user-type" 
                      value="client" 
                      checked={formData.role === 'client'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'freelancer' | 'client' })}
                      required 
                      className="text-primary" 
                    />
                    <span className="font-medium">Client</span>
                  </label>
                </div>
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

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-base font-semibold"
              // onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </Button> */}

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
