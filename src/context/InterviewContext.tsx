import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Question {
  id: string;
  question: string;
  skillCategory: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface InterviewSession {
  id: string;
  freelancerId: string;
  startTime: Date;
  endTime?: Date;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  feedback: Record<string, string>;
  overallScore?: number;
  status: 'pending' | 'in-progress' | 'completed';
}

interface InterviewContextType {
  currentSession: InterviewSession | null;
  startInterview: (freelancerId: string, skillCategories: string[]) => Promise<void>;
  submitAnswer: (questionId: string, answer: string) => Promise<void>;
  endInterview: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startInterview = async (freelancerId: string, skillCategories: string[]) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Call backend API to initialize interview session with questions
      const mockQuestions: Question[] = [
        {
          id: '1',
          question: 'Explain the concept of React hooks and their benefits.',
          skillCategory: 'React',
          difficulty: 'intermediate',
        },
        // Add more mock questions
      ];

      const newSession: InterviewSession = {
        id: crypto.randomUUID(),
        freelancerId,
        startTime: new Date(),
        questions: mockQuestions,
        currentQuestionIndex: 0,
        answers: {},
        feedback: {},
        status: 'in-progress',
      };

      setCurrentSession(newSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (questionId: string, answer: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentSession) {
        throw new Error('No active interview session');
      }

      // TODO: Call backend API to submit and evaluate answer
      setCurrentSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          answers: { ...prev.answers, [questionId]: answer },
          currentQuestionIndex: prev.currentQuestionIndex + 1,
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!currentSession) {
        throw new Error('No active interview session');
      }

      // TODO: Call backend API to finalize interview and get results
      setCurrentSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          endTime: new Date(),
          status: 'completed',
          overallScore: 85, // Mock score
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <InterviewContext.Provider
      value={{
        currentSession,
        startInterview,
        submitAnswer,
        endInterview,
        loading,
        error,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};