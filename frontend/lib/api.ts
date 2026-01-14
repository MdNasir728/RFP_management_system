import axios, { AxiosError } from "axios";

/**
 * Axios instance with base configuration
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

/**
 * Generic API error shape (from backend)
 */
interface ApiError {
  success: false;
  error: {
    message: string;
  };
}

/**
 * Extract readable error message from API / network errors
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    return (
      axiosError.response?.data?.error?.message ||
      axiosError.message ||
      "Something went wrong"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error occurred";
};

/**
 * HTTP helpers
 */
export const apiGet = async <T>(url: string): Promise<T> => {
  const res = await api.get<T>(url);
  return res.data;
};

export const apiPost = async <T, B = unknown>(
  url: string,
  body?: B
): Promise<T> => {
  const res = await api.post<T>(url, body);
  return res.data;
};

export const apiPut = async <T, B = unknown>(
  url: string,
  body?: B
): Promise<T> => {
  const res = await api.put<T>(url, body);
  return res.data;
};

export const apiDelete = async <T>(url: string): Promise<T> => {
  const res = await api.delete<T>(url);
  return res.data;
};

export default api;
