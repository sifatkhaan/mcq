import { authenticatedApiClient } from "./authenticated-client";
import { apiClient } from "./client";
import type { LoginResponse, ProfileResponse } from "@/types/auth";

export async function login(
  organizationCode: string,
  email: string,
  password: string,
) {
  return apiClient<LoginResponse>(
    `/auth/login/${encodeURIComponent(organizationCode)}`,
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    },
  );
}

export async function loginByOrganization(
  organizationCode: string,
  email: string,
  password: string,
) {
  return apiClient<LoginResponse>(
    `/auth/login/${encodeURIComponent(organizationCode)}`,
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    },
  );
}

export async function getProfile() {
  return authenticatedApiClient<ProfileResponse>("/users/profile");
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export async function register(
  organizationCode: string,
  data: RegisterPayload,
) {
  return apiClient(`/auth/register/${encodeURIComponent(organizationCode)}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
