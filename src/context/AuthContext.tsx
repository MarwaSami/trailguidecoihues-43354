import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios'; // Import axios for API calls
import { useToast } from '@/hooks/use-toast';
import { ca } from 'date-fns/locale';
import { log } from 'console';
import { json } from 'stream/consumers';

interface AuthContextType {
  user: any | null; // Adjusted to `any` since the user structure may differ
  token: any | null; // Adjusted to `any` since session structure may differ
  loading: boolean;
  signUp: (email: string, password: string, fullName: string,  role: 'freelancer' | 'client') => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signInWithGoogle: () => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
//export const baseURL = 'https://localhost:44372'; // Replace with your API base URL
export const baseURL = 'http://localhost:8000/api/v1/'; // Replace with your API base URL

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, settoken] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch the current session from the API
    const fetchSession = async () => {
      try {
        // const response = await axios.get(`${baseURL}`, { withCredentials: true });
        const user =localStorage.getItem("user")
        const token= localStorage.getItem("token")
        // setUser(user);
        // setSession(session);
        
      } catch (error) {
        console.error('Failed to fetch session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

const signUp = async (email: string, password: string, username: string, user_type: 'freelancer' | 'client'): Promise<{ error: any | null }> => {
  try {
    console.log("Signing up with", { email, password, username, user_type });

    const response = await axios.post(
     ` ${baseURL}users/register/`,
     //not full name 
      { email, password, username, user_type },
      { withCredentials: true }
    );
    //  setuserinlocalstorage(response.data.user,response.data.token)
   toast({
      title: "Signup Sucessfullydone",
      description: "user is created",
      variant:"default"
    });
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
       ` ${baseURL}users/login/`,
        { email, password },
        { withCredentials: true }
      );
    console.log(response);
     setuserinlocalstorage(response.data.user,response.data.access,response.data.refresh)
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
    //  await axios.post(`${baseURL}/logout`, {}, { withCredentials: true });
      setUser(null);
      settoken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token")
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
  const  setuserinlocalstorage=async (user,token,refresh)=>{

      setUser(user);
      localStorage.setItem("user",JSON.stringify(user));
      settoken(token);
      localStorage.setItem("token",token)
      localStorage.setItem("refresh",refresh)
}
  return (
    <AuthContext.Provider value={{
      user,
      token,
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

