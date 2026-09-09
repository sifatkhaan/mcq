import PercentageIndicator from "./PercentageIndicator";

import type { ExamResultSummary } from "@/lib/api/attemptReports";

interface ExamScoreRangeProps {
  data: ExamResultSummary;
}

export default function ExamScoreRange({ data }: ExamScoreRangeProps) {
  const hasPercentageData =
    data.highest_percentage !== null && data.lowest_percentage !== null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-green-100 bg-green-50 p-4">
        <p className="text-xs font-medium text-green-700">
          Highest Performance
        </p>

        {data.highest_score === null ? (
          <p className="mt-2 text-sm text-gray-500">No attempts yet.</p>
        ) : (
          <div className="mt-2">
            <p className="text-xl font-bold text-gray-900">
              {data.highest_score}
            </p>

            {hasPercentageData && (
              <div className="mt-2">
                <PercentageIndicator value={data.highest_percentage!} />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
        <p className="text-xs font-medium text-orange-700">
          Lowest Performance
        </p>

        {data.lowest_score === null ? (
          <p className="mt-2 text-sm text-gray-500">No attempts yet.</p>
        ) : (
          <div className="mt-2">
            <p className="text-xl font-bold text-gray-900">
              {data.lowest_score}
            </p>

            {data.lowest_percentage !== null && (
              <div className="mt-2">
                <PercentageIndicator value={data.lowest_percentage} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
