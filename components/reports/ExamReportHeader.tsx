import type {
  ExamAssessmentReport,
  ReportPeriod,
} from "@/lib/api/attemptReports";

import ReportPeriodSelect from "./ReportPeriodSelect";

interface ExamReportHeaderProps {
  report: ExamAssessmentReport;
  period: ReportPeriod;
  onPeriodChange: (value: ReportPeriod) => void;
}

export default function ExamReportHeader({
  report,
  period,
  onPeriodChange,
}: ExamReportHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            {report.exam.title}
          </h1>

          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
            {report.exam.status}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-500">
          {report.exam.total_marks} marks
          {" · "}
          Pass mark {report.exam.pass_marks}
          {" · "}
          Maximum {report.exam.max_attempts} attempts
        </p>
      </div>

      <ReportPeriodSelect value={period} onChange={onPeriodChange} />
    </div>
  );
}
