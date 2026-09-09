"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  getAuthSnapshot,
  getServerAuthSnapshot,
  parseAuthSnapshot,
  subscribeToAuthChanges,
} from "@/lib/auth/auth-storage";
import {
  canAccessArea,
  getDefaultRouteForUser,
  LOGIN_ROUTE,
  type ProtectedArea,
} from "@/lib/auth/route-access";

interface RoleGuardProps {
  area: ProtectedArea;
  children: ReactNode;
}

export default function RoleGuard({ area, children }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const snapshot = useSyncExternalStore(
    subscribeToAuthChanges,
    getAuthSnapshot,
    getServerAuthSnapshot,
  );
  const { accessToken, user } = useMemo(
    () => parseAuthSnapshot(snapshot),
    [snapshot],
  );
  const isAuthenticated = Boolean(accessToken);
  const isAuthorized = isAuthenticated && canAccessArea(user, area);

  useEffect(() => {
    if (!snapshot) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(LOGIN_ROUTE);
      return;
    }

    if (!isAuthorized) {
      const destination = getDefaultRouteForUser(user);

      if (destination !== pathname) {
        router.replace(destination);
      }
    }
  }, [isAuthenticated, isAuthorized, pathname, router, snapshot, user]);

  if (!isAuthorized) {
    return null;
  }

  return children;
}
