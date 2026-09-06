import { authenticatedApiClient } from "./authenticated-client";
import { apiClient } from "./client";
import type { LoginResponse, ProfileResponse } from "@/types/auth";

export async function login(email: string, password: string) {
  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}
export async function getProfile() {
  return authenticatedApiClient<ProfileResponse>("/users/profile");
}
