import { authenticatedApiClient } from "./authenticated-client";

export interface Exam {
  id: number;

  organization_id: number;

  title: string;

  description: string | null;

  duration_minutes: number;

  total_marks: number;

  pass_marks: number;

  negative_marking_enabled: boolean;

  default_correct_mark: number;

  default_negative_mark: number;

  shuffle_questions: boolean;

  shuffle_options: boolean;

  show_result: boolean;

  allow_review: boolean;

  show_correct_answer: boolean;

  show_explanation: boolean;

  max_attempts: number;

  start_at: string | null;

  end_at: string | null;

  status: string;

  created_by: number;

  created_at: string;

  updated_by: number | null;

  updated_at: string | null;

  is_deleted: boolean;

  deleted_by: number | null;

  deleted_at: string | null;
}

export interface CreateExamPayload {
  title: string;

  description?: string;

  duration_minutes: number;

  total_marks: number;

  pass_marks: number;

  negative_marking_enabled: boolean;

  default_correct_mark: number;

  default_negative_mark: number;

  shuffle_questions: boolean;

  shuffle_options: boolean;

  show_result: boolean;

  allow_review: boolean;

  show_correct_answer: boolean;

  show_explanation: boolean;

  max_attempts: number;

  start_at: string;

  end_at: string;
}

export interface UpdateExamPayload {
  title: string;

  description?: string;

  duration_minutes: number;

  total_marks: number;

  pass_marks: number;

  negative_marking_enabled: boolean;

  default_correct_mark: number;

  default_negative_mark: number;

  shuffle_questions: boolean;

  shuffle_options: boolean;

  show_result: boolean;

  allow_review: boolean;

  show_correct_answer: boolean;

  show_explanation: boolean;

  max_attempts: number;

  start_at: string;

  end_at: string;
}

// ==========================================
// GET ALL EXAMS
// ==========================================

export async function getExams() {
  return authenticatedApiClient<Exam[]>("/exams");
}

// ==========================================
// GET ONE EXAM
// ==========================================

export async function getExam(id: number) {
  return authenticatedApiClient<Exam>(`/exams/${id}`);
}

// ==========================================
// CREATE EXAM
// ==========================================

export async function createExam(payload: CreateExamPayload) {
  return authenticatedApiClient<Exam>("/exams", {
    method: "POST",

    body: JSON.stringify(payload),
  });
}

// ==========================================
// UPDATE EXAM
// ==========================================

export async function updateExam(id: number, payload: UpdateExamPayload) {
  return authenticatedApiClient<Exam>(`/exams/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// ==========================================
// PUBLISH EXAM
// ==========================================

export async function publishExam(id: number) {
  return authenticatedApiClient<Exam>(`/exams/${id}/publish`, {
    method: "PATCH",
  });
}

// ==========================================
// CLOSE EXAM
// ==========================================

export async function closeExam(id: number) {
  return authenticatedApiClient<Exam>(`/exams/${id}/close`, {
    method: "PATCH",
  });
}

// ==========================================
// DELETE EXAM
// ==========================================

export async function deleteExam(id: number) {
  return authenticatedApiClient(`/exams/${id}`, {
    method: "DELETE",
  });
}
