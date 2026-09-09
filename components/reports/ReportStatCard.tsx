import { getPercentageColor, performanceColors } from "./reportColors";

interface ReportStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  percentage?: number;
}

export default function ReportStatCard({
  title,
  value,
  description,
  percentage,
}: ReportStatCardProps) {
  const color =
    percentage !== undefined ? getPercentageColor(percentage) : undefined;

  const colors = color ? performanceColors[color] : null;

  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm ${
        colors ? colors.border : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>

        {percentage !== undefined && (
          <span className={`h-2.5 w-2.5 rounded-full ${colors?.bar}`} />
        )}
      </div>

      <p
        className={`mt-2 text-2xl font-bold ${
          colors ? colors.text : "text-gray-900"
        }`}
      >
        {value}
      </p>

      {description && (
        <p className="mt-1 text-xs text-gray-400">{description}</p>
      )}

      {percentage !== undefined && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full ${colors?.bar}`}
            style={{
              width: `${Math.min(Math.max(percentage, 0), 100)}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
