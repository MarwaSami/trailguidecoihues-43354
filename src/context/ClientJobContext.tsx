import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import { baseURL } from "./AuthContext";

export interface ClientJob {
  id: number;
  title: string;
  description: string;
  budget: string;
  location: string;
  job_type: string;
  experience_level: string;
  status: string;
  created_at: string;
  updated_at: string;
  ai_generated_criteria: any | null;
  client: number;
  required_skills: Array<{ id: number; name: string }>;
}

interface ClientJobContextType {
  jobs: ClientJob[];
  loading: boolean;
  error: string | null;
  refetchJobs: () => Promise<void>;
}

export const ClientJobContext = createContext<ClientJobContextType | undefined>(undefined);

export const ClientJobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<ClientJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Please login to view jobs");
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${baseURL}jobs/jobs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setJobs(response.data);
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        setJobs(response.data.results);
      } else {
        setJobs([]);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.detail || 
                          "Failed to fetch jobs.";
      setError(errorMessage);
      console.error("Error fetching client jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <ClientJobContext.Provider value={{ jobs, loading, error, refetchJobs: fetchJobs }}>
      {children}
    </ClientJobContext.Provider>
  );
};

export const useClientJobs = () => {
  const context = useContext(ClientJobContext);
  if (context === undefined) {
    throw new Error("useClientJobs must be used within a ClientJobProvider");
  }
  return context;
};
