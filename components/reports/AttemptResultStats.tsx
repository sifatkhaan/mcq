import ReportStatCard from "./ReportStatCard";

interface AttemptResultStatsProps {
  attempt: {
    total_questions: number;
    correct_count: number;
    wrong_count: number;
    unanswered_count: number;
    positive_marks: number;
    negative_marks: number;
    final_score: number;
    percentage: number;
  };
}

export default function AttemptResultStats({
  attempt,
}: AttemptResultStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <ReportStatCard
        title="Final Score"
        value={attempt.final_score}
        description={`${attempt.percentage}%`}
        percentage={attempt.percentage}
      />

      <ReportStatCard
        title="Correct"
        value={attempt.correct_count}
        description={`of ${attempt.total_questions} questions`}
        percentage={
          attempt.total_questions > 0
            ? (attempt.correct_count / attempt.total_questions) * 100
            : 0
        }
      />

      <ReportStatCard
        title="Wrong"
        value={attempt.wrong_count}
        description={`Negative: ${attempt.negative_marks}`}
      />

      <ReportStatCard
        title="Unanswered"
        value={attempt.unanswered_count}
        description={`Positive: ${attempt.positive_marks}`}
      />
    </div>
  );
}
