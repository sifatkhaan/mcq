interface AuditActionBadgeProps {
  action: string;
}

export default function AuditActionBadge({ action }: AuditActionBadgeProps) {
  const normalized = action.toUpperCase();
  const styles: Record<string, string> = {
    CREATE: "bg-green-100 text-green-700",
    INSERT: "bg-green-100 text-green-700",
    UPDATE: "bg-blue-100 text-blue-700",
    DELETE: "bg-red-100 text-red-700",
    PUBLISH: "bg-purple-100 text-purple-700",
    CLOSE: "bg-orange-100 text-orange-700",
    ASSIGN: "bg-indigo-100 text-indigo-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[normalized] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {normalized}
    </span>
  );
}
