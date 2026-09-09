import { authenticatedApiClient } from "@/lib/api/authenticated-client";

// ==========================================================
// TYPES
// ==========================================================

export type ReportPeriod = "weekly" | "monthly";

export interface DashboardStudentStats {
  total: number;
  participated: number;
  no_attempts: number;
  participation_rate: number;
}

export interface DashboardAttemptStats {
  total: number;
  passed: number;
  failed: number;
  pass_rate: number;
}

export interface DashboardPerformanceStats {
  average_percentage: number;
  best_average: number;
  lowest_average: number;
}

export interface PerformanceDistribution {
  excellent: number;
  good: number;
  average: number;
  weak: number;
  no_data: number;
}

export interface TopPerformer {
  student_id: number;
  name: string;
  total_attempts: number;
  average_percentage: number;
  pass_rate: number;
  performance_level: string;
}

export interface DashboardReport {
  period: string;
  from_date: string;
  to_date: string;
  students: DashboardStudentStats;
  attempts: DashboardAttemptStats;
  performance: DashboardPerformanceStats;
  performance_distribution: PerformanceDistribution;
  top_performers: TopPerformer[];
  needs_attention: TopPerformer[];
  no_participation: TopPerformer[];
}
export interface StudentPerformanceReport {
  student_id: number;
  name: string;
  email: string;
  total_attempts: number;
  passed: number;
  failed: number;
  pass_rate: number;
  average_percentage: number;
  best_percentage: number;
  lowest_percentage: number;
  performance_level: string;
}

export interface StudentPerformanceReportResponse {
  period: string;
  from_date: string;
  to_date: string;
  total_students: number;
  students: StudentPerformanceReport[];
}

// ==========================================================
// ADMIN DASHBOARD REPORT
// ==========================================================

export async function getAttemptReportDashboard(
  period: ReportPeriod = "monthly",
) {
  return authenticatedApiClient<DashboardReport>(
    `/attempt-reports/dashboard?period=${period}`,
  );
}
export async function getStudentPerformanceReport(
  period: ReportPeriod = "monthly",
) {
  return authenticatedApiClient<StudentPerformanceReportResponse>(
    `/attempt-reports/students?period=${period}`,
  );
}
export interface StudentReportStudent {
  id: number;
  name: string;
  email: string;
}
export interface StudentOverallReport {
  total_attempts: number;
  passed: number;
  failed: number;
  pass_rate: number;
  average_percentage: number;
  average_score: number;
  best_percentage: number;
  lowest_percentage: number;
  performance_level: string;
}

export interface AcademicPerformance {
  id: number;
  name: string;
  total_questions: number;
  correct: number;
  wrong: number;
  unanswered: number;
  earned_marks: number;
  possible_marks: number;
  percentage: number;
}

export interface StudentPerformanceTrend {
  attempt_id: number;
  exam_id: number;
  exam_title: string;
  submitted_at: string;
  final_score: number;
  total_marks: number;
  percentage: number;
  pass_status: string;
}

export interface StudentAssessmentReport {
  student: StudentReportStudent;
  report_type: string;
  period: string;
  from_date: string;
  to_date: string;
  overall: StudentOverallReport;
  academic: {
    strongest_subject: AcademicPerformance | null;
    weakest_subject: AcademicPerformance | null;
    weak_chapters: AcademicPerformance[];
    weak_topics: AcademicPerformance[];
  };

  performance_level: string;
  subject_performance: AcademicPerformance[];
  chapter_performance: AcademicPerformance[];
  topic_performance: AcademicPerformance[];
  performance_trend: StudentPerformanceTrend[];
  recommendations: string[];
}

export async function getStudentAssessmentReport(
  studentId: number,
  period: ReportPeriod = "weekly",
) {
  return authenticatedApiClient<StudentAssessmentReport>(
    `/attempt-reports/students/${studentId}?period=${period}`,
  );
}
// ==========================================================
// EXAM ASSESSMENT REPORT
// ==========================================================

export interface ExamReportInfo {
  id: number;
  title: string;
  status: string;
  total_marks: number;
  pass_marks: number;
  max_attempts: number;
}

export interface ExamParticipation {
  assigned_students: number;
  participants: number;
  non_participants: number;
  participation_rate: number;
  total_attempts: number;
}

export interface ExamResultSummary {
  passed: number;
  failed: number;
  pass_rate: number;
  average_score: number;
  average_percentage: number;
  highest_score: number | null;
  lowest_score: number | null;
  highest_percentage: number | null;
  lowest_percentage: number | null;
}

export interface ExamQuestionPerformance {
  id: number;
  question_text: string;
  total_attempts: number;
  correct: number;
  wrong: number;
  unanswered: number;
  correct_rate: number;
  marks?: number;
}

export interface ExamAssessmentReport {
  period: string;
  from_date: string;
  to_date: string;
  exam: ExamReportInfo;
  participation: ExamParticipation;
  result_summary: ExamResultSummary;
  question_performance: ExamQuestionPerformance[];
  most_difficult_questions: ExamQuestionPerformance[];
  easiest_questions: ExamQuestionPerformance[];
}

export async function getExamAssessmentReport(
  examId: number,
  period: ReportPeriod = "weekly",
) {
  return authenticatedApiClient<ExamAssessmentReport>(
    `/attempt-reports/exams/${examId}?period=${period}`,
  );
}
export interface ExamStudentAttempt {
  attempt_id: number;
  attempt_no: number;
  submission_type: string;
  submitted_at: string;
  final_score: number;
  percentage: number;
  result_status: string;
}

export interface ExamStudentReportItem {
  assignment_id: number;
  student_id: number;
  name: string;
  email: string;
  assignment_status: string;
  participation_status: string;
  total_attempts: number;
  latest_attempt: ExamStudentAttempt | null;
  best_attempt: ExamStudentAttempt | null;
  final_status: string;
}

export interface ExamStudentsReportResponse {
  exam: ExamReportInfo;

  summary: {
    assigned_students: number;
    participated_students: number;
    non_participants: number;
    passed_students: number;
    failed_students: number;
  };

  students: ExamStudentReportItem[];
}

export async function getExamStudentsReport(examId: number) {
  return authenticatedApiClient<ExamStudentsReportResponse>(
    `/attempt-reports/exams/${examId}/students`,
  );
}
export interface AttemptReportOption {
  id: number;
  option_text: string;
  option_order: number;
  is_correct: boolean;
}

export interface AttemptReportQuestion {
  exam_question_id: number;
  question_order: number;
  question_version_id: number;
  question_text: string;

  subject: {
    id: number;
    name: string;
  };

  chapter: {
    id: number;
    name: string;
  };

  topic: {
    id: number;
    name: string;
  };

  marks: number;
  negative_marks: number;

  answered: boolean;

  selected_option: {
    id: number;
    option_text: string;
    option_order: number;
    is_correct: boolean;
  } | null;

  correct_option: {
    id: number;
    option_text: string;
    option_order: number;
    is_correct: boolean;
  } | null;

  is_correct: boolean;
  marks_awarded: number;

  answered_at: string | null;
  explanation: string | null;

  options: AttemptReportOption[];
}

export interface AttemptReport {
  student: {
    id: number;
    name: string;
    email: string;
  };

  exam: {
    id: number;
    title: string;
    total_marks: number;
    pass_marks: number;
    negative_marking_enabled: boolean;
  };

  attempt: {
    id: number;
    assignment_id: number;
    attempt_no: number;
    status: string;
    submission_type: string;

    started_at: string;
    expires_at: string;
    submitted_at: string;

    total_questions: number;
    correct_count: number;
    wrong_count: number;
    unanswered_count: number;

    positive_marks: number;
    negative_marks: number;
    final_score: number;
    percentage: number;

    result_status: string;
  };

  questions: AttemptReportQuestion[];
}

export async function getAttemptReport(attemptId: number) {
  return authenticatedApiClient<AttemptReport>(
    `/attempt-reports/attempts/${attemptId}`,
  );
}
