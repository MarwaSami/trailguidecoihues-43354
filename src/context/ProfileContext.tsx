import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { baseURL } from "./AuthContext";
import { log, profile } from "console";
import { boolean } from "zod/v4";

// Define the profile structure
export interface Profile {
  skills: string[];
  experience_years: number;
  hourly_rate: number;
  job_type: string;
  portfolio_website: string;
  linkedin_profile: string;
  github_profile: string;
  score: number;
  categories_of_expertise:string;
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
  hourly_rate: 0,
  job_type: "",
  portfolio_website: "",
  linkedin_profile: "",
  github_profile: "",
  score: 0,
  categories_of_expertise:""
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

  return response.data as CvUploadedResponse;
};

export  interface AddProfileResponce{
  is_success:boolean,
  score:number,
  detail:string
}
export const AddProfileinDB=async (profile:Profile,token,user_id)=>{
  console.log(profile)
  const response = await axios.post<AddProfileResponce>(`${baseURL}jobs/freelancer-profiles/`, profile, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data as AddProfileResponce;

}