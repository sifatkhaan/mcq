import type { User } from "@/types/auth";

const ACCESS_TOKEN_KEY = "mcq_access_token";
const USER_KEY = "mcq_user";
const AUTH_CHANGE_EVENT = "mcq_auth_change";

function emitAuthChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function saveAuth(accessToken: string, user: User) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  emitAuthChange();
}

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as User;
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  emitAuthChange();
}

export function getAuthSnapshot() {
  if (typeof window === "undefined") {
    return "";
  }

  return JSON.stringify({
    accessToken: getAccessToken(),
    user: getStoredUser(),
  });
}

export function getServerAuthSnapshot() {
  return "";
}

export function parseAuthSnapshot(snapshot: string) {
  if (!snapshot) {
    return {
      accessToken: null,
      user: null,
    };
  }

  try {
    return JSON.parse(snapshot) as {
      accessToken: string | null;
      user: User | null;
    };
  } catch {
    return {
      accessToken: null,
      user: null,
    };
  }
}

export function subscribeToAuthChanges(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(AUTH_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(AUTH_CHANGE_EVENT, onStoreChange);
  };
}
