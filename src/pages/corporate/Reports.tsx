import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Download,
  FileText,
  TrendingUp,
  Users,
  Clock,
  Star,
  Award,
  Calendar,
} from "lucide-react";

const overallStats = [
  {
    title: "Total Hired",
    value: "24",
    change: "+15% this month",
    trend: "up",
    icon: Award,
  },
  {
    title: "Avg. Time to Hire",
    value: "18 days",
    change: "-3 days from last month",
    trend: "up",
    icon: Clock,
  },
  {
    title: "Interview Success Rate",
    value: "68%",
    change: "+5% from last month",
    trend: "up",
    icon: Star,
  },
  {
    title: "Active Pipelines",
    value: "12",
    change: "3 closing this week",
    trend: "neutral",
    icon: Users,
  },
];

const jobPerformance = [
  {
    position: "Senior Frontend Developer",
    applicants: 42,
    interviewed: 12,
    hired: 2,
    avgScore: 85,
    status: "Active",
  },
  {
    position: "Product Manager",
    applicants: 28,
    interviewed: 8,
    hired: 1,
    avgScore: 82,
    status: "Active",
  },
  {
    position: "UX Designer",
    applicants: 35,
    interviewed: 10,
    hired: 1,
    avgScore: 79,
    status: "Closed",
  },
  {
    position: "DevOps Engineer",
    applicants: 19,
    interviewed: 5,
    hired: 0,
    avgScore: 76,
    status: "Active",
  },
];

const candidateReports = [
  {
    name: "Sarah Johnson",
    position: "Senior Frontend Developer",
    overallScore: 92,
    technical: 95,
    communication: 88,
    cultural: 90,
    recommendation: "Strong Hire",
    date: "2 days ago",
  },
  {
    name: "Michael Chen",
    position: "Product Manager",
    overallScore: 88,
    technical: 85,
    communication: 92,
    cultural: 87,
    recommendation: "Hire",
    date: "3 days ago",
  },
  {
    name: "Emily Davis",
    position: "UX Designer",
    overallScore: 85,
    technical: 88,
    communication: 82,
    cultural: 85,
    recommendation: "Hire",
    date: "5 days ago",
  },
];

export default function ReportsAnalytics() {
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "Strong Hire": return "text-success";
      case "Hire": return "text-info";
      case "Maybe": return "text-warning";
      case "No Hire": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Active" ? "default" : "secondary";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into your recruitment performance
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Select defaultValue="30">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {overallStats.map((stat) => (
          <Card key={stat.title} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className={`text-xs ${
                stat.trend === 'up' ? 'text-success' : 'text-muted-foreground'
              }`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Hiring Overview</TabsTrigger>
          <TabsTrigger value="jobs">Job Performance</TabsTrigger>
          <TabsTrigger value="candidates">Candidate Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Hiring Funnel */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2" />
                  Hiring Funnel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Applications</span>
                    <span className="font-semibold">247</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Screened</span>
                    <span className="font-semibold">156 (63%)</span>
                  </div>
                  <Progress value={63} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Interviewed</span>
                    <span className="font-semibold">45 (18%)</span>
                  </div>
                  <Progress value={18} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Offers Made</span>
                    <span className="font-semibold">12 (5%)</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Hired</span>
                    <span className="font-semibold">8 (3%)</span>
                  </div>
                  <Progress value={3} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Monthly Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-accent rounded-lg">
                    <p className="text-2xl font-bold text-foreground">24</p>
                    <p className="text-sm text-muted-foreground">Hires This Month</p>
                  </div>
                  <div className="text-center p-4 bg-accent rounded-lg">
                    <p className="text-2xl font-bold text-foreground">18</p>
                    <p className="text-sm text-muted-foreground">Days Avg. Time</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Quality Score Trends</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={85} className="flex-1" />
                    <span className="text-sm font-semibold">85%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Interview Success Rate</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={68} className="flex-1" />
                    <span className="text-sm font-semibold">68%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Job Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobPerformance.map((job, index) => (
                  <div key={index} className="p-4 bg-accent rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{job.position}</h3>
                        <Badge variant={getStatusColor(job.status)} className="mt-1">
                          {job.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Avg. Score</p>
                        <p className="text-xl font-bold text-foreground">{job.avgScore}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Applicants</p>
                        <p className="font-semibold text-foreground">{job.applicants}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Interviewed</p>
                        <p className="font-semibold text-foreground">{job.interviewed}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Hired</p>
                        <p className="font-semibold text-foreground">{job.hired}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Candidate Evaluations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {candidateReports.map((candidate, index) => (
                  <div key={index} className="p-4 bg-accent rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                        <p className="text-sm text-muted-foreground">{candidate.position}</p>
                        <p className="text-xs text-muted-foreground mt-1">Evaluated {candidate.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Overall Score</p>
                        <p className="text-2xl font-bold text-foreground">{candidate.overallScore}</p>
                        <p className={`text-sm font-semibold ${getRecommendationColor(candidate.recommendation)}`}>
                          {candidate.recommendation}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Technical</span>
                          <span className="font-semibold">{candidate.technical}</span>
                        </div>
                        <Progress value={candidate.technical} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Communication</span>
                          <span className="font-semibold">{candidate.communication}</span>
                        </div>
                        <Progress value={candidate.communication} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Cultural Fit</span>
                          <span className="font-semibold">{candidate.cultural}</span>
                        </div>
                        <Progress value={candidate.cultural} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        View Full Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}