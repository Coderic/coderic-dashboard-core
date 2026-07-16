# @coderic/dashboard-core

Shared dashboard utilities: API client, environment factory, Auth0 claim helpers.

No application branding, tenant IDs, or OIDC endpoints are hardcoded. The consuming app supplies Auth0 and JWT claim configuration.

## Install

```bash
npm install @coderic/dashboard-core @coderic/acl
```

## Usage

```ts
import { createClaimsConfig, createEnv, createAuthHelpers } from "@coderic/dashboard-core";

export const claimsConfig = createClaimsConfig(
  "https://example.com/roles",
  "https://example.com/permissions",
);

export const env = createEnv({
  auth0Domain: import.meta.env.VITE_AUTH0_DOMAIN,
  auth0ClientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  auth0Audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  viteEnv: import.meta.env,
});

const auth = createAuthHelpers(claimsConfig);
```

## License

MIT
