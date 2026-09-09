import { ReactNode } from "react";

interface ReportSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function ReportSection({
  title,
  description,
  children,
}: ReportSectionProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
