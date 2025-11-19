import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ClientDashboard from "./pages/ClientDashboard";
import ClientProfile from "./pages/ClientProfile";
import MyJobs from "./pages/MyJobs";
import ViewApplicants from "./pages/ViewApplicants";
import FreelancerProfile from "./pages/FreelancerProfile";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import Skills from "./pages/Skills";
import JobBrowse from "./pages/JobBrowse";
import JobPosting from "./pages/JobPosting";
import InterviewPractice from "./pages/InterviewPractice";
import InterviewResults from "./pages/InterviewResults";
import CandidateDiscovery from "./pages/CandidateDiscovery";
import SkillEvaluation from "./pages/SkillEvaluation";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import { ProfileForm } from "./components/ProfileForm";
import { ProfileformProvider } from "./context/ProfileContext";
import { JobProvider } from "./context/JobContext";
import { ClientJobProvider } from "./context/ClientJobContext";
import { PortfolioProvider } from "./context/PortfolioContext";
import { InterviewProvider } from "./context/InterviewContext";
import { ApplicantProvider } from "./context/ApplicantContext";
import JobProposal from "./pages/JobProposal";
import MyProposals from "./pages/MyProposals";
import ProctoringComponent from "./components/Proctoring";
import AddPortfolio from "./pages/AddPortfolio";
import ViewPortfolio from "./pages/ViewPortfolio";
import Chat from "./pages/Chat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />

            {/* Freelancer Routes */}
            <Route path="/test" element={<InterviewProvider><InterviewPractice /></InterviewProvider>} />
            <Route path="/freelancer-dashboard" element={<JobProvider><FreelancerDashboard /></JobProvider>} />
            <Route path="/freelancer-profile" element={<ProfileformProvider><FreelancerProfile /></ProfileformProvider>} />
            <Route path="/add-portfolio" element={<PortfolioProvider><AddPortfolio /></PortfolioProvider>} />
            <Route path="/view-portfolio" element={<PortfolioProvider><ViewPortfolio /></PortfolioProvider>} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/job-browse" element={<JobProvider><JobBrowse /></JobProvider>} />
            <Route path="/interview-practice" element={<InterviewProvider><InterviewPractice /></InterviewProvider>} />
            <Route path="/interview-results" element={<InterviewProvider><InterviewResults /></InterviewProvider>} />
            <Route path="/skill-evaluation" element={<SkillEvaluation />} />
            <Route path="/job-proposal" element={<JobProvider><JobProposal /></JobProvider>} />
            <Route path="/my-proposals" element={<MyProposals />} />
            {/* Client Routes */}
            <Route path="/client-dashboard" element={<ClientJobProvider><ClientDashboard /></ClientJobProvider>} />
            <Route path="/client-profile" element={<ClientProfile />} />
            <Route path="/my-jobs" element={<ClientJobProvider><MyJobs /></ClientJobProvider>} />
            <Route path="/view-applicants/:jobId" element={<ApplicantProvider><ViewApplicants /></ApplicantProvider>} />
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
