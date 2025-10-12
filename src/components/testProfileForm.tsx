// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { useAuth } from "@/context/AuthContext";
// import { useToast } from "@/hooks/use-toast";
// import { Loader2 } from "lucide-react";
// import { uploadCvTodb } from "@/context/ProfileformContext";

// export const ProfileForms = () => {
//   const { user, token } = useAuth();
//   const { toast } = useToast();

//   const [uploading, setUploading] = useState(false);
//   const [cvUploaded, setCvUploaded] = useState(false);

//   const [profile, setProfile] = useState({
//     bio: "",
//     skills: "",
//     experience_years: "",
//     hourly_rate: "",
//     portfolio_url: "",
//     linkedin_url: "",
//     github_url: "",
//   });

 
//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // 1️⃣ Basic validation
//     if (file.size > 5 * 1024 * 1024) {
//       toast({
//         title: "File too large",
//         description: "CV must be less than 5MB",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (file.type !== "application/pdf") {
//       toast({
//         title: "Invalid file type",
//         description: "Only PDF files are allowed",
//         variant: "destructive",
//       });
//       return;
//     }

   
//     setUploading(true);

//     try {
//       const user_id = user?.id || 0;

//        const result = await uploadCvTodb(file, user_id, token);
//      // const result: any = { is_success: true, profile: { score: 88 } };

//       if (result.is_success) {
//         toast({
//           title: "CV Uploaded Successfully",
//           description: `Evaluation Score: ${result.profile.score}/100`,
//         });
//         setCvUploaded(true); 
//       } else {
//         throw new Error(result.detail || "Upload failed");
//       }
//     } catch (error: any) {
//       toast({
//         title: "Upload failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setUploading(false);
//     }
//   };
  
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     toast({
//       title: "Form Submitted",
//       description: "Profile saved successfully!",
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
//       {/* STEP 1: UPLOAD CV */}
//       {!cvUploaded && (
//         <div className="space-y-4">
//           <Label htmlFor="cv">Upload CV (PDF)</Label>
//           <Input
//             id="cv"
//             type="file"
//             accept=".pdf"
//             onChange={handleFileUpload}
//             disabled={uploading}
//           />

//           {uploading && (
//             <div className="flex flex-col items-center justify-center p-8 text-gray-600">
//               <Loader2 className="w-8 h-8 animate-spin mb-3" />
//               <p>Processing CV, please wait...</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* STEP 2: PROFILE FORM */}
//       {cvUploaded && (
//         <>
//           <div className="space-y-2">
//             <Label htmlFor="bio">Bio</Label>
//             <Textarea
//               id="bio"
//               value={profile.bio}
//               onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="skills">Skills</Label>
//             <Input
//               id="skills"
//               value={profile.skills}
//               onChange={(e) =>
//                 setProfile({ ...profile, skills: e.target.value })
//               }
//             />
//           </div>

//           <Button type="submit" className="w-full">
//             Save Profile
//           </Button>
//         </>
//       )}
//     </form>
//   );
// };
