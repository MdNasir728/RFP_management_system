/**
 * Common reusable types shared across frontend and backend.
 * This file enforces DRY principles and consistent data modeling.
 */

/**
 * Base entity shared by all persisted models.
 * MongoDB-specific fields are kept generic here.
 */
export interface BaseEntity {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a monetary value with currency.
 * Keeps pricing logic consistent across RFPs and proposals.
 */
export interface Money {
  amount: number;
  currency: string; // e.g. "USD", "INR"
}

/**
 * Represents a date range (optional helper for future extensions).
 */
export interface DateRange {
  startDate?: string;
  endDate?: string;
}

/**
 * Standard API success response wrapper.
 * Used by backend and expected by frontend.
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * Standard API error response wrapper.
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
  };
}

/**
 * Union type for all API responses.
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Pagination metadata (for future scalability).
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
}
