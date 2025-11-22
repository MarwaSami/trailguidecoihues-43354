import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { baseURL } from "./AuthContext";

// Define the profile structure
export interface Profile {
  id?: number;
  skills: string[];
  experience_years: number;
  hourly_rate: string;
  portfolio_website: string;
  preferred_location: string;
  job_type: string;
  linked_in_profile: string;
  github_profile: string;
  category: string;
  cv: string;
  score?: number;
}

export interface CvUploadedResponse {
  is_success: boolean;
  detail: string;
  profile: Profile;
}

interface ProfileformContextType {
  profile: Profile | null;
  setProfile: (data: Profile) => void;
}

const ProfileformContext = createContext<ProfileformContextType | undefined>(undefined);

export const ProfileformProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>({
  skills: [],
  experience_years: 0,
  hourly_rate: "",
  portfolio_website: "",
  preferred_location: "",
  job_type: "",
  linked_in_profile: "",
  github_profile: "",
  category: "",
  cv: "",
  });

  return (
    <ProfileformContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileformContext.Provider>
  );
};

export const useProfileData = () => {
  const context = useContext(ProfileformContext);
  if (!context) {
    throw new Error("useProfileData must be used within a ProfileformProvider");
  }
  return context;
};

// Upload CV function
export const uploadCvTodb = async (
  file: File,
  user_id: number,
  token: string
): Promise<CvUploadedResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  console.log(token);  
  const response = await axios.post(`${baseURL}users/upload-cv/${user_id}/`, formData, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  console.log("Uploaded profile:", response.data);

  return response.data as CvUploadedResponse;
};

export const AddProfileinDB = async (profile: Profile, token: string, user_id: number): Promise<{data: Profile, is_success: boolean}> => {
  console.log(profile);
  const response = await axios.post<{data: Profile, is_success: boolean}>(`${baseURL}jobs/freelancer-profiles/`, profile, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchProfileById = async (profileId: string, token: string): Promise<Profile> => {
  const response = await axios.get<Profile>(`${baseURL}jobs/freelancer-profiles/${profileId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};