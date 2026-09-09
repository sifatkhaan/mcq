import type {
  StudentAssessmentReport,
  ReportPeriod,
} from "@/lib/api/attemptReports";
import ReportPeriodSelect from "./ReportPeriodSelect";
import { getPerformanceColor, performanceColors } from "./reportColors";
interface StudentReportHeaderProps {
  report: StudentAssessmentReport;
  period: ReportPeriod;
  onPeriodChange: (value: ReportPeriod) => void;
}
export default function StudentReportHeader({
  report,
  period,
  onPeriodChange,
}: StudentReportHeaderProps) {
  const color = getPerformanceColor(report.performance_level);
  const colors = performanceColors[color];

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold ${colors.bg} ${colors.text}`}
        >
          {report.student.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {report.student.name}
            </h1>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${colors.bg} ${colors.text}`}
            >
              {report.performance_level}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">{report.student.email}</p>
        </div>
      </div>
      <ReportPeriodSelect value={period} onChange={onPeriodChange} />
    </div>
  );
}
