import type { PerformanceDistribution as PerformanceDistributionType } from "@/lib/api/attemptReports";

import { getPerformanceColor, performanceColors } from "./reportColors";

interface PerformanceDistributionProps {
  data: PerformanceDistributionType;
}

const items = [
  {
    key: "excellent",
    label: "Excellent",
    level: "EXCELLENT",
  },

  {
    key: "good",
    label: "Good",
    level: "GOOD",
  },

  {
    key: "average",
    label: "Average",
    level: "AVERAGE",
  },

  {
    key: "weak",
    label: "Weak",
    level: "WEAK",
  },

  {
    key: "no_data",
    label: "No Data",
    level: "NO_DATA",
  },
] as const;

export default function PerformanceDistribution({
  data,
}: PerformanceDistributionProps) {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);

  return (
    <div className="space-y-5">
      {items.map((item) => {
        const value = data[item.key];

        const percentage = total > 0 ? (value / total) * 100 : 0;

        const color = getPerformanceColor(item.level);

        const colors = performanceColors[color];

        return (
          <div key={item.key}>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${colors.bar}`} />

                <span className="text-sm text-gray-600">{item.label}</span>
              </div>

              <span className={`text-sm font-semibold ${colors.text}`}>
                {value}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all ${colors.bar}`}
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
