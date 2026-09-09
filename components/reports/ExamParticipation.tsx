import ReportStatCard from "./ReportStatCard";

import type { ExamParticipation as ExamParticipationType } from "@/lib/api/attemptReports";

interface ExamParticipationProps {
  data: ExamParticipationType;
}

export default function ExamParticipation({ data }: ExamParticipationProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <ReportStatCard
        title="Assigned Students"
        value={data.assigned_students}
      />

      <ReportStatCard title="Participants" value={data.participants} />

      <ReportStatCard title="Non Participants" value={data.non_participants} />

      <ReportStatCard
        title="Participation Rate"
        value={`${data.participation_rate}%`}
        percentage={data.participation_rate}
        description={`${data.total_attempts} total attempts`}
      />
    </div>
  );
}
