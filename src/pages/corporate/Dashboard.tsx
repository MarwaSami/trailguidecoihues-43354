import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
} from "lucide-react";

const stats = [
  {
    title: "Active Job Postings",
    value: "12",
    change: "+2 this week",
    trend: "up",
    icon: FileText,
  },
  {
    title: "Total Applicants",
    value: "247",
    change: "+18% from last month",
    trend: "up",
    icon: Users,
  },
  {
    title: "Interviews Scheduled",
    value: "34",
    change: "8 today",
    trend: "neutral",
    icon: Calendar,
  },
  {
    title: "Hired This Month",
    value: "6",
    change: "+2 from last month",
    trend: "up",
    icon: CheckCircle,
  },
];

const recentJobs = [
  {
    title: "Senior Frontend Developer",
    department: "Engineering",
    applicants: 42,
    status: "Active",
    posted: "2 days ago",
  },
  {
    title: "Product Manager",
    department: "Product",
    applicants: 28,
    status: "Active",
    posted: "5 days ago",
  },
  {
    title: "UX Designer",
    department: "Design",
    applicants: 35,
    status: "Closed",
    posted: "1 week ago",
  },
];

const upcomingInterviews = [
  {
    candidate: "Sarah Johnson",
    position: "Senior Frontend Developer",
    time: "10:00 AM",
    type: "Technical",
  },
  {
    candidate: "Michael Chen",
    position: "Product Manager",
    time: "2:00 PM",
    type: "Behavioral",
  },
  {
    candidate: "Emily Davis",
    position: "UX Designer",
    time: "4:00 PM",
    type: "Portfolio Review",
  },
];

export default function CorporateDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Corporate Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your hiring pipeline and track recruitment performance
          </p>
        </div>
        <Button className="bg-gradient-primary shadow-elegant">
          <Plus className="h-4 w-4 mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Job Postings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Job Postings
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentJobs.map((job, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-accent rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.department}</p>
                  <p className="text-sm text-muted-foreground">{job.posted}</p>
                </div>
                <div className="text-right space-y-2">
                  <Badge variant={job.status === 'Active' ? 'default' : 'secondary'}>
                    {job.status}
                  </Badge>
                  <p className="text-sm font-medium text-foreground">
                    {job.applicants} applicants
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Interviews */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Today's Interviews
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingInterviews.map((interview, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-accent rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground">{interview.candidate}</h3>
                  <p className="text-sm text-muted-foreground">{interview.position}</p>
                  <Badge variant="outline" className="text-xs">
                    {interview.type}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm font-medium text-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {interview.time}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    Join Interview
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <FileText className="h-6 w-6" />
              <span>Create Job Posting</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span>Review Applications</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Calendar className="h-6 w-6" />
              <span>Schedule Interview</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}