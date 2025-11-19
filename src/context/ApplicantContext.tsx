import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import axios from 'axios';
import { baseURL } from '../context/AuthContext';

interface ApplicantContextType {
  candidates: Candidate[];
  fetchCandidates: (jobId: number) => Promise<void>;
  loading: boolean;
}
 interface Candidate {
  freelancer_name: string;
  freelancer_location: string;
  exprience_level: number;
  skills: string[];
  hourly_rate: number;
  ai_match_score: number;
  duration: number;
  proposal_id: number;
  freelancer_id: number;
  interview_score: number;
  proposal_status?: string;
}

/**
 * Fetch job proposals (candidates) for a job
 * Endpoint: POST /jobs/job-proposals
 */
export async function fetchJobProposals(jobId: number): Promise<Candidate[]> {
  const response = await axios.post(`${baseURL}jobs/job-proposals/`, { job_id: jobId }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
    },
  });
 // console.log('Fetch Job Proposals Response:', response.data);

  return response.data;
}
const ApplicantContext = createContext<ApplicantContextType | undefined>(undefined);

export const ApplicantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCandidates =  useCallback(async (jobId: number) => {
    setLoading(true);
    try {
      const data = await fetchJobProposals(jobId);
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ApplicantContext.Provider value={{ candidates, fetchCandidates, loading }}>
      {children}
    </ApplicantContext.Provider>
  );
};

export const useApplicants = () => {
  const context = useContext(ApplicantContext);
  if (!context) {
    throw new Error('useApplicants must be used within an ApplicantProvider');
  }
  return context;
};
