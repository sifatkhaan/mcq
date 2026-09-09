import type { StudentPerformanceTrend as TrendItem } from "@/lib/api/attemptReports";
import PercentageIndicator from "./PercentageIndicator";
interface PerformanceTrendProps {
  data: TrendItem[];
}

export default function PerformanceTrend({ data }: PerformanceTrendProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500">
        No performance trend available.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div
          key={item.attempt_id}
          className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">
              {item.exam_title}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Attempt #{item.attempt_id}
              {" · "}
              {new Date(item.submitted_at).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <PercentageIndicator value={item.percentage} />

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                item.pass_status === "PASS"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {item.pass_status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
