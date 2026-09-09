import ReportStatCard from "./ReportStatCard";

import type { ExamResultSummary as ExamResultSummaryType } from "@/lib/api/attemptReports";

interface ExamResultSummaryProps {
  data: ExamResultSummaryType;
}

export default function ExamResultSummary({ data }: ExamResultSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <ReportStatCard title="Passed" value={data.passed} />

      <ReportStatCard title="Failed" value={data.failed} />

      <ReportStatCard
        title="Pass Rate"
        value={`${data.pass_rate}%`}
        percentage={data.pass_rate}
      />

      <ReportStatCard
        title="Average"
        value={`${data.average_percentage}%`}
        percentage={data.average_percentage}
        description={`Average score ${data.average_score}`}
      />
    </div>
  );
}
