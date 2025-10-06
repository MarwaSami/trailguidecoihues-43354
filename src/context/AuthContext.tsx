import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios'; // Import axios for API calls
import { useToast } from '@/hooks/use-toast';
import { ca } from 'date-fns/locale';
import { log } from 'console';

interface AuthContextType {
  user: any | null; // Adjusted to `any` since the user structure may differ
  session: any | null; // Adjusted to `any` since session structure may differ
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, linkedinprofile: string, role: 'freelancer' | 'client') => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signInWithGoogle: () => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch the current session from the API
    const fetchSession = async () => {
      try {
        const response = await axios.get('http://localhost:2000/session', { withCredentials: true });
        const { user, session } = response.data;
        setUser(user);
        setSession(session);
      } catch (error) {
        console.error('Failed to fetch session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);
const baseURL = 'http://localhost:2000'; // Replace with your API base URL

const signUp = async (email: string, password: string, fullName: string,linkedinprofile:'', role: 'freelancer' | 'client'): Promise<{ error: any | null }> => {
  try {
    console.log("Signing up with", { email, password, fullName, role });

    const response = await axios.post(
     ` ${baseURL}/signup`,
      { email, password, fullName,linkedinprofile, role },
      { withCredentials: true }
    );
    const { user, session } = response.data;
    setUser(user);
    setSession(session);
    return { error: null };
  } catch (error: any) {
    toast({
      title: "Signup failed",
      description: error.response?.data?.message || "An error occurred.",
      variant: "destructive"
    });
    return { error };
  }
};

  const signIn = async (email: string, password: string) => {
    try {
      const response = await axios.post(
       ` ${baseURL}/login`,
        { email, password },
        { withCredentials: true }
      );

      const { user, session } = response.data;
      setUser(user);
      setSession(session);

      toast({
        title: "Login successful",
        description: "You are now logged in."
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "An error occurred.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    // Placeholder for Google sign-in logic
    toast({
      title: "Google sign-in not implemented",
      description: "Google sign-in functionality is not implemented for this API.",
      variant: "destructive"
    });
    return { error: null };
  };

  const signOut = async () => {
    try {
     await axios.post(`${baseURL}/logout`, {}, { withCredentials: true });
      setUser(null);
      setSession(null);

      toast({
        title: "Signed out successfully"
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.response?.data?.message || "An error occurred.",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};