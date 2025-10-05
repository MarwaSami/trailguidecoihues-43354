import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Target,
  Eye,
  MessageSquare,
  Briefcase,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Zap
} from "lucide-react";

const Reports = () => {
  const keyMetrics = [
    {
      label: "Profile Performance",
      value: "92/100",
      change: "+12%",
      trend: "up",
      icon: Target,
      description: "vs last month"
    },
    {
      label: "Applications Sent",
      value: "28",
      change: "+8",
      trend: "up",
      icon: Briefcase,
      description: "this month"
    },
    {
      label: "Profile Views",
      value: "1,234",
      change: "+45%",
      trend: "up",
      icon: Eye,
      description: "vs last month"
    },
    {
      label: "Response Rate",
      value: "78%",
      change: "-5%",
      trend: "down",
      icon: MessageSquare,
      description: "vs last month"
    },
  ];

  const skillPerformance = [
    { skill: "React.js", demand: 95, growth: "+15%", jobs: 342 },
    { skill: "TypeScript", demand: 90, growth: "+22%", jobs: 298 },
    { skill: "Node.js", demand: 88, growth: "+12%", jobs: 267 },
    { skill: "AWS", demand: 85, growth: "+18%", jobs: 234 },
    { skill: "Docker", demand: 78, growth: "+25%", jobs: 189 },
  ];

  const weeklyActivity = [
    { day: "Mon", views: 45, applications: 3 },
    { day: "Tue", views: 52, applications: 5 },
    { day: "Wed", views: 38, applications: 2 },
    { day: "Thu", views: 65, applications: 4 },
    { day: "Fri", views: 48, applications: 6 },
    { day: "Sat", views: 28, applications: 1 },
    { day: "Sun", views: 32, applications: 2 },
  ];

  const aiInsights = [
    {
      title: "Optimize Profile",
      description: "Adding 'Kubernetes' could increase your match rate by 25%",
      action: "Add Skill",
      priority: "high"
    },
    {
      title: "Best Time to Apply",
      description: "You get 40% more responses when applying on Mondays",
      action: "Set Reminder",
      priority: "medium"
    },
    {
      title: "Skill Trend Alert",
      description: "Demand for 'Next.js' is growing 35% in your field",
      action: "Learn More",
      priority: "medium"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Analytics & Reports</h1>
            <p className="text-muted-foreground">Comprehensive insights into your career performance</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Last 30 Days
            </Button>
            <Button variant="hero" className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {keyMetrics.map((metric, idx) => (
            <Card key={idx} className="group p-6 bg-background/40 backdrop-blur-xl border border-border/50 hover:border-primary/50 shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-glow)] transition-all duration-400 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg group-hover:scale-110 transition-transform duration-400">
                  <metric.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  metric.trend === "up" ? "text-accent" : "text-destructive"
                }`}>
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {metric.change}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Activity */}
            <Card className="p-8 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Weekly Activity</h2>
                <Button variant="ghost" size="sm">
                  <Activity className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
              <div className="space-y-4">
                {weeklyActivity.map((day, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{day.day}</span>
                      <div className="flex gap-4 text-muted-foreground">
                        <span>{day.views} views</span>
                        <span>{day.applications} apps</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${(day.views / 65) * 100}%` }}
                      />
                      <div 
                        className="h-2 rounded-full bg-secondary"
                        style={{ width: `${(day.applications / 6) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Skill Performance */}
            <Card className="p-8 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Skill Performance</h2>
                <Button variant="ghost" size="sm">
                  <PieChart className="w-4 h-4 mr-2" />
                  Full Analysis
                </Button>
              </div>
              <div className="space-y-4">
                {skillPerformance.map((skill, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-background/30 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{skill.skill}</span>
                        <Badge variant="secondary" className="text-xs">
                          {skill.growth}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{skill.jobs} jobs</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                          style={{ width: `${skill.demand}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-primary">{skill.demand}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Comparison Chart */}
            <Card className="p-8 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
              <h2 className="text-2xl font-bold mb-6">Performance vs Industry Average</h2>
              <div className="space-y-6">
                {[
                  { metric: "Profile Completeness", you: 92, avg: 68 },
                  { metric: "Response Rate", you: 78, avg: 54 },
                  { metric: "Application Success", you: 65, avg: 42 },
                  { metric: "Skill Diversity", you: 88, avg: 71 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.metric}</span>
                      <div className="flex gap-4">
                        <span className="text-primary font-bold">You: {item.you}%</span>
                        <span className="text-muted-foreground">Avg: {item.avg}%</span>
                      </div>
                    </div>
                    <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="absolute h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${item.you}%` }}
                      />
                      <div 
                        className="absolute h-1 top-1 rounded-full bg-muted-foreground"
                        style={{ width: `${item.avg}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2 border-primary/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg">AI Insights</h3>
              </div>
              <div className="space-y-4">
                {aiInsights.map((insight, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/30">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-sm">{insight.title}</h4>
                      <Badge 
                        variant={insight.priority === "high" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      {insight.description}
                    </p>
                    <Button variant="glass" size="sm" className="w-full text-xs">
                      {insight.action}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
              <h3 className="font-bold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                {[
                  { label: "Ranking", value: "Top 5%", icon: Award },
                  { label: "Total Earnings", value: "$45,680", icon: Briefcase },
                  { label: "Completed Projects", value: "47", icon: Target },
                  { label: "Avg. Rating", value: "4.9/5", icon: TrendingUp },
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-background/30 backdrop-blur-sm border border-border/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
                        <stat.icon className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <span className="text-sm">{stat.label}</span>
                    </div>
                    <span className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Export Options */}
            <Card className="p-6 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)]">
              <h3 className="font-bold mb-4">Export Options</h3>
              <div className="space-y-2">
                <Button variant="glass" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF Report
                </Button>
                <Button variant="glass" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Export Data (CSV)
                </Button>
                <Button variant="glass" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Weekly Report
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
