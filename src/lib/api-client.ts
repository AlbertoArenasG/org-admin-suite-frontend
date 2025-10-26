import { API_BASE_URL } from '@/config/env';

export interface ApiErrorDetails {
  message: string;
  method: string;
  path: string;
  error_code?: string;
  validation_errors?: Record<string, string[]> | unknown[];
}

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: ApiErrorDetails['validation_errors'];

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: ApiErrorDetails['validation_errors']
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface ApiSuccessResponse<T> {
  success: true;
  success_message: string | null;
  status_code: number;
  data: T;
  pagination?: unknown;
  meta?: unknown;
}

interface ApiFailureResponse {
  success: false;
  success_message: string | null;
  status_code: number;
  error_details: ApiErrorDetails;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiFailureResponse;

export interface JsonSuccess<TResponse, TMeta = unknown> {
  data: TResponse;
  successMessage: string | null;
  statusCode: number;
  meta?: TMeta;
  raw: ApiSuccessResponse<TResponse>;
}

export interface JsonRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  token?: string | null;
}

const DEFAULT_LANGUAGE = 'es';

function resolveLanguage(): string {
  if (typeof document !== 'undefined') {
    const explicit = document.documentElement.getAttribute('lang');
    if (explicit && explicit.trim().length > 0) {
      return explicit.trim();
    }
  }
  if (typeof navigator !== 'undefined' && typeof navigator.language === 'string') {
    return navigator.language;
  }
  return DEFAULT_LANGUAGE;
}

function buildHeaders(
  headers: HeadersInit | undefined,
  hasJsonBody: boolean,
  token?: string | null
) {
  const nextHeaders = new Headers(headers);

  if (hasJsonBody && !nextHeaders.has('Content-Type')) {
    nextHeaders.set('Content-Type', 'application/json');
  }

  if (token) {
    nextHeaders.set('Authorization', `Bearer ${token}`);
  }

  if (!nextHeaders.has('x-user-lang')) {
    nextHeaders.set('x-user-lang', resolveLanguage());
  }

  return nextHeaders;
}

/**
 * Lightweight helper for invoking the backend API with JSON payloads.
 */
export async function jsonRequest<TResponse, TMeta = unknown>(
  path: string,
  { body, headers, token, ...init }: JsonRequestOptions = {}
): Promise<JsonSuccess<TResponse, TMeta>> {
  const hasJsonBody = body !== undefined && body !== null;

  const requestInit: RequestInit = {
    ...init,
    headers: buildHeaders(headers, hasJsonBody, token),
    body: hasJsonBody ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, requestInit);

  const contentType = response.headers.get('Content-Type') ?? '';
  const expectsJson = contentType.includes('application/json');

  let parsedBody: ApiResponse<TResponse> | null = null;

  if (expectsJson) {
    try {
      parsedBody = (await response.json()) as ApiResponse<TResponse>;
    } catch {
      throw new ApiError('Invalid JSON response received from API', response.status || 500);
    }
  }

  if (response.ok && parsedBody && parsedBody.success) {
    const pagination = (parsedBody as { pagination?: unknown }).pagination;
    const meta = pagination !== undefined ? ({ pagination } as TMeta) : undefined;
    return {
      data: parsedBody.data,
      successMessage: parsedBody.success_message,
      statusCode: parsedBody.status_code,
      meta,
      raw: parsedBody,
    };
  }

  const status = parsedBody?.status_code ?? response.status;

  if (parsedBody && !parsedBody.success) {
    const { message, error_code, validation_errors } = parsedBody.error_details;
    throw new ApiError(message, status, error_code, validation_errors);
  }

  throw new ApiError(response.statusText || 'Unexpected API error', status);
}
