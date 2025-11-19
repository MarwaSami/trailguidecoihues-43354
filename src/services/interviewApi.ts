import { baseURL } from './pythonBackendApi';

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

export const interviewApi = {
  startInterview: async (freelancerId: string, skillCategories: string[]): Promise<InterviewSession> => {
    const response = await fetch(`${baseURL}/interviews/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        freelancerId,
        skillCategories,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to start interview');
    }

    return response.json();
  },

  submitAnswer: async (
    sessionId: string,
    questionId: string,
    answer: string
  ): Promise<{
    feedback: string;
    score: number;
  }> => {
    const response = await fetch(`${baseURL}/interviews/${sessionId}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionId,
        answer,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit answer');
    }

    return response.json();
  },

  endInterview: async (sessionId: string): Promise<InterviewSession> => {
    const response = await fetch(`${baseURL}/interviews/${sessionId}/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to end interview');
    }

    return response.json();
  },

  getInterviewHistory: async (freelancerId: string): Promise<InterviewSession[]> => {
    const response = await fetch(`${baseURL}/interviews/history/${freelancerId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch interview history');
    }

    return response.json();
  },
};