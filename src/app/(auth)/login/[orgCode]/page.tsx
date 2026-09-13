"use client";

import { FormEvent, useState } from "react";
import { getProfile, loginByOrganization } from "@/lib/api/auth";
import { useParams, useRouter } from "next/navigation";
import { saveAuth } from "@/lib/auth/auth-storage";
import { getDefaultRouteForUser } from "@/lib/auth/route-access";

export default function LoginPage() {
  const params = useParams<{ orgCode: string }>();
  const router = useRouter();

  const organizationCode = params?.orgCode;
  console.log(organizationCode, "org code");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginByOrganization(
        organizationCode,
        email,
        password,
      );

      saveAuth(result.accessToken, result.user, organizationCode);
      const profile = await getProfile();
      // saveAuth(result.accessToken, {
      //   ...profile.user,
      //   organization_code: profile.user.organization_code ?? organizationCode,
      // });
      saveAuth(result.accessToken, profile.user, organizationCode);

      router.push(getDefaultRouteForUser(profile.user));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Login</h1>

            <p className="mt-2 text-sm text-gray-500">
              Sign in to your account
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
