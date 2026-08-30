/**
 * Shared client for the Laravel backend (see /backend, and
 * docs/INTEGRATION_MATRIX.md for the full request/response comparison
 * against the old Express endpoints this replaces).
 *
 * Every response from the backend is one of two shapes:
 *   success: { success: true, data: T }
 *   error:   { success: false, message: string, errors?: Record<string, string[]> }
 * This client normalizes both into either a returned value or a thrown
 * ApiError, so callers never have to re-parse the envelope themselves.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(
  /\/$/,
  "",
);

export type ApiErrorKind =
  | "validation"
  | "auth"
  | "forbidden"
  | "not_found"
  | "rate_limited"
  | "conflict"
  | "server"
  | "network";

/**
 * Thrown for every non-2xx response, and for a request that never reaches
 * the server at all (kind "network") — callers can branch on `kind` to
 * show the right UI state without re-deriving it from the HTTP status.
 */
export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | null;
  readonly errors: Record<string, string[]> | undefined;

  constructor(
    message: string,
    kind: ApiErrorKind,
    status: number | null = null,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.errors = errors;
  }

  /** The first validation message for a given field, if any. */
  fieldError(field: string): string | undefined {
    return this.errors?.[field]?.[0];
  }
}

function kindForStatus(status: number): ApiErrorKind {
  switch (status) {
    case 401:
      return "auth";
    case 403:
      return "forbidden";
    case 404:
      return "not_found";
    case 409:
      return "conflict";
    case 422:
      return "validation";
    case 429:
      return "rate_limited";
    default:
      return "server";
  }
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Sanctum's CSRF cookie must be fetched before any state-changing admin
 * request (login, logout, or any write once authenticated) — the backend
 * rejects the request with a 419 otherwise. Safe to call repeatedly; it's
 * a cheap GET.
 */
export async function ensureCsrfCookie(): Promise<void> {
  await fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
    headers: { Referer: window.location.origin },
  });
}

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** Skip JSON body encoding (e.g. for FormData file uploads). */
  raw?: boolean;
}

/**
 * Makes one request against the Laravel API and returns the unwrapped
 * `data` payload, or throws ApiError.
 */
export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = "GET", body, raw = false } = options;
  const isWrite = method !== "GET";

  const headers: Record<string, string> = { Accept: "application/json" };
  if (!raw) headers["Content-Type"] = "application/json";

  if (isWrite) {
    const xsrfToken = readCookie("XSRF-TOKEN");
    if (xsrfToken) headers["X-XSRF-TOKEN"] = xsrfToken;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers,
      body: body === undefined ? undefined : raw ? (body as BodyInit) : JSON.stringify(body),
    });
  } catch {
    // fetch() itself threw: DNS failure, connection refused, offline, CORS
    // preflight rejection — there is no HTTP response to inspect at all.
    throw new ApiError(
      "Could not reach the server. Check your connection and try again.",
      "network",
    );
  }

  // 204 No Content (e.g. logout, delete) has no body to parse.
  if (response.status === 204) {
    return undefined as T;
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError(
      "The server returned an unexpected response. Please try again.",
      response.ok ? "server" : kindForStatus(response.status),
      response.status,
    );
  }

  const body_ = payload as {
    success?: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string[]>;
  };

  if (!response.ok || body_.success === false) {
    throw new ApiError(
      body_.message || "Something went wrong. Please try again.",
      kindForStatus(response.status),
      response.status,
      body_.errors,
    );
  }

  return body_.data as T;
}

/**
 * Turns a caught error into a message worth showing a user. For a 422
 * ApiError this surfaces the first concrete field error (e.g. "The email
 * field is required.") rather than the generic "The given data was
 * invalid." envelope message, since that's almost always more useful in a
 * single error banner. Falls back to the error's own message, then to
 * `fallback` for anything unrecognized.
 */
export function describeApiError(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    const firstFieldError = err.errors && Object.values(err.errors)[0]?.[0];
    return firstFieldError || err.message || fallback;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
