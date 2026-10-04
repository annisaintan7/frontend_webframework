import {
  apiClient
} from './api';


// ========================================
// TYPE RESPONSE
// ========================================

type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    token?: string;
    user?: {
      id: number;
      name: string;
      email: string;
    };
  } | null;
};


// ========================================
// TYPE REGISTER
// ========================================

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};


// ========================================
// TYPE LOGIN
// ========================================

export type LoginData = {
  email: string;
  password: string;
};


// ========================================
// REGISTER
// ========================================

export async function register(
  data: RegisterData
): Promise<AuthResponse> {
  return apiClient<AuthResponse>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}


// ========================================
// LOGIN
// ========================================

export async function login(
  data: LoginData
): Promise<AuthResponse> {
  const response =
    await apiClient<AuthResponse>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

  // Simpan JWT setelah login berhasil
  if (
    response.success &&
    response.data?.token &&
    typeof window !== 'undefined'
  ) {
    localStorage.setItem(
      'token',
      response.data.token
    );
  }

  return response;
}


// ========================================
// LOGOUT
// ========================================

export function logout(): void {
  if (
    typeof window !== 'undefined'
  ) {
    localStorage.removeItem(
      'token'
    );
  }
}


// ========================================
// AMBIL TOKEN
// ========================================

export function getToken(): string | null {
  if (
    typeof window === 'undefined'
  ) {
    return null;
  }

  return localStorage.getItem(
    'token'
  );
}


// ========================================
// CEK STATUS LOGIN
// ========================================

export function isAuthenticated(): boolean {
  return getToken() !== null;
}