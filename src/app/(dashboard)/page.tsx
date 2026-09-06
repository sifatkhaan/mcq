"use client";
import { getStoredUser } from "@/lib/auth/auth-storage";
import StatCard from "../../../components/ui/StatCard";

export default function DashboardPage() {
  const user = getStoredUser();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        <p className="mt-1 text-sm text-gray-500">
          Overview of your examination system
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Questions" value="—" />
        <StatCard title="Exams" value="—" />
        <StatCard title="Students" value="—" />
        <StatCard title="Subjects" value="—" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-semibold text-gray-900">
            Recent Exams
          </h2>

          <div className="mt-6 flex min-h-32 items-center justify-center text-sm text-gray-500">
            No data available
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-semibold text-gray-900">
            Recent Activity
          </h2>

          <div className="mt-6 flex min-h-32 items-center justify-center text-sm text-gray-500">
            No activity available
          </div>
        </section>
      </div>
    </div>
  );
}
