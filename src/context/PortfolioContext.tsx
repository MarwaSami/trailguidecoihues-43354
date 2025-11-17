import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import { baseURL } from "./AuthContext";

export interface PortfolioImage {
  id: number;
  image: string;
}

export interface Portfolio {
  id?: number;
  user?: number;
  name: string;
  project_link?: string | null;
  images: PortfolioImage[] | string;
  description: string;
  created_at?: string;
}

interface PortfolioContextType {
  portfolios: Portfolio[];
  loading: boolean;
  error: string | null;
  addPortfolio: (portfolio: FormData) => Promise<{ success: boolean; error?: string }>;
  refetchPortfolios: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Please login to view portfolios");
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${baseURL}jobs/freelancer-portfolios/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (response.data && Array.isArray(response.data)) {
        setPortfolios(response.data);
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        setPortfolios(response.data.results);
      } else {
        setPortfolios([]);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.detail || 
                          "Failed to fetch portfolios. Please check your backend connection.";
      setError(errorMessage);
      console.error("Error fetching portfolios:", err);
      setPortfolios([]);
    } finally {
      setLoading(false);
    }
  };

  const addPortfolio = async (formData: FormData): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      if (!token) {
        return { success: false, error: "Please login to add portfolio" };
      }
      formData.forEach((value, key) => console.log(key, value));
      const response = await axios.post(`${baseURL}jobs/freelancer-portfolios/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Portfolio added successfully:", response.data);
      await fetchPortfolios();
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.detail || 
                          "Failed to add portfolio.";
      setError(errorMessage);
      console.error("Error adding portfolio:", err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  return (
    <PortfolioContext.Provider value={{ portfolios, loading, error, addPortfolio, refetchPortfolios: fetchPortfolios }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
