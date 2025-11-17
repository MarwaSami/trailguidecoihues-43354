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
  confidenceScore?: number;
  technicalScore?: number;
  transcript: { role: 'user' | 'ai'; text: string; timestamp: Date }[];
  audioResponses: string[];
  status: 'pending' | 'in-progress' | 'completed';
}

interface InterviewContextType {
  currentSession: InterviewSession | null;
  startInterview: (freelancerId: string, skillCategories: string[]) => Promise<void>;
  submitAnswer: (questionId: string, answer: string) => Promise<void>;
  submitAudioAnswer: (audioBlob: Blob) => Promise<void>;
  sendTextMessage: (text: string) => Promise<void>;
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
        transcript: [],
        audioResponses: [],
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

  const submitAudioAnswer = async (audioBlob: Blob) => {
    try {
      setLoading(true);
      setError(null);

      if (!currentSession) {
        throw new Error('No active interview session');
      }

      // TODO: Call backend API to send audio and receive AI response
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('sessionId', currentSession.id);

      // Mock response
      const aiResponse = {
        text: "Thank you for your response. Can you elaborate more on that?",
        audio: "", // Base64 audio from backend
      };

      setCurrentSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          transcript: [
            ...prev.transcript,
            { role: 'user', text: '[Audio Response]', timestamp: new Date() },
            { role: 'ai', text: aiResponse.text, timestamp: new Date() }
          ],
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit audio');
    } finally {
      setLoading(false);
    }
  };

  const sendTextMessage = async (text: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!currentSession) {
        throw new Error('No active interview session');
      }

      // TODO: Call backend API to send text and receive AI response
      const aiResponse = {
        text: "I understand. Let me ask you another question...",
        audio: "", // Optional audio response
      };

      setCurrentSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          transcript: [
            ...prev.transcript,
            { role: 'user', text, timestamp: new Date() },
            { role: 'ai', text: aiResponse.text, timestamp: new Date() }
          ],
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
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
          overallScore: 85,
          confidenceScore: 20,
          technicalScore: 80,
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
        submitAudioAnswer,
        sendTextMessage,
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