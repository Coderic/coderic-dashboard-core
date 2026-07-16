import type { User } from "@auth0/auth0-spa-js";
import type { AuthPrincipal, ClaimsConfig } from "@coderic/acl";
import { hasAnyRole, hasPermission, parseClaims } from "@coderic/acl";

const DEFAULT_ADMIN_ROLES = ["admin", "sudo"];

export type AuthHelpers = {
  principalFromUser: (user: User | undefined) => AuthPrincipal | null;
  rolesFromUser: (user: User | undefined) => string[];
  permissionsFromUser: (user: User | undefined) => string[];
  hasRole: (user: User | undefined, role: string) => boolean;
  hasUserPermission: (user: User | undefined, permission: string) => boolean;
  isAdminUser: (user: User | undefined) => boolean;
};

export type CreateAuthHelpersOptions = {
  adminRoles?: string[];
};

export function createAuthHelpers(
  claimsConfig: ClaimsConfig,
  options: CreateAuthHelpersOptions = {},
): AuthHelpers {
  const adminRoles = options.adminRoles ?? DEFAULT_ADMIN_ROLES;

  function rolesFromUser(user: User | undefined): string[] {
    if (!user) return [];
    return parseClaims(user as Record<string, unknown>, claimsConfig).roles;
  }
  function permissionsFromUser(user: User | undefined): string[] {
    if (!user) return [];
    return parseClaims(user as Record<string, unknown>, claimsConfig).permissions;
  }
  function principalFromUser(user: User | undefined): AuthPrincipal | null {
    if (!user?.sub) return null;
    const { roles, permissions } = parseClaims(user as Record<string, unknown>, claimsConfig);
    return {
      sub: user.sub,
      email: typeof user.email === "string" ? user.email : null,
      name: typeof user.name === "string" ? user.name : null,
      roles,
      permissions,
    };
  }
  function hasRole(user: User | undefined, role: string): boolean {
    return rolesFromUser(user).includes(role);
  }
  function hasUserPermission(user: User | undefined, permission: string): boolean {
    const principal = { roles: rolesFromUser(user), permissions: permissionsFromUser(user) };
    return hasPermission(principal, permission);
  }
  function isAdminUser(user: User | undefined): boolean {
    const principal = { roles: rolesFromUser(user), permissions: permissionsFromUser(user) };
    return hasAnyRole(principal, adminRoles);
  }
  return {
    principalFromUser,
    rolesFromUser,
    permissionsFromUser,
    hasRole,
    hasUserPermission,
    isAdminUser,
  };
}
