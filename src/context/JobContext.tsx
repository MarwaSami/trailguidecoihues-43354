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
  interview_availability?: boolean;
  proposal_status?: string;
}
export enum proposal_status{
  DRAFTED="DRAFTED",
  SUBMITTED="SUBMITTED",
  ACCEPTED="ACCEPTED",
  REJECTED="REJECTED"
}

interface JobContextType {
  jobs: allfreelancerJobs[];
  loading: boolean;
  error: string | null;
  refetchJobs: () => Promise<void>;
}

export const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {

  const [jobs, setJobs] = useState<allfreelancerJobs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
   //   console.log("Using token:", token);
      if (!token) {
        console.log("error");
        
        setError("Please login to view jobs");
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${baseURL}jobs/jobs/matched-jobs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Fetched jobs:", response.data);
      if (response.data && Array.isArray(response.data)) {
        setJobs(response.data);
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        // response.data.results is already an array, pass it directly
        
        
        setJobs(response.data.results);
      } else {
        setJobs([]);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.detail || 
                          "Failed to fetch jobs. Please check your backend connection.";
      setError(errorMessage);
      console.error("Error fetching jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
      console.log("Using token:", token);   
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
