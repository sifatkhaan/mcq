interface AttemptReportHeaderProps {
  report: {
    student: {
      name: string;
      email: string;
    };

    exam: {
      title: string;
    };

    attempt: {
      attempt_no: number;
      submission_type: string;
      status: string;
      submitted_at: string;
    };
  };
}

export default function AttemptReportHeader({
  report,
}: AttemptReportHeaderProps) {
  const autoSubmitted = report.attempt.submission_type === "TIME_EXPIRED";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">{report.exam.title}</p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {report.student.name}
          </h1>

          <p className="mt-1 text-sm text-gray-500">{report.student.email}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            Attempt #{report.attempt.attempt_no}
          </span>

          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              autoSubmitted
                ? "bg-orange-50 text-orange-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {autoSubmitted ? "Auto Submitted" : "Manual"}
          </span>

          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              report.attempt.status === "SUBMITTED" ||
              report.attempt.status === "AUTO_SUBMITTED"
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {report.attempt.status}
          </span>
        </div>
      </div>
    </div>
  );
}
