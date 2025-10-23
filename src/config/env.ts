const DEFAULT_API_BASE_URL = 'http://localhost:3100';

const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Base URL for backend API requests. Falls back to localhost during development
 * so that the app remains functional without extra configuration.
 */
export const API_BASE_URL =
  (rawApiBaseUrl && rawApiBaseUrl.replace(/\/+$/, '')) ?? DEFAULT_API_BASE_URL;

export const isProduction = process.env.NODE_ENV === 'production';
