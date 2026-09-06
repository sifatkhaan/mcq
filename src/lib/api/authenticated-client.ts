import { getAccessToken } from "./auth/auth-storage";
import { apiClient } from "./client";

export async function authenticatedApiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  return apiClient<T>(endpoint, {
    ...options,
    token,
  });
}
