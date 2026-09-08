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

export interface ExamQuestion {
  exam_question_id: number;
  exam_id: number;
  question_version_id: number;
  question_order: number;
  marks: number;
  negative_marks: number;
  question_id: number;
  version_no: number;
  question_text: string;
  difficulty: string;
  subject_name: string;
}
export interface AddExamQuestionPayload {
  question_version_id: number;
  question_order: number;
  marks: number;
  negative_marks: number;
}

export interface ExamAssignment {
  assignment_id: number;
  exam_id: number;
  student_id: number;
  status: string;
  assigned_at: string;
  completed_at: string | null;
  student_username: string;
  student_email: string;
}
export interface AvailableStudent {
  id: number;
  username: string;
  email: string;
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

// ==========================================
// GET EXAM QUESTIONS
// ==========================================
export async function getExamQuestions(examId: number) {
  return authenticatedApiClient<ExamQuestion[]>(`/exams/${examId}/questions`);
}
// ==========================================
// ADD QUESTION TO EXAM
// ==========================================
export async function addExamQuestion(
  examId: number,
  payload: AddExamQuestionPayload,
) {
  return authenticatedApiClient<ExamQuestion>(`/exams/${examId}/questions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ==========================================
// DELETE QUESTION FROM EXAM
// ==========================================

export async function deleteExamQuestion(
  examId: number,
  examQuestionId: number,
) {
  return authenticatedApiClient(
    `/exams/${examId}/questions/${examQuestionId}`,
    {
      method: "DELETE",
    },
  );
}
// ==========================================
//  EXAM ASSIGNMENTS
// ==========================================
export async function getExamAssignments(examId: number) {
  return authenticatedApiClient<ExamAssignment[]>(
    `/exams/${examId}/assignments`,
  );
}

export async function getAvailableStudents(examId: number) {
  return authenticatedApiClient<AvailableStudent[]>(
    `/exams/${examId}/available-students`,
  );
}

export async function assignStudentToExam(examId: number, studentId: number) {
  return authenticatedApiClient<ExamAssignment>(
    `/exams/${examId}/assignments`,
    { method: "POST", body: JSON.stringify({ student_id: studentId }) },
  );
}
