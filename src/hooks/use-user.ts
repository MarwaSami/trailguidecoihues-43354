import { useCallback, useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'freelancer' | 'client';
  skills?: string[];
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockUser: User = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'freelancer',
        skills: ['React', 'TypeScript', 'Node.js'],
      };
      setUser(mockUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    // TODO: Implement actual logout logic
    setUser(null);
  }, []);

  return {
    user,
    loading,
    error,
    logout,
    refetch: fetchUser,
  };
}
