"use client";
import { FormEvent, useState } from "react";
import { getProfile, loginByOrganization } from "@/lib/api/auth";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { saveAuth } from "@/lib/auth/auth-storage";
import { getDefaultRouteForUser } from "@/lib/auth/route-access";
import Button from "../../../../../components/button/Button";

export default function LoginPage() {
  const params = useParams<{ orgCode: string }>();
  const router = useRouter();
  const organizationCode = params?.orgCode;
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
      saveAuth(result.accessToken, profile.user, organizationCode);
      router.push(getDefaultRouteForUser(profile.user));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl border border-gray-200 bg-white/95 p-6 shadow-xl shadow-gray-200/70 sm:p-8"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-950 text-xl font-bold tracking-wide text-white shadow-lg shadow-gray-300">
              MCQ
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              {organizationCode}
            </p>
            <h1 className="text-2xl font-bold text-gray-950">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to continue to your MCQ dashboard.
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
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:bg-white focus:ring-2 focus:ring-gray-200"
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
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:bg-white focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              loadingText="Signing in..."
              fullWidth
            >
              Sign in
            </Button>

            <p className="pt-2 text-center text-sm text-gray-500">
              New student?{" "}
              <Link
                href={`/register/${organizationCode}`}
                className="font-medium text-gray-950 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
