"use client";
import { FormEvent, useState } from "react";
import { register } from "@/lib/api/auth";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Button from "../../../../../components/button/Button";

export default function RegisterPage() {
  const router = useRouter();
  const { orgCode } = useParams() as { orgCode: string };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register(orgCode.trim(), {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
      });

      setSuccess("Registration successful. Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      {" "}
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md items-center">
        {" "}
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
        >
          {" "}
          <div className="mb-8 text-center">
            {" "}
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-xl font-bold text-white">
              MCQ{" "}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="mt-2 text-sm text-gray-500">
              Register as a student in your organization
            </p>
          </div>
          <div className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                maxLength={150}
                className="
              w-full rounded-lg border border-gray-300
              px-3 py-3 text-sm outline-none
              transition
              focus:border-gray-500
              focus:ring-2 focus:ring-gray-200
            "
              />
            </div>

            {/* Email */}
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
                maxLength={150}
                className="
              w-full rounded-lg border border-gray-300
              px-3 py-3 text-sm outline-none
              transition
              focus:border-gray-500
              focus:ring-2 focus:ring-gray-200
            "
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Phone
                <span className="ml-1 font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Enter your phone number"
                autoComplete="tel"
                maxLength={20}
                className="
              w-full rounded-lg border border-gray-300
              px-3 py-3 text-sm outline-none
              transition
              focus:border-gray-500
              focus:ring-2 focus:ring-gray-200
            "
              />
            </div>

            {/* Password */}
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
                placeholder="Create a password"
                autoComplete="new-password"
                required
                minLength={6}
                maxLength={255}
                className="
              w-full rounded-lg border border-gray-300
              px-3 py-3 text-sm outline-none
              transition
              focus:border-gray-500
              focus:ring-2 focus:ring-gray-200
            "
              />

              <p className="mt-1.5 text-xs text-gray-400">
                Minimum 6 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
                minLength={6}
                maxLength={255}
                className="
              w-full rounded-lg border border-gray-300
              px-3 py-3 text-sm outline-none
              transition
              focus:border-gray-500
              focus:ring-2 focus:ring-gray-200
            "
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-green-100 bg-green-50 px-3 py-3 text-sm text-green-600">
                {success}
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              loadingText="Creating account..."
              fullWidth
            >
              Create Account
            </Button>

            <div className="pt-2 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-gray-900 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
