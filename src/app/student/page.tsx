"use client";

import { getStoredUser } from "@/lib/auth/auth-storage";

// import { getStoredUser } from "@/lib/auth/auth-storage";

export default function StudentDashboardPage() {
  const user = getStoredUser();

  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">
          Hello, {user?.name ?? "Student"}
        </h1>

        <p className="mt-1 text-sm text-gray-500">Ready for your next exam?</p>

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Upcoming Exam</p>

          <h2 className="mt-2 text-lg font-semibold text-gray-900">
            No upcoming exam
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Your assigned exams will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
