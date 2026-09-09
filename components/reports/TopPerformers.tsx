import type { TopPerformer } from "@/lib/api/attemptReports";

interface TopPerformersProps {
  students: TopPerformer[];
}

export default function TopPerformers({ students }: TopPerformersProps) {
  if (students.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-gray-500">
        No top performers found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {students.map((student, index) => (
        <div
          key={student.student_id}
          className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
            {index + 1}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">
              {student.name}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {student.total_attempts}{" "}
              {student.total_attempts === 1 ? "attempt" : "attempts"}
              {" · "}
              Pass rate {student.pass_rate}%
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">
              {student.average_percentage}%
            </p>

            <p className="text-[11px] text-gray-500">
              {student.performance_level}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
