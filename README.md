# @coderic/dashboard-core

Shared dashboard utilities: Auth0 env factory, fetch client, JWT claim helpers.

**No branding, Auth0 client IDs, or claim URIs are hardcoded.** The consuming app must supply them.

## Install

```bash
npm install @coderic/dashboard-core @coderic/acl
```

GitHub Packages:

```ini
@coderic:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Repo: https://github.com/Coderic/coderic-dashboard-core

Depends on `@coderic/acl` for `ClaimsConfig` types and claim parsing.

## Exports

| Symbol | Purpose |
|--------|---------|
| `createEnv` | Build `DashboardEnv` from explicit Auth0 config + optional Vite env |
| `createClaimsConfig` | `{ rolesClaim, permissionsClaim }` for JWT namespaces |
| `createAuthHelpers` | Role/permission helpers bound to a `ClaimsConfig` |
| `configureApiClient` | Set base URL / auth headers from `DashboardEnv` |
| `apiFetch` | Authenticated JSON fetch wrapper |

## Usage

```ts
import {
  createEnv,
  createClaimsConfig,
  createAuthHelpers,
  configureApiClient,
  apiFetch,
} from "@coderic/dashboard-core";

export const claimsConfig = createClaimsConfig(
  "https://coderic.org/roles",
  "https://coderic.org/permissions",
);

const AUTH0_CLIENT_IDS = {
  foundation: "YOUR_FOUNDATION_SPA_CLIENT_ID",
  corporate: "YOUR_CORPORATE_SPA_CLIENT_ID",
} as const;

export const env = createEnv({
  auth0ClientGroup: "corporate",
  auth0ClientIds: AUTH0_CLIENT_IDS,
  auth0Domain: "auth.example.com",
  auth0Audience: "api://my-app",
  viteEnv: import.meta.env,
});

configureApiClient(env);
const auth = createAuthHelpers(claimsConfig);
```

### `createEnv` resolution order

1. Explicit args: `auth0Domain`, `auth0ClientId`, `auth0Audience`
2. Vite: `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE`
3. Client ID via `auth0ClientIds[auth0ClientGroup]`

Throws if required Auth0 values are missing.

## Coderic portal files

```
dashboard-app/src/config/env.ts      → createEnv + portal Auth0 IDs
dashboard-app/src/config/claims.ts   → createClaimsConfig(coderic.org URIs)
dashboard-app/src/main.tsx           → pass claimsConfig to DashboardRoot
```

## License

MIT
