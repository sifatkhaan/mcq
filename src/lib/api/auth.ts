import { apiClient } from "./client";
import type { LoginResponse } from "@/types/auth";

export async function login(email: string, password: string) {
  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}
