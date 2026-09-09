"use client";
import { useRouter } from "next/navigation";
import type { ExamStudentReportItem } from "@/lib/api/attemptReports";
import PercentageIndicator from "./PercentageIndicator";
import { getPerformanceColor, performanceColors } from "./reportColors";

interface ExamStudentPerformanceListProps {
  students: ExamStudentReportItem[];
}

function StatusBadge({ status }: { status: string }) {
  const isPass = status === "PASS";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        isPass ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
      }`}
    >
      {status}
    </span>
  );
}

function SubmissionBadge({ type }: { type: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        type === "TIME_EXPIRED"
          ? "bg-orange-50 text-orange-700"
          : "bg-blue-50 text-blue-700"
      }`}
    >
      {type === "TIME_EXPIRED" ? "Auto Submitted" : "Manual"}
    </span>
  );
}

export default function ExamStudentPerformanceList({
  students,
}: ExamStudentPerformanceListProps) {
  const router = useRouter();

  if (students.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
        No students assigned to this exam.
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

              <th className="px-4 py-3">Latest</th>

              <th className="px-4 py-3">Best</th>

              <th className="px-4 py-3">Submission</th>

              <th className="px-4 py-3">Status</th>

              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => {
              const best = student.best_attempt;

              return (
                <tr
                  key={student.student_id}
                  className="border-b border-gray-100 last:border-0"
                >
                  {/* STUDENT */}

                  <td className="px-4 py-4">
                    <p className="text-sm font-semibold text-gray-900">
                      {student.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {student.email}
                    </p>
                  </td>

                  {/* ATTEMPTS */}

                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-semibold text-gray-800">
                      {student.total_attempts}
                    </span>
                  </td>

                  {/* LATEST */}

                  <td className="px-4 py-4">
                    {student.latest_attempt ? (
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {student.latest_attempt.final_score}
                        </p>

                        <PercentageIndicator
                          value={student.latest_attempt.percentage}
                          showBar={false}
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">
                        Not attempted
                      </span>
                    )}
                  </td>

                  {/* BEST */}

                  <td className="px-4 py-4">
                    {best ? (
                      <PercentageIndicator value={best.percentage} />
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>

                  {/* SUBMISSION */}

                  <td className="px-4 py-4">
                    {student.latest_attempt ? (
                      <SubmissionBadge
                        type={student.latest_attempt.submission_type}
                      />
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>

                  {/* STATUS */}

                  <td className="px-4 py-4">
                    <StatusBadge status={student.final_status} />
                  </td>

                  {/* ACTION */}

                  <td className="px-4 py-4">
                    {student.latest_attempt && (
                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/admin/reports/attempts/${student.latest_attempt?.attempt_id}`,
                          )
                        }
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        View Result
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================================================= */}
      {/* MOBILE */}
      {/* ================================================= */}

      <div className="space-y-3 lg:hidden">
        {students.map((student) => {
          const best = student.best_attempt;

          const latest = student.latest_attempt;

          return (
            <div
              key={student.student_id}
              className="rounded-xl border border-gray-200 p-4"
            >
              {/* HEADER */}

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {student.name}
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-500">
                    {student.email}
                  </p>
                </div>

                <StatusBadge status={student.final_status} />
              </div>

              {/* STATS */}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Attempts</p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {student.total_attempts}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Participation</p>

                  <p className="mt-1 text-sm font-semibold text-green-600">
                    {student.participation_status}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Latest Score</p>

                  {latest ? (
                    <div className="mt-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {latest.final_score}
                      </p>

                      <PercentageIndicator
                        value={latest.percentage}
                        showBar={false}
                      />
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-400">Not attempted</p>
                  )}
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Best Score</p>

                  {best ? (
                    <div className="mt-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {best.final_score}
                      </p>

                      <PercentageIndicator
                        value={best.percentage}
                        showBar={false}
                      />
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-400">—</p>
                  )}
                </div>
              </div>

              {/* SUBMISSION */}

              {latest && (
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                  <SubmissionBadge type={latest.submission_type} />

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/admin/reports/attempts/${latest.attempt_id}`,
                      )
                    }
                    className="text-sm font-medium text-blue-600"
                  >
                    View Result →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
