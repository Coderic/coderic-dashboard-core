import type { ClaimsConfig } from "@coderic/acl";

/** Build a JWT claims map for roles/permissions custom namespace URIs. */
export function createClaimsConfig(rolesClaim: string, permissionsClaim: string): ClaimsConfig {
  return { rolesClaim, permissionsClaim };
}
