import { FreelancerProfile } from "@/components/ProfileForm";
import axios from "axios"
import { log } from "console";
import { promises } from "dns";
export interface CvUploadedResponce{
	score: number;
	comments: string;
	cvId?: string;
	success: boolean;
	freelanceProfile: FreelancerProfile | null;
}
export const GetProfile = (userid: number): Promise<FreelancerProfile | null> => {
	//fetch profile from db
	return axios
		.get(`/profile/${userid}`)
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			console.log(err);
			return null;
		});
};
export const uploadCvTodb = async (file: File,token:string
): Promise<CvUploadedResponce> => {
	console.log("Uploading CV to backend...");
	console.log(file);
 return axios
	 .post(
		 '/uploadCv',
		 { file: file, fileType: file.type },
		 {
			 headers: {
				 Authorization: `Bearer ${token}`,
			 },
		 }
	 )
	 .then((res) => {
		 const { signedRequest, url } = res.data;
		 return axios
			 .put(signedRequest, file, {
				 headers: {
					 'Content-Type': file.type,
				 },
			 })
			 .then((res) => {
				 return res.data as CvUploadedResponce;
				 // return { score: 85, comments: "Good CV" }; // Mocked response
			 });
	 });

}
