import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerProfile from "./pages/FreelancerProfile";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import Skills from "./pages/Skills";
import JobBrowse from "./pages/JobBrowse";
import JobPosting from "./pages/JobPosting";
import InterviewPractice from "./pages/InterviewPractice";
import CandidateDiscovery from "./pages/CandidateDiscovery";
import SkillEvaluation from "./pages/SkillEvaluation";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import { ProfileForm } from "./components/ProfileForm";
import { ProfileformProvider } from "./context/ProfileContext";
import { JobProvider } from "./context/JobContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
       <ProfileformProvider>
        <JobProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Freelancer Routes */}
                <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
                <Route path="/freelancer-profile" element={<FreelancerProfile />} />
                <Route path="/job-browse" element={<JobBrowse />} />
                <Route path="/interview-practice" element={<InterviewPractice />} />
                <Route path="/skill-evaluation" element={<SkillEvaluation />} />
                
                {/* Client Routes */}
                <Route path="/client-dashboard" element={<ClientDashboard />} />
                <Route path="/job-posting" element={<JobPosting />} />
                <Route path="/candidate-discovery" element={<CandidateDiscovery />} />
                
                {/* Shared Routes */}
                <Route path="/skills" element={<Skills />} />
                <Route path="/reports" element={<Reports />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </JobProvider>
       </ProfileformProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
