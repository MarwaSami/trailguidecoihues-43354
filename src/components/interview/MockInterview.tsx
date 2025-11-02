import React, { useState } from 'react';
import { useInterview } from '@/context/InterviewContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface MockInterviewProps {
  freelancerId: string;
  selectedSkills: string[];
}

export function MockInterview({ freelancerId, selectedSkills }: MockInterviewProps) {
  const { currentSession, startInterview, submitAnswer, endInterview, loading, error } = useInterview();
  const [currentAnswer, setCurrentAnswer] = useState('');
  const { toast } = useToast();

  const handleStartInterview = async () => {
    try {
      await startInterview(freelancerId, selectedSkills);
      toast({
        title: 'Interview Started',
        description: 'Your mock interview session has begun. Good luck!',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to start the interview. Please try again.',
      });
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentSession || !currentAnswer.trim()) return;

    const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
    try {
      await submitAnswer(currentQuestion.id, currentAnswer);
      setCurrentAnswer('');

      if (currentSession.currentQuestionIndex + 1 >= currentSession.questions.length) {
        await endInterview();
        toast({
          title: 'Interview Completed',
          description: 'Your mock interview has been completed successfully!',
        });
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit answer. Please try again.',
      });
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!currentSession) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Mock Interview</h2>
        <p className="mb-4">
          Ready to test your skills? This mock interview will assess your knowledge
          in the selected skill categories.
        </p>
        <Button onClick={handleStartInterview} disabled={loading}>
          {loading ? 'Starting...' : 'Start Interview'}
        </Button>
      </Card>
    );
  }

  const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
  const progress = (currentSession.currentQuestionIndex / currentSession.questions.length) * 100;

  if (currentSession.status === 'completed') {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Interview Completed</h2>
        <div className="mb-4">
          <p>Overall Score: {currentSession.overallScore}%</p>
          <Progress value={currentSession.overallScore} className="mt-2" />
        </div>
        <div className="space-y-4">
          {currentSession.questions.map((question) => (
            <div key={question.id} className="border-b pb-4">
              <p className="font-semibold">{question.question}</p>
              <p className="text-sm text-gray-600 mt-2">Your Answer:</p>
              <p className="mt-1">{currentSession.answers[question.id]}</p>
              {currentSession.feedback[question.id] && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Feedback:</p>
                  <p className="mt-1">{currentSession.feedback[question.id]}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <Progress value={progress} className="mb-2" />
        <p className="text-sm text-gray-600">
          Question {currentSession.currentQuestionIndex + 1} of{' '}
          {currentSession.questions.length}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">{currentQuestion.question}</h3>
          <p className="text-sm text-gray-600">
            Category: {currentQuestion.skillCategory} | Level:{' '}
            {currentQuestion.difficulty}
          </p>
        </div>

        <Textarea
          placeholder="Type your answer here..."
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          className="min-h-[200px]"
        />

        <Button
          onClick={handleSubmitAnswer}
          disabled={loading || !currentAnswer.trim()}
        >
          {loading ? 'Submitting...' : 'Submit Answer'}
        </Button>
      </div>
    </Card>
  );
}