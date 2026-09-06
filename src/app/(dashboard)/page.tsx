"use client";
import { getStoredUser } from "@/lib/api/auth/auth-storage";

export default function DashboardPage() {
  const user = getStoredUser();

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome, {user?.name ?? "User"}</p>
      </div>
    </main>
  );
}
