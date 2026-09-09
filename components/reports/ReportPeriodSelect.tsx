import type { ReportPeriod } from "@/lib/api/attemptReports";

interface ReportPeriodSelectProps {
  value: ReportPeriod;
  onChange: (value: ReportPeriod) => void;
}

export default function ReportPeriodSelect({
  value,
  onChange,
}: ReportPeriodSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="report-period"
        className="text-sm font-medium text-gray-600"
      >
        Period
      </label>
      <select
        id="report-period"
        value={value}
        onChange={(event) => onChange(event.target.value as ReportPeriod)}
        className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-500"
      >
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
    </div>
  );
}
