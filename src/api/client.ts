import type { DashboardEnv } from "../config/createEnv.js";

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export interface ApiFetchOptions {
  method?: string;
  body?: string;
  token?: string;
}

let configuredEnv: DashboardEnv | null = null;

export function configureApiClient(env: DashboardEnv): void {
  configuredEnv = env;
}

export function getApiClientEnv(): DashboardEnv {
  if (!configuredEnv) {
    throw new Error("configureApiClient(env) must be called before apiFetch");
  }
  return configuredEnv;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const env = getApiClientEnv();
  const { method = "GET", body, token } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = path.startsWith("http") ? path : `${env.apiBase}${normalizedPath}`;
  const res = await fetch(url, {
    method,
    headers,
    body: method === "GET" || method === "HEAD" ? undefined : body,
  });
  if (!res.ok) {
    let errorBody: unknown;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = await res.text();
    }
    throw new ApiError(`API ${method} ${normalizedPath} failed (${res.status})`, res.status, errorBody);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  const text = await res.text();
  if (!text) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
}
