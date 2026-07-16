export type Auth0ClientGroup = "foundation" | "corporate";

export type DashboardEnv = {
  auth0Domain: string;
  auth0ClientId: string;
  auth0Audience: string;
  apiBase: string;
  authReturnTo: string;
  redirectUri: string;
};

export type CreateEnvInput = {
  auth0ClientGroup?: Auth0ClientGroup;
  /** SPA client IDs supplied by the consuming application. */
  auth0ClientIds?: Partial<Record<Auth0ClientGroup, string>>;
  auth0Domain?: string;
  auth0ClientId?: string;
  auth0Audience?: string;
  apiBase?: string;
  authReturnTo?: string;
  redirectUri?: string;
  viteEnv?: Record<string, string | undefined>;
};

function required(value: string | undefined, label: string): string {
  if (!value) throw new Error(`${label} is required`);
  return value;
}

function resolveAuth0ClientId(input: CreateEnvInput): string {
  const vite = input.viteEnv ?? {};
  if (input.auth0ClientId) return input.auth0ClientId;
  if (vite.VITE_AUTH0_CLIENT_ID) return vite.VITE_AUTH0_CLIENT_ID;
  const group = input.auth0ClientGroup;
  if (group && input.auth0ClientIds?.[group]) return input.auth0ClientIds[group];
  throw new Error(
    "Auth0 client ID required: set auth0ClientId, VITE_AUTH0_CLIENT_ID, or auth0ClientIds[auth0ClientGroup]",
  );
}

export function createEnv(input: CreateEnvInput = {}): DashboardEnv {
  const vite = input.viteEnv ?? {};
  return {
    auth0Domain: required(input.auth0Domain ?? vite.VITE_AUTH0_DOMAIN, "auth0Domain or VITE_AUTH0_DOMAIN"),
    auth0ClientId: resolveAuth0ClientId(input),
    auth0Audience: required(input.auth0Audience ?? vite.VITE_AUTH0_AUDIENCE, "auth0Audience or VITE_AUTH0_AUDIENCE"),
    apiBase: input.apiBase ?? vite.VITE_API_BASE ?? "/api",
    authReturnTo: input.authReturnTo ?? "/dashboard/",
    redirectUri:
      input.redirectUri ??
      (typeof window !== "undefined" ? `${window.location.origin}/callback/` : "/callback/"),
  };
}
