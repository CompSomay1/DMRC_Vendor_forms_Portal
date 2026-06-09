// Shared authentication types used by both frontend and backend

export interface RegisterInput {
  panCard: string;
  password: string;
  confirmPassword: string;
}

export interface LoginInput {
  panCard: string;
  password: string;
}

export interface AuthUser {
  id: string;
  panCard: string;
}

export interface RegisterResponse {
  message: string;
}

export interface AuthError {
  error: string;
}
