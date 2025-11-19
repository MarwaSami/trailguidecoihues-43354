import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { baseURL } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const startInterview = async (freelancerId: string, skillCategories: string[]) => {
    try {
      setLoading(true);
      setError(null);
      const jobId = localStorage.getItem('interview_job_id');
      if (jobId) {
        // Call job start API
        const response = await axios.post(`${baseURL}jobs/start/`, {
          freelancer_id: freelancerId,
          job_id: jobId
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = response.data;
        localStorage.setItem('conversation_id', data.conversation_id);
        // Set session
        const newSession: InterviewSession = {
          id: data.conversation_id,
          freelancerId,
          startTime: new Date(),
          questions: [],
          currentQuestionIndex: 0,
          answers: {},
          feedback: {},
          transcript: [],
          audioResponses: [],
          status: 'in-progress',
        };
        setCurrentSession(newSession);
        // Add first question to transcript
        setCurrentSession((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            transcript: [
              ...prev.transcript,
              { role: 'ai', text: data.first_question_text, timestamp: new Date() }
            ],
          };
        });
        // Play first question audio
        if (data.first_question_audio_base64) {
          const audio = new Audio(`data:audio/wav;base64,${data.first_question_audio_base64}`);
          audio.play().catch((err) => console.error('Error playing audio:', err));
        }
        // Clear
        localStorage.removeItem('interview_job_id');
        localStorage.removeItem('interview_freelancer_id');
      } else {
        // Mock for practice
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
      }
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
        toast({
          title: "Session Error",
          description: "No active interview session found. Please start an interview before submitting audio.",
          variant: "destructive",
        });
        return;
      }

      const conversationId = localStorage.getItem('conversation_id');
      if (!conversationId || typeof conversationId !== 'string' || conversationId.trim() === '') {
        toast({
          title: "Conversation Error",
          description: "Invalid or missing conversation ID. The interview session may not have been properly initialized.",
          variant: "destructive",
        });
        return;
      }

      // Convert Blob to base64 for backend compatibility
      const base64Audio = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1]; // Remove data:audio/wav;base64, prefix
          resolve(base64);
        };
        reader.onerror = () => reject(new Error('Failed to read audio file'));
        reader.readAsDataURL(audioBlob);
      });

      const response = await axios.post(`${baseURL}jobs/message/`, {
        conversation_id: conversationId,
        audio_base64: base64Audio,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      setCurrentSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          transcript: [
            ...prev.transcript,
            { role: 'user', text: data.user_text, timestamp: new Date() },
            { role: 'ai', text: data.ai_text, timestamp: new Date() }
          ],
        };
      });

      // Play AI audio response
      if (data.ai_audio_base64) {
        const audio = new Audio(`data:audio/wav;base64,${data.ai_audio_base64}`);
        audio.play().catch((err) => console.error('Error playing audio:', err));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit audio');
      toast({
        title: "Audio Submission Failed",
        description: err instanceof Error ? err.message : 'An unexpected error occurred while submitting audio.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTextMessage = async (text: string) => {
    try {
      setLoading(true);
      setError(null);

      if (!currentSession) {
        toast({
          title: "Session Error",
          description: "No active interview session found. Please start an interview before sending messages.",
          variant: "destructive",
        });
        return;
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
      toast({
        title: "Message Send Failed",
        description: err instanceof Error ? err.message : 'An unexpected error occurred while sending the message.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const endInterview = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!currentSession) {
        toast({
          title: "Session Error",
          description: "No active interview session found. Please start an interview before attempting to end it.",
          variant: "destructive",
        });
        return;
      }

      const conversationId = localStorage.getItem('conversation_id');
      if (!conversationId || typeof conversationId !== 'string' || conversationId.trim() === '') {
        toast({
          title: "Conversation Error",
          description: "Invalid or missing conversation ID. The interview session may not have been properly initialized.",
          variant: "destructive",
        });
        return;
      }

      const response = await axios.post(`${baseURL}end/`, {
        conversation_id: conversationId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = response.data;
      console.log('Interview ended, scores:', data);
      setCurrentSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          endTime: new Date(),
          status: 'completed',
          overallScore: data.overall_score || 85,
          confidenceScore: data.confidence_score || 20,
          technicalScore: data.technical_score || 80,
        };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end interview');
      toast({
        title: "Interview End Failed",
        description: err instanceof Error ? err.message : 'An unexpected error occurred while ending the interview.',
        variant: "destructive",
      });
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