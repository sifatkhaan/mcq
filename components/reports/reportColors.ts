export type PerformanceColor = "red" | "orange" | "yellow" | "blue" | "green";

export function getPercentageColor(value: number): PerformanceColor {
  if (value < 40) return "red";
  if (value < 60) return "orange";
  if (value < 75) return "yellow";
  if (value < 90) return "blue";

  return "green";
}

export const performanceColors = {
  red: {
    text: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    bar: "bg-red-500",
  },

  orange: {
    text: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    bar: "bg-orange-500",
  },

  yellow: {
    text: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    bar: "bg-yellow-500",
  },

  blue: {
    text: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    bar: "bg-blue-500",
  },

  green: {
    text: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    bar: "bg-green-500",
  },
};

export function getPerformanceColor(level: string): PerformanceColor {
  switch (level.toUpperCase()) {
    case "EXCELLENT":
      return "green";

    case "GOOD":
      return "blue";

    case "AVERAGE":
      return "yellow";

    case "WEAK":
      return "red";

    default:
      return "blue";
  }
}
