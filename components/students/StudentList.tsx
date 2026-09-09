"use client";

import type { OrganizationStudent } from "@/lib/api/organizations";

interface StudentListProps {
  students: OrganizationStudent[];
  onView?: (student: OrganizationStudent) => void;
}

export default function StudentList({ students, onView }: StudentListProps) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-x-auto rounded-2xl border border-gray-200 bg-white lg:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <th className="px-5 py-4">Student</th>

              <th className="px-5 py-4">Email</th>

              <th className="px-5 py-4">Phone</th>

              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                      {student.name.charAt(0).toUpperCase()}
                    </div>

                    <span className="text-sm font-semibold text-gray-900">
                      {student.name}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  {student.email}
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  {student.phone || "—"}
                </td>

                <td className="px-5 py-4 text-right">
                  {onView && (
                    <button
                      type="button"
                      onClick={() => onView(student)}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}

      <div className="space-y-3 lg:hidden">
        {students.map((student) => (
          <div
            key={student.id}
            className="rounded-2xl border border-gray-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                  {student.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {student.name}
                  </p>

                  <p className="truncate text-xs text-gray-500">
                    {student.email}
                  </p>
                </div>
              </div>

              {onView && (
                <button
                  type="button"
                  onClick={() => onView(student)}
                  className="shrink-0 text-sm font-medium text-blue-600"
                >
                  View
                </button>
              )}
            </div>

            <div className="mt-4 rounded-xl bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Phone</p>

              <p className="mt-1 text-sm text-gray-800">
                {student.phone || "—"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
