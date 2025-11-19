import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, RefreshCw } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  
  const userData = user ? (typeof user === 'string' ? JSON.parse(user) : user) : null;
  const userType = userData?.user_type || 'freelancer';

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    const generateImage = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('generate-404-image', {
          body: { userType }
        });

        if (error) {
          console.error('Error generating image:', error);
        } else if (data?.imageUrl) {
          setImageUrl(data.imageUrl);
        }
      } catch (err) {
        console.error('Failed to generate 404 image:', err);
      } finally {
        setLoading(false);
      }
    };

    generateImage();
  }, [location.pathname, userType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        <div className="bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 p-8 md:p-12 animate-fade-in">
          <div className="text-center space-y-8">
            {/* 404 Number */}
            <div className="relative">
              <h1 className="text-[180px] md:text-[240px] font-bold leading-none bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent animate-scale-in">
                404
              </h1>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl -z-10 animate-pulse" />
            </div>

            {/* Cartoon Image */}
            <div className="flex justify-center my-8">
              {loading ? (
                <div className="w-80 h-80 flex items-center justify-center">
                  <LoadingSpinner size="lg" message="Creating your custom illustration..." />
                </div>
              ) : imageUrl ? (
                <div className="relative group">
                  <img 
                    src={imageUrl} 
                    alt="404 illustration" 
                    className="w-80 h-80 object-contain animate-fade-in hover-scale transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ) : (
                <div className="w-80 h-80 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl">
                  <p className="text-muted-foreground text-center px-4">
                    Oops! We couldn't load the illustration
                  </p>
                </div>
              )}
            </div>

            {/* Message */}
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Oops! Page Not Found
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {userType === 'freelancer' 
                  ? "Looks like this page went on a coffee break! Don't worry, let's get you back to finding amazing projects."
                  : "Seems like this page is off exploring! Let's navigate you back to discovering top talent for your projects."
                }
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 animate-fade-in">
              <Button 
                asChild 
                size="lg" 
                className="gap-2 min-w-[200px] shadow-lg hover:shadow-xl transition-shadow"
              >
                <Link to="/">
                  <Home className="w-5 h-5" />
                  Back to Home
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2 min-w-[200px]"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                className="gap-2 min-w-[200px]"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-5 h-5" />
                Refresh Page
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="mt-12 pt-8 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-4">
                Quick links to get you back on track:
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/job-browse" className="story-link text-sm text-primary hover:text-primary/80 transition-colors">
                  Browse Jobs
                </Link>
                <Link to={userType === 'freelancer' ? "/freelancer-profile" : "/client-profile"} className="story-link text-sm text-primary hover:text-primary/80 transition-colors">
                  My Profile
                </Link>
                <Link to={userType === 'freelancer' ? "/my-proposals" : "/my-jobs"} className="story-link text-sm text-primary hover:text-primary/80 transition-colors">
                  {userType === 'freelancer' ? 'My Proposals' : 'My Jobs'}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary/20 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
        <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-accent/20 rounded-full animate-bounce" style={{ animationDelay: '0.7s' }} />
      </div>
    </div>
  );
};

export default NotFound;
