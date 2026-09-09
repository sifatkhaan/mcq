import ReportStatCard from "./ReportStatCard";

interface ExamStudentSummaryProps {
  data: {
    assigned_students: number;
    participated_students: number;
    non_participants: number;
    passed_students: number;
    failed_students: number;
  };
}

export default function ExamStudentSummary({ data }: ExamStudentSummaryProps) {
  const participationRate =
    data.assigned_students > 0
      ? (data.participated_students / data.assigned_students) * 100
      : 0;

  const passRate =
    data.participated_students > 0
      ? (data.passed_students / data.participated_students) * 100
      : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <ReportStatCard title="Assigned" value={data.assigned_students} />

      <ReportStatCard
        title="Participated"
        value={data.participated_students}
        percentage={participationRate}
      />

      <ReportStatCard title="Non Participants" value={data.non_participants} />

      <ReportStatCard title="Passed" value={data.passed_students} />

      <ReportStatCard
        title="Pass Rate"
        value={`${passRate.toFixed(1)}%`}
        percentage={passRate}
        description={`${data.passed_students} passed · ${data.failed_students} failed`}
      />
    </div>
  );
}
