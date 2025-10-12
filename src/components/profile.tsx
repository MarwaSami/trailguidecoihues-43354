// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { useAuth } from "@/context/AuthContext";
// import { useToast } from "@/hooks/use-toast";
// import { Loader2, Upload } from "lucide-react";
// import { z } from "zod";
// import { uploadCVToPythonBackend, ProfileEvaluationResponse } from "@/services/pythonBackendApi";
// import { CvUploadedResponce, uploadCvTodb } from "@/context/ProfileformContext";



// export const CVUploadForm = () => {
//   const { user, token } = useAuth();
//   const { toast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [evaluating, setEvaluating] = useState(false);
//   const [evaluationResult, setEvaluationResult] = useState<ProfileEvaluationResponse | null>(null);
//     const [cv, setcv] = useState<File>();

//   useEffect(() => {
//     setLoading(false);
//     if (user) {

//       CVUploadForm();
//     }
//   }, [user]);

  


//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!cv) {
//       }
//   };

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (file.size > 5 * 1024 * 1024) {
//       toast({
//         title: "File too large",
//         description: "CV must be less than 5MB",
//         variant: "destructive"
//       });
//       return;
//     }

//     if (file.type !== 'application/pdf') {
//       toast({
//         title: "Invalid file type",
//         description: "Only PDF files are allowed",
//         variant: "destructive"
//       });
//       return;
//     }

   
//       const fileExt = file.name.split('.').pop();
//       const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
//       const filePath = `cvs/${fileName}`;
     
    
//       // Send CV to Python backend for evaluation
//       try {
//         const authToken = token || '';
//         const user_id = user?.id || 0;
//         const result:CvUploadedResponce = await uploadCvTodb(file, user_id, authToken)  
//         if(result.is_success){

//         }  
//       }
//       catch(error){
//         setUploading(false);
//         toast({
//           title: "Error uploading CV",
//           description: "There was an error uploading your CV. Please try again.",
//           variant: "destructive"
//         });
//         return;
//       }
// }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
  
//     </form>
//   );
// }