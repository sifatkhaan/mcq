import ReportStatCard from "./ReportStatCard";
import type { StudentOverallReport } from "@/lib/api/attemptReports";

interface PerformanceSummaryProps {
  data: StudentOverallReport;
}

export default function PerformanceSummary({ data }: PerformanceSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <ReportStatCard title="Total Attempts" value={data.total_attempts} />

      <ReportStatCard
        title="Pass Rate"
        value={`${data.pass_rate}%`}
        percentage={data.pass_rate}
        description={`${data.passed} passed · ${data.failed} failed`}
      />

      <ReportStatCard
        title="Average"
        value={`${data.average_percentage}%`}
        percentage={data.average_percentage}
        description={`Average score ${data.average_score}`}
      />

      <ReportStatCard
        title="Best Performance"
        value={`${data.best_percentage}%`}
        percentage={data.best_percentage}
        description={`Lowest ${data.lowest_percentage}%`}
      />
    </div>
  );
}
