import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import { baseURL } from "./AuthContext";


export interface allfreelancerJobs {
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
  client_name: string;
  required_skills: string[]; 
  match_score:number;
  
}

interface JobContextType {
  jobs: allfreelancerJobs[];
  loading: boolean;
  error: string | null;
  refetchJobs: () => Promise<void>;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<allfreelancerJobs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token") || "";
      const response = await axios.get(`${baseURL}jobs/jobs/matched-jobs/`,{
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setJobs(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch jobs");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <JobContext.Provider value={{ jobs, loading, error, refetchJobs: fetchJobs }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
};
