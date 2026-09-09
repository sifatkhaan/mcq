import type { User, UserRole } from "@/types/auth";

export const LOGIN_ROUTE = "/login";
export const ADMIN_HOME_ROUTE = "/";
export const STUDENT_HOME_ROUTE = "/student";

export const ADMIN_ROLES: UserRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "EXAMINER",
  "TEACHER",
];

export const STUDENT_ROLES: UserRole[] = ["STUDENT"];

export type ProtectedArea = "admin" | "student";

export function getUserRoles(user: User | null): UserRole[] {
  if (!user) {
    return [];
  }

  if (Array.isArray(user.roles)) {
    return user.roles;
  }

  if (Array.isArray(user.role)) {
    return user.role;
  }

  return user.role ? [user.role] : [];
}

export function hasAnyRole(user: User | null, allowedRoles: UserRole[]) {
  const userRoles = getUserRoles(user);

  return allowedRoles.some((role) => userRoles.includes(role));
}

export function isStudentUser(user: User | null) {
  return hasAnyRole(user, STUDENT_ROLES);
}

export function isAdminUser(user: User | null) {
  return hasAnyRole(user, ADMIN_ROLES);
}

export function canAccessArea(user: User | null, area: ProtectedArea) {
  return area === "student" ? isStudentUser(user) : isAdminUser(user);
}

export function getDefaultRouteForUser(user: User | null) {
  return isStudentUser(user) ? STUDENT_HOME_ROUTE : ADMIN_HOME_ROUTE;
}
