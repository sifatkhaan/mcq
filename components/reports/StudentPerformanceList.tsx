import type { StudentPerformanceReport } from "@/lib/api/attemptReports";
import PercentageIndicator from "./PercentageIndicator";
import { getPerformanceColor, performanceColors } from "./reportColors";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import Link from "next/link";

interface StudentPerformanceListProps {
  students: StudentPerformanceReport[];
}

function PerformanceBadge({ level }: { level: string }) {
  const color = getPerformanceColor(level);
  const colors = performanceColors[color];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colors.bg} ${colors.text}`}
    >
      {level}
    </span>
  );
}

export default function StudentPerformanceList({
  students,
}: StudentPerformanceListProps) {
  if (students.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
        No student performance data found.
      </div>
    );
  }

  return (
    <>
      {/* ================================================= */}
      {/* DESKTOP */}
      {/* ================================================= */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3 text-center">Attempts</th>
              <th className="px-4 py-3 text-center">Passed</th>
              <th className="px-4 py-3 text-center">Failed</th>
              <th className="px-4 py-3">Pass Rate</th>
              <th className="px-4 py-3">Average</th>
              <th className="px-4 py-3">Best</th>
              <th className="px-4 py-3">Lowest</th>
              <th className="px-4 py-3">Level</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.student_id}
                className="border-b border-gray-100 last:border-0"
              >
                <td className="px-4 py-2">
                  <Link href={`/admin/reports/students/${student.student_id}`}>
                    <div className="flex-col hover:bg-blue-200 rounded-md p-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-4 text-center text-sm text-gray-700">
                  {student.total_attempts}
                </td>
                <td className="px-4 py-4 text-center text-sm font-medium text-green-600">
                  {student.passed}
                </td>
                <td className="px-4 py-4 text-center text-sm font-medium text-red-600">
                  {student.failed}
                </td>
                <td className="px-4 py-4">
                  <PercentageIndicator value={student.pass_rate} />
                </td>
                <td className="px-4 py-4">
                  <PercentageIndicator value={student.average_percentage} />
                </td>
                <td className="px-4 py-4">
                  <PercentageIndicator
                    value={student.best_percentage}
                    showBar={false}
                  />
                </td>
                <td className="px-4 py-4">
                  <PercentageIndicator
                    value={student.lowest_percentage}
                    showBar={false}
                  />
                </td>
                <td className="px-4 py-4">
                  <PerformanceBadge level={student.performance_level} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================================================= */}
      {/* MOBILE */}
      {/* ================================================= */}
      <div className="space-y-3 lg:hidden">
        {students.map((student) => (
          <div
            key={student.student_id}
            className="rounded-xl border border-gray-200 p-4"
          >
            {/* Student */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {student.name}
                </p>
                <p className="mt-1 truncate text-xs text-gray-500">
                  {student.email}
                </p>
              </div>
              <PerformanceBadge level={student.performance_level} />
            </div>
            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Attempts</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {student.total_attempts}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Pass Rate</p>
                <div className="mt-1">
                  <PercentageIndicator value={student.pass_rate} />
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Average</p>
                <div className="mt-1">
                  <PercentageIndicator value={student.average_percentage} />
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Best</p>
                <div className="mt-1">
                  <PercentageIndicator
                    value={student.best_percentage}
                    showBar={false}
                  />
                </div>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <p className="text-xs text-green-600">Passed</p>
                <p className="mt-1 text-sm font-bold text-green-700">
                  {student.passed}
                </p>
              </div>
              <div className="rounded-lg bg-red-50 p-3">
                <p className="text-xs text-red-600">Failed</p>
                <p className="mt-1 text-sm font-bold text-red-700">
                  {student.failed}
                </p>
              </div>
            </div>
            {/* Lowest */}
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs text-gray-500">Lowest Score</span>
              <PercentageIndicator
                value={student.lowest_percentage}
                showBar={false}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
