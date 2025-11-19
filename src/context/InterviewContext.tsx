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
  // raw result payload returned by the backend when ending the interview
  result?: {
    score?: number;
    summary?: string;
    strengths?: string[];
    weaknesses?: string[];
    [k: string]: any;
  } | null;
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
  stopInterview: (conversationId?: string) => Promise<any>;
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

      // Send the audio as multipart/form-data so the backend can read it from request.FILES
      const formData = new FormData();
      formData.append('conversation_id', conversationId);

      // Provide a filename and let FormData include the blob as a file part named 'audio_file'
      // Use the Blob's type to guess extension if needed.
      // Ensure MIME is clean (strip parameters like ';codecs=opus') so filename
      // extension is valid (e.g., 'webm' not 'webm;codecs=opus'). Some browsers
      // report types with parameters which would make the filename invalid.
      const rawMime = (audioBlob as any).type || 'audio/webm';
      const mime = rawMime.split(';')[0].trim();
      const ext = (mime.split('/')[1] || 'webm').replace(/[^a-z0-9]/gi, '').toLowerCase();
      const filename = `response.${ext}`;
      console.log('[InterviewContext] Uploading audio with MIME:', mime, 'filename:', filename);
      formData.append('audio_file', audioBlob, filename);

      // Debug: log FormData entries (file name/type/size) in browser console
      try {
        for (const entry of (formData as any).entries()) {
          const [key, value] = entry as [string, any];
          if (value instanceof File) {
            console.log('[InterviewContext] FormData entry:', key, {
              name: value.name,
              type: value.type,
              size: value.size,
            });
          } else {
            console.log('[InterviewContext] FormData entry:', key, value);
          }
        }
      } catch (e) {
        console.log('[InterviewContext] Unable to inspect FormData entries', e);
      }

      const token = localStorage.getItem('token');
      const fetchResp = await fetch(`${baseURL}jobs/message/`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          Accept: 'application/json',
        },
        body: formData,
      });

      if (!fetchResp.ok) {
        const text = await fetchResp.text();
        throw new Error(`Upload failed: ${fetchResp.status} ${text}`);
      }

      const response = await fetchResp.json();

      // Backend may return the payload directly or wrapped in a `data` key
      const data = response && typeof response === 'object' && 'data' in response ? response.data : response;
         console.log('[InterviewContext] Audio submission response data:', data);
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

      const response = await axios.post(`${baseURL}jobs/end/`, {
        conversation_id: conversationId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      const data = response.data;
      console.log('Interview ended, scores:', data);
      // Save full result payload into context so UI can render summary/strengths/weaknesses
      setCurrentSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          endTime: new Date(),
          status: 'completed',
          overallScore: data.overall_score ?? data.score ?? prev.overallScore,
          confidenceScore: data.confidence_score ?? prev.confidenceScore,
          technicalScore: data.technical_score ?? prev.technicalScore,
          result: {
            score: data.score ?? data.overall_score,
            summary: data.summary ?? data.summary_text ?? '',
            strengths: data.strengths ?? data.strengths_list ?? [],
            weaknesses: data.weaknesses ?? data.weaknesses_list ?? [],
            ...data,
          },
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

  const stopInterview = async (conversationId?: string) => {
    try {
      const conv = conversationId || localStorage.getItem('conversation_id');
      if (!conv) throw new Error('Missing conversation id');
      const response = await axios.post(`${baseURL}stop/`, {
        conversation_id: conv,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Clear session/cached conv id after stopping
      localStorage.removeItem('conversation_id');
      setCurrentSession(null);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop interview');
      throw err;
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
        stopInterview,
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