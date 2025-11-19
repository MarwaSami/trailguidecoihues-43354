import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Video,
  Plus,
  Edit,
  Play,
  Users,
  BookOpen,
  Settings,
  CheckCircle,
} from "lucide-react";

const upcomingInterviews = [
  {
    id: 1,
    candidate: "Sarah Johnson",
    position: "Senior Frontend Developer",
    date: "Today",
    time: "10:00 AM",
    duration: "60 min",
    type: "Technical",
    interviewer: "John Smith",
    status: "Confirmed",
    avatar: "SJ",
  },
  {
    id: 2,
    candidate: "Michael Chen",
    position: "Product Manager",
    date: "Today",
    time: "2:00 PM",
    duration: "45 min",
    type: "Behavioral",
    interviewer: "Jane Doe",
    status: "Confirmed",
    avatar: "MC",
  },
  {
    id: 3,
    candidate: "Emily Davis",
    position: "UX Designer",
    date: "Tomorrow",
    time: "11:00 AM",
    duration: "90 min",
    type: "Portfolio Review",
    interviewer: "Mike Wilson",
    status: "Pending",
    avatar: "ED",
  },
];

const interviewTemplates = [
  {
    id: 1,
    name: "Frontend Developer - Technical",
    type: "Technical",
    duration: "60 min",
    questions: 15,
    skills: ["JavaScript", "React", "CSS", "Problem Solving"],
  },
  {
    id: 2,
    name: "Product Manager - Behavioral",
    type: "Behavioral",
    duration: "45 min",
    questions: 12,
    skills: ["Leadership", "Strategy", "Communication", "Analytics"],
  },
  {
    id: 3,
    name: "UX Designer - Portfolio",
    type: "Portfolio Review",
    duration: "90 min",
    questions: 8,
    skills: ["Design Thinking", "User Research", "Prototyping", "Visual Design"],
  },
];

const completedInterviews = [
  {
    id: 1,
    candidate: "Alex Thompson",
    position: "Backend Developer",
    date: "Yesterday",
    time: "3:00 PM",
    type: "Technical",
    score: 85,
    status: "Completed",
    recommendation: "Hire",
    avatar: "AT",
  },
  {
    id: 2,
    candidate: "Lisa Wang",
    position: "Data Scientist",
    date: "2 days ago",
    time: "1:00 PM",
    type: "Technical",
    score: 92,
    status: "Completed",
    recommendation: "Strong Hire",
    avatar: "LW",
  },
];

export default function InterviewManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "default";
      case "Pending": return "secondary";
      case "Completed": return "outline";
      default: return "secondary";
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "Strong Hire": return "text-success";
      case "Hire": return "text-info";
      case "Maybe": return "text-warning";
      case "No Hire": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interview Management</h1>
          <p className="text-muted-foreground mt-1">
            Schedule, conduct, and manage interviews with AI assistance
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary shadow-elegant">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white border border-border shadow-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Interview</DialogTitle>
              <DialogDescription>
                Create a new interview session for a candidate
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="candidate">Candidate</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select candidate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah Johnson</SelectItem>
                      <SelectItem value="michael">Michael Chen</SelectItem>
                      <SelectItem value="emily">Emily Davis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interviewer">Interviewer</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Smith</SelectItem>
                      <SelectItem value="jane">Jane Doe</SelectItem>
                      <SelectItem value="mike">Mike Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template">Interview Template</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend Developer - Technical</SelectItem>
                    <SelectItem value="product">Product Manager - Behavioral</SelectItem>
                    <SelectItem value="design">UX Designer - Portfolio</SelectItem>
                    <SelectItem value="custom">Custom Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  Schedule Interview
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming Interviews</TabsTrigger>
          <TabsTrigger value="templates">Interview Templates</TabsTrigger>
          <TabsTrigger value="completed">Completed Interviews</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid gap-4">
            {upcomingInterviews.map((interview) => (
              <Card key={interview.id} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {interview.avatar}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {interview.candidate}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {interview.position}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {interview.date}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {interview.time} ({interview.duration})
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {interview.interviewer}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{interview.type}</Badge>
                        <Badge variant={getStatusColor(interview.status)}>
                          {interview.status}
                        </Badge>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Start Interview
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Interview Templates</h3>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviewTemplates.map((template) => (
              <Card key={template.id} className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    {template.name}
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="outline">{template.type}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{template.duration}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Questions:</span>
                    <span>{template.questions}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Skills Assessed:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full" variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="grid gap-4">
            {completedInterviews.map((interview) => (
              <Card key={interview.id} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {interview.avatar}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {interview.candidate}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {interview.position}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {interview.date}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {interview.time}
                          </span>
                          <Badge variant="outline">{interview.type}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Interview Score</p>
                          <p className="text-2xl font-bold text-foreground">{interview.score}/100</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Recommendation:</p>
                        <p className={`font-semibold ${getRecommendationColor(interview.recommendation)}`}>
                          {interview.recommendation}
                        </p>
                      </div>
                      
                      <Button size="sm" variant="outline">
                        View Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}