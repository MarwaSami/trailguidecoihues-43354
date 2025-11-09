import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Settings as SettingsIcon,
  Users,
  Filter,
  Bell,
  Building2,
  Plus,
  X,
} from "lucide-react";

export default function Settings() {
  const [skills, setSkills] = useState(["JavaScript", "React", "Python", "AWS"]);
  const [newSkill, setNewSkill] = useState("");
  const [notifications, setNotifications] = useState({
    newApplications: true,
    interviewReminders: true,
    candidateUpdates: false,
    weeklyReports: true,
  });

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your recruitment preferences and evaluation criteria
          </p>
        </div>
      </div>

      <Tabs defaultValue="evaluation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="evaluation">Evaluation Criteria</TabsTrigger>
          <TabsTrigger value="company">Company Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="team">Team Management</TabsTrigger>
        </TabsList>

        <TabsContent value="evaluation" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Scoring Weights */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Scoring Weights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="technical">Technical Skills</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="technical"
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="40"
                      className="flex-1"
                    />
                    <span className="text-sm font-semibold w-12">40%</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="communication">Communication</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="communication"
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="25"
                      className="flex-1"
                    />
                    <span className="text-sm font-semibold w-12">25%</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="experience">Experience</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="experience"
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="20"
                      className="flex-1"
                    />
                    <span className="text-sm font-semibold w-12">20%</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="cultural">Cultural Fit</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="cultural"
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="15"
                      className="flex-1"
                    />
                    <span className="text-sm font-semibold w-12">15%</span>
                  </div>
                </div>
                
                <Button className="w-full">Save Scoring Weights</Button>
              </CardContent>
            </Card>

            {/* Skills Database */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Skills Database</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add new skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button onClick={() => removeSkill(skill)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="autoSkills">Auto-extract skills from job descriptions</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="autoSkills" defaultChecked />
                    <span className="text-sm text-muted-foreground">Enabled</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interview Templates Configuration */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Default Interview Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultDuration">Default Interview Duration</Label>
                  <Select defaultValue="60">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aiAssistance">AI Interview Assistance</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="aiAssistance" defaultChecked />
                    <span className="text-sm text-muted-foreground">Enable AI suggestions</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recordingEnabled">Interview Recording</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="recordingEnabled" defaultChecked />
                    <span className="text-sm text-muted-foreground">Auto-record interviews</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transcription">Auto Transcription</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="transcription" defaultChecked />
                    <span className="text-sm text-muted-foreground">Generate transcripts</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="TechCorp Inc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select defaultValue="technology">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  defaultValue="We are a leading technology company focused on innovation and excellence..."
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="https://techcorp.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Company Size</Label>
                  <Select defaultValue="100-500">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-100">51-100 employees</SelectItem>
                      <SelectItem value="100-500">100-500 employees</SelectItem>
                      <SelectItem value="500+">500+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button>Update Company Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">New Applications</h3>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new candidates apply
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newApplications}
                    onCheckedChange={(value) => handleNotificationChange('newApplications', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Interview Reminders</h3>
                    <p className="text-sm text-muted-foreground">
                      Reminders 30 minutes before interviews
                    </p>
                  </div>
                  <Switch
                    checked={notifications.interviewReminders}
                    onCheckedChange={(value) => handleNotificationChange('interviewReminders', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Candidate Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      Status changes and interview completions
                    </p>
                  </div>
                  <Switch
                    checked={notifications.candidateUpdates}
                    onCheckedChange={(value) => handleNotificationChange('candidateUpdates', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Weekly Reports</h3>
                    <p className="text-sm text-muted-foreground">
                      Summary of hiring activities and metrics
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(value) => handleNotificationChange('weeklyReports', value)}
                  />
                </div>
              </div>
              
              <Button>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Team Members
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                  <div>
                    <h3 className="font-medium">John Smith</h3>
                    <p className="text-sm text-muted-foreground">john.smith@company.com</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">Admin</Badge>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                  <div>
                    <h3 className="font-medium">Jane Doe</h3>
                    <p className="text-sm text-muted-foreground">jane.doe@company.com</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Interviewer</Badge>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                  <div>
                    <h3 className="font-medium">Mike Wilson</h3>
                    <p className="text-sm text-muted-foreground">mike.wilson@company.com</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Recruiter</Badge>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}