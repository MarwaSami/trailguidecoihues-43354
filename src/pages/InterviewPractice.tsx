import { Navbar } from "@/components/Navbar";
import { RealtimeInterview } from '@/components/interview/RealtimeInterview';

export default function InterviewPractice() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">AI Interview Practice</h1>
            <p className="text-lg text-muted-foreground">
              Practice real-time audio interviews with AI. Enable your camera for a complete interview experience.
            </p>
          </div>

          <RealtimeInterview />
        </div>
      </main>
    </div>
  );
}
