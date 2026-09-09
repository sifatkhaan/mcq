import { getPercentageColor, performanceColors } from "./reportColors";

interface PercentageIndicatorProps {
  value: number;
  showBar?: boolean;
}

export default function PercentageIndicator({
  value,
  showBar = true,
}: PercentageIndicatorProps) {
  const color = getPercentageColor(value);

  const colors = performanceColors[color];

  return (
    <div className="min-w-24">
      <div className={`text-sm font-bold ${colors.text}`}>{value}%</div>

      {showBar && (
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all ${colors.bar}`}
            style={{
              width: `${Math.min(Math.max(value, 0), 100)}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
