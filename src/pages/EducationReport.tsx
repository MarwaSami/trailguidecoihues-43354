import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, Lightbulb, Target, TrendingUp, Users, Wifi, BookOpen, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar } from "recharts";
import { issues, recommendations, programPhases, categoryStats, priorityStats, type Issue, type Recommendation } from "@/data/educationReport";

const getCategoryIcon = (category: Issue['category']) => {
  switch (category) {
    case 'infrastructure': return <Wifi className="h-5 w-5" />;
    case 'training': return <BookOpen className="h-5 w-5" />;
    case 'awareness': return <Users className="h-5 w-5" />;
    case 'coordination': return <MessageSquare className="h-5 w-5" />;
  }
};

const getCategoryColor = (category: Issue['category']) => {
  switch (category) {
    case 'infrastructure': return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case 'training': return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    case 'awareness': return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case 'coordination': return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
  }
};

const getCategoryLabel = (category: Issue['category']) => {
  switch (category) {
    case 'infrastructure': return "البنية التحتية";
    case 'training': return "التدريب";
    case 'awareness': return "التوعية";
    case 'coordination': return "التنسيق";
  }
};

const getPriorityColor = (priority: Recommendation['priority']) => {
  switch (priority) {
    case 'high': return "bg-red-500/10 text-red-500 border-red-500/20";
    case 'medium': return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case 'low': return "bg-green-500/10 text-green-500 border-green-500/20";
  }
};

const getPriorityLabel = (priority: Recommendation['priority']) => {
  switch (priority) {
    case 'high': return "أولوية عالية";
    case 'medium': return "أولوية متوسطة";
    case 'low': return "أولوية منخفضة";
  }
};

const phaseRadialData = programPhases.map((phase, index) => ({
  name: phase.title.split(":")[0],
  value: phase.items.length * 25,
  fill: `hsl(var(--chart-${index + 1}))`
}));

const EducationReport = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5" dir="rtl">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  تقرير التعليم والتكنولوجيا
                </h1>
                <p className="text-sm text-muted-foreground">تحليل شامل للقضايا والتوصيات</p>
              </div>
            </div>
            <Badge variant="outline" className="text-sm">
              {issues.length} قضية • {recommendations.length} توصية
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-red-500/20">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-red-500">{issues.length}</p>
                  <p className="text-sm text-muted-foreground">قضايا رئيسية</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-emerald-500/20">
                  <Lightbulb className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-500">{recommendations.length}</p>
                  <p className="text-sm text-muted-foreground">توصيات عملية</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-500/20">
                  <Target className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-500">{programPhases.length}</p>
                  <p className="text-sm text-muted-foreground">مراحل التنفيذ</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-500/20">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-500">4</p>
                  <p className="text-sm text-muted-foreground">أولويات عالية</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                توزيع القضايا حسب الفئة
              </CardTitle>
              <CardDescription>تحليل القضايا الرئيسية مصنفة حسب نوعها</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-emerald-500" />
                توزيع التوصيات حسب الأولوية
              </CardTitle>
              <CardDescription>تصنيف التوصيات حسب مستوى الأهمية</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {priorityStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="issues" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="issues" className="text-base">
              <AlertTriangle className="h-4 w-4 ml-2" />
              القضايا والمشكلات
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="text-base">
              <Lightbulb className="h-4 w-4 ml-2" />
              التوصيات العملية
            </TabsTrigger>
            <TabsTrigger value="program" className="text-base">
              <Target className="h-4 w-4 ml-2" />
              البرنامج الموحد
            </TabsTrigger>
          </TabsList>

          {/* Issues Tab */}
          <TabsContent value="issues" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {issues.map((issue) => (
                <Card key={issue.id} className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getCategoryColor(issue.category)}`}>
                          {getCategoryIcon(issue.category)}
                        </div>
                        <div>
                          <Badge variant="outline" className={`mb-2 ${getCategoryColor(issue.category)}`}>
                            {getCategoryLabel(issue.category)}
                          </Badge>
                          <CardTitle className="text-lg leading-tight">{issue.title}</CardTitle>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-muted-foreground/50">#{issue.id}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {issue.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {recommendations.map((rec) => (
                <Card key={rec.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                          {rec.id}
                        </div>
                        <div>
                          <Badge className={`mb-2 ${getPriorityColor(rec.priority)}`}>
                            {getPriorityLabel(rec.priority)}
                          </Badge>
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {rec.actions.map((action, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                            {idx + 1}
                          </div>
                          <span className="text-sm">{action}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">التقدم المتوقع</span>
                        <span className="font-medium">{rec.priority === 'high' ? '75%' : rec.priority === 'medium' ? '50%' : '25%'}</span>
                      </div>
                      <Progress value={rec.priority === 'high' ? 75 : rec.priority === 'medium' ? 50 : 25} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Program Tab */}
          <TabsContent value="program" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>نموذج البرنامج العملي الموحد</CardTitle>
                <CardDescription>مبني على المقترحات والتوصيات</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="30%" 
                    outerRadius="90%" 
                    data={phaseRadialData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar 
                      dataKey="value" 
                      background 
                      label={{ fill: 'hsl(var(--foreground))', position: 'insideStart' }}
                    />
                    <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {programPhases.map((phase, index) => (
                <Card key={phase.id} className={`relative overflow-hidden ${
                  index === 0 ? 'border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-transparent' :
                  index === 1 ? 'border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-transparent' :
                  'border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent'
                }`}>
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl ${
                    index === 0 ? 'bg-blue-500/20' :
                    index === 1 ? 'bg-purple-500/20' :
                    'bg-emerald-500/20'
                  }`} />
                  <CardHeader>
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl font-bold mb-3 ${
                      index === 0 ? 'bg-blue-500/20 text-blue-500' :
                      index === 1 ? 'bg-purple-500/20 text-purple-500' :
                      'bg-emerald-500/20 text-emerald-500'
                    }`}>
                      {phase.id}
                    </div>
                    <CardTitle className="text-lg">{phase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {phase.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${
                            index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-purple-500' :
                            'bg-emerald-500'
                          }`} />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EducationReport;
