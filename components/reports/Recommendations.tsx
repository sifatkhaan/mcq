interface RecommendationsProps {
  items: string[];
}

export default function Recommendations({ items }: RecommendationsProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-500">
        No recommendations available.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((recommendation, index) => (
        <div key={index} className="flex gap-3 rounded-xl bg-blue-50 p-4">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
            {index + 1}
          </div>

          <p className="text-sm text-blue-900">{recommendation}</p>
        </div>
      ))}
    </div>
  );
}
