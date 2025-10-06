/**
 * Python Backend API Integration
 * 
 * This service handles all communication with your Python backend.
 * Configure the PYTHON_BACKEND_URL in your environment or update it here.
 */

const PYTHON_BACKEND_URL = import.meta.env.VITE_PYTHON_BACKEND_URL || 'http://localhost:8000/api';

export interface ProfileEvaluationResponse {
  success: boolean;
  score: number;
  comments: string;
  suggestions?: string[];
  profileId?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  userId: string;
  role: 'freelancer' | 'client' | 'admin';
}

export interface ProfileData {
  userId: string;
  bio: string;
  skills: string[];
  experience_years: number | null;
  hourly_rate: number | null;
  portfolio_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
}

/**
 * Authenticate user with Python backend
 * Endpoint: POST /auth/login
 */
export async function loginToPythonBackend(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${PYTHON_BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Register user with Python backend
 * Endpoint: POST /auth/register
 */
export async function registerToPythonBackend(
  email: string,
  password: string,
  fullName: string,
  role: 'freelancer' | 'client'
): Promise<AuthResponse> {
  const response = await fetch(`${PYTHON_BACKEND_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, fullName, role }),
  });

  if (!response.ok) {
    throw new Error(`Registration failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Submit profile data to Python backend for evaluation
 * Endpoint: POST /profile/evaluate
 */
export async function evaluateProfile(
  profileData: ProfileData,
  token: string
): Promise<ProfileEvaluationResponse> {
  const response = await fetch(`${PYTHON_BACKEND_URL}/profile/evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error(`Profile evaluation failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Upload CV to Python backend for evaluation
 * Endpoint: POST /profile/upload-cv
 */
export async function uploadCVToPythonBackend(
  file: File,
  userId: string,
  token: string
): Promise<ProfileEvaluationResponse> {
  const formData = new FormData();
  formData.append('cv', file);
  formData.append('userId', userId);

  const response = await fetch(`${PYTHON_BACKEND_URL}/profile/upload-cv`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`CV upload failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update profile on Python backend
 * Endpoint: PUT /profile/update
 */
export async function updateProfileOnPythonBackend(
  profileData: ProfileData,
  token: string
): Promise<ProfileEvaluationResponse> {
  const response = await fetch(`${PYTHON_BACKEND_URL}/profile/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error(`Profile update failed: ${response.statusText}`);
  }

  return response.json();
}
