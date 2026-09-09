import { useRouter } from "next/navigation";
import type { Exam } from "@/lib/api/exams";
import Button from "../button/Button";
interface ExamReportCardProps {
  exam: Exam;
}

export default function ExamReportCard({ exam }: ExamReportCardProps) {
  const router = useRouter();

  function handleViewReport() {
    router.push(`/admin/reports/exams/${exam.id}`);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-semibold text-gray-900">
              {exam.title}
            </h3>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                exam.status === "PUBLISHED"
                  ? "bg-green-50 text-green-700"
                  : exam.status === "CLOSED"
                    ? "bg-gray-100 text-gray-600"
                    : "bg-yellow-50 text-yellow-700"
              }`}
            >
              {exam.status}
            </span>
          </div>

          {exam.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
              {exam.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
            <span>
              Marks:{" "}
              <strong className="text-gray-700">{exam.total_marks}</strong>
            </span>

            <span>
              Pass: <strong className="text-gray-700">{exam.pass_marks}</strong>
            </span>

            <span>
              Duration:{" "}
              <strong className="text-gray-700">
                {exam.duration_minutes} min
              </strong>
            </span>

            <span>
              Attempts:{" "}
              <strong className="text-gray-700">{exam.max_attempts}</strong>
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <Button onClick={handleViewReport}>View Report</Button>
        </div>
      </div>
    </div>
  );
}
