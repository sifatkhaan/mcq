import type { AcademicPerformance as AcademicPerformanceType } from "@/lib/api/attemptReports";
import PercentageIndicator from "./PercentageIndicator";
interface AcademicPerformanceProps {
  title: string;
  data: AcademicPerformanceType[];
}

export default function AcademicPerformance({
  title,
  data,
}: AcademicPerformanceProps) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-800">{title}</h3>

      {data.length === 0 ? (
        <div className="rounded-xl bg-gray-50 p-4 text-center text-xs text-gray-500">
          No data available.
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-100 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {item.correct} correct · {item.wrong} wrong ·{" "}
                    {item.unanswered} unanswered
                  </p>
                </div>

                <PercentageIndicator value={item.percentage} />
              </div>

              <div className="mt-3 flex flex-wrap gap-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
                <span>
                  Questions:{" "}
                  <strong className="text-gray-700">
                    {item.total_questions}
                  </strong>
                </span>

                <span>
                  Marks:{" "}
                  <strong className="text-gray-700">
                    {item.earned_marks}
                    {" / "}
                    {item.possible_marks}
                  </strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
