export const API_BASE_URL =
  'http://localhost:5000/api';


export class ApiError extends Error {
  status: number;
  statusText: string;

  constructor(
    message: string,
    status: number,
    statusText: string
  ) {
    super(message);

    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
  }
}


export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${
    endpoint.startsWith('/')
      ? endpoint
      : `/${endpoint}`
  }`;

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders.Authorization =
      `Bearer ${token}`;
  }

  try {
    const response = await fetch(
      url,
      {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      }
    );

    if (!response.ok) {
      let message =
        `HTTP Error: ${response.status} ${response.statusText}`;

      try {
        const errorData =
          await response.json();

        if (
          errorData?.message
        ) {
          message =
            errorData.message;
        }
      } catch {
        // Response bukan JSON
      }

      throw new ApiError(
        message,
        response.status,
        response.statusText
      );
    }

    const data: T =
      await response.json();

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new Error(
      `Network Error: Tidak dapat terhubung ke server API (${(error as Error).message})`
    );
  }
}