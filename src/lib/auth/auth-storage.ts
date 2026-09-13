import type { User } from "@/types/auth";
const ACCESS_TOKEN_KEY = "mcq_access_token";
const USER_KEY = "mcq_user";
const ORGANIZATION_CODE_KEY = "mcq_organization_code";
const AUTH_CHANGE_EVENT = "mcq_auth_change";
function emitAuthChange() {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function saveAuth(
  accessToken: string,
  user: User,
  organizationCode?: string | null,
) {
  console.log("========== SAVE AUTH ==========");
  console.log("organizationCode argument:", organizationCode);
  console.log("user.organization_code:", user.organization_code);
  console.log("user:", user);
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  console.log(organizationCode, "code from storage", user);

  if (organizationCode) {
    localStorage.setItem(ORGANIZATION_CODE_KEY, organizationCode);
  } else if (user.organization_code) {
    localStorage.setItem(ORGANIZATION_CODE_KEY, user.organization_code);
  }

  console.log(
    "saved organization code:",
    localStorage.getItem(ORGANIZATION_CODE_KEY),
  );

  console.log("========== SAVE AUTH END ==========");

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

export function getStoredOrganizationCode(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const code = localStorage.getItem(ORGANIZATION_CODE_KEY);

  console.log("========== GET ORGANIZATION CODE ==========");
  console.log("stored organization code:", code);
  console.log("===========================================");
  return code;
}

export function clearAuth() {
  console.log("========== CLEAR AUTH ==========");
  console.log(
    "organization code BEFORE clear:",
    localStorage.getItem(ORGANIZATION_CODE_KEY),
  );
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  // localStorage.removeItem(ORGANIZATION_CODE_KEY);
  console.log(
    "organization code AFTER clear:",
    localStorage.getItem(ORGANIZATION_CODE_KEY),
  );

  console.log("================================");
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
