// import { Navbar } from "@/components/Navbar";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { baseURL } from "@/context/AuthContext";
// import { useAuth } from "@/context/AuthContext";
// import { Loader2, Mail, Phone, FileText, CheckCircle, XCircle } from "lucide-react";

// interface Applicant {
//   id: number;
//   user: {
//     id: number;
//     username: string;
//     email: string;
//     phone_number?: string;
//   };
//   proposal_text: string;
//   status: 'pending' | 'accepted' | 'rejected';
//   submitted_at: string;
//   freelancer_profile?: {
//     bio?: string;
//     skills?: Array<{ name: string }>;
//   };
// }

// const ViewApplicants = () => {
//   const { jobId } = useParams<{ jobId: string }>();
//   const { token } = useAuth();
//   const [applicants, setApplicants] = useState<Applicant[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchApplicants = async () => {
//       if (!jobId || !token) return;

//       try {
//         setLoading(true);
//         const response = await axios.get(`${baseURL}jobs/job-applications/${jobId}/`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         setApplicants(response.data);
//       } catch (err: any) {
//         setError(err.response?.data?.message || "Failed to fetch applicants");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchApplicants();
//   }, [jobId, token]);

//   const updateApplicationStatus = async (applicationId: number, status: 'accepted' | 'rejected') => {
//     try {
//       await axios.patch(`${baseURL}jobs/job-applications/${applicationId}/`, {
//         status
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       // Update local state
//       setApplicants(prev => prev.map(app =>
//         app.id === applicationId ? { ...app, status } : app
//       ));
//     } catch (err: any) {
//       console.error("Failed to update application status", err);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <div className="flex items-center justify-center h-screen">
//           <Loader2 className="w-8 h-8 animate-spin text-primary" />
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <div className="container mx-auto px-4 pt-24 pb-12">
//           <Card className="border-destructive">
//             <CardContent className="pt-6">
//               <p className="text-destructive">{error}</p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <main className="container mx-auto px-4 pt-24 pb-12">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold mb-2">Job Applicants</h1>
//           <p className="text-muted-foreground">Review and manage applications for your job posting</p>
//         </div>

//         {applicants.length === 0 ? (
//           <Card>
//             <CardContent className="pt-6 text-center">
//               <p className="text-muted-foreground">No applicants yet for this job.</p>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="space-y-4">
//             {applicants.map((applicant) => (
//               <Card key={applicant.id} className="shadow-card">
//                 <CardHeader>
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-center gap-4">
//                       <Avatar className="w-12 h-12">
//                         <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
//                           {applicant.user.username.charAt(0).toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <CardTitle className="text-xl">{applicant.user.username}</CardTitle>
//                         <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                           <span className="flex items-center gap-1">
//                             <Mail className="w-4 h-4" />
//                             {applicant.user.email}
//                           </span>
//                           {applicant.user.phone_number && (
//                             <span className="flex items-center gap-1">
//                               <Phone className="w-4 h-4" />
//                               {applicant.user.phone_number}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     <Badge
//                       variant={
//                         applicant.status === 'accepted' ? 'default' :
//                         applicant.status === 'rejected' ? 'destructive' : 'secondary'
//                       }
//                     >
//                       {applicant.status}
//                     </Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div>
//                     <h4 className="font-semibold mb-2 flex items-center gap-2">
//                       <FileText className="w-4 h-4" />
//                       Proposal
//                     </h4>
//                     <p className="text-muted-foreground">{applicant.proposal_text}</p>
//                   </div>

//                   {applicant.freelancer_profile?.bio && (
//                     <div>
//                       <h4 className="font-semibold mb-2">Bio</h4>
//                       <p className="text-muted-foreground">{applicant.freelancer_profile.bio}</p>
//                     </div>
//                   )}

//                   {applicant.freelancer_profile?.skills && applicant.freelancer_profile.skills.length > 0 && (
//                     <div>
//                       <h4 className="font-semibold mb-2">Skills</h4>
//                       <div className="flex flex-wrap gap-2">
//                         {applicant.freelancer_profile.skills.map((skill, idx) => (
//                           <Badge key={idx} variant="outline">
//                             {skill.name}
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   <div className="flex items-center justify-between pt-4 border-t">
//                     <span className="text-sm text-muted-foreground">
//                       Applied on {new Date(applicant.submitted_at).toLocaleDateString()}
//                     </span>
//                     {applicant.status === 'pending' && (
//                       <div className="flex gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => updateApplicationStatus(applicant.id, 'accepted')}
//                           className="flex items-center gap-2 text-green-600 hover:text-green-700"
//                         >
//                           <CheckCircle className="w-4 h-4" />
//                           Accept
//                         </Button>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => updateApplicationStatus(applicant.id, 'rejected')}
//                           className="flex items-center gap-2 text-red-600 hover:text-red-700"
//                         >
//                           <XCircle className="w-4 h-4" />
//                           Reject
//                         </Button>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ViewApplicants;