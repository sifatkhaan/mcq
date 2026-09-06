import { authenticatedApiClient } from "./authenticated-client";

export interface DashboardStats {
  totalQuestions?: number;
  totalExams?: number;
  totalStudents?: number;
  totalSubjects?: number;
  upcomingExams?: number;
  completedExams?: number;
  averageScore?: number;
  passedExams?: number;
  failedExams?: number;
}

export async function getDashboardStats() {
  return authenticatedApiClient<DashboardStats>("/dashboard/stats");
}
