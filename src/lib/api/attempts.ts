import { authenticatedApiClient } from "./authenticated-client";

export interface AvailableExam {
  exam_id: number;
  title: string;
  description: string;
  duration_minutes: number;
  total_marks: number;
  pass_marks: number;
  start_at: string;
  end_at: string;
  max_attempts: number;
  assignment_id: number;
  assignment_status: string;
}

export interface StartAttempt {
  id: number;
  exam_id: number;
  attempt_no: number;
  started_at: string;
  expires_at: string;
  total_questions: number;
}

export interface StartAttemptResponse {
  message: string;
  attempt: StartAttempt;
}

export interface AttemptOption {
  id: number;
  option_order: number;
  option_text: string;
}

export interface AttemptQuestion {
  exam_question_id: number;
  question_order: number;
  question_text: string;
  options: AttemptOption[];
  selected_option_id: number | null;
}

export interface AttemptQuestionResponse {
  attempt: {
    id: number;
    exam_id: number;
    started_at: string;
    expires_at: string;
    total_questions: number;
  };

  exam: {
    id: number;
    title: string;
    duration_minutes: number;
    shuffle_questions: boolean;
    shuffle_options: boolean;
  };

  questions: AttemptQuestion[];
}

export interface SaveAnswerResponse {
  message?: string;
  [key: string]: unknown;
}
export interface SubmitAttemptResponse {
  message: string;
  attempt: {
    attempt_id: number;
    exam_id: number;
    attempt_no: number;
    submitted_at: string;
    correct_answers: number;
    wrong_answers: number;
    unanswered: number;
    positive_marks: number;
    negative_marks: number;
    final_score: number;
    percentage: number;
    pass_status: string;
    submission_type: string;
    status: string;
  };
}
export interface AttemptResult {
  attempt_id: number;
  exam: { id: number; title: string; total_marks: number; pass_marks: number };
  attempt_no: number;
  submission_type: string;
  started_at: string;
  submitted_at: string;
  total_questions: number;
  correct: number;
  wrong: number;
  unanswered: number;
  positive_marks: number;
  negative_marks: number;
  final_score: number;
  percentage: number;
  pass_status: string;
}

export interface ReviewOption {
  id: number;
  option_order: number;
  option_text: string;
  is_correct: boolean;
}
export interface ReviewAnswer {
  option_id: number;
  option_text: string;
}
export interface ReviewQuestion {
  exam_question_id: number;
  question_order: number;
  question_text: string;
  your_answer: ReviewAnswer | null;
  is_correct: boolean | null;
  marks_awarded: number;
  correct_answer: ReviewAnswer | null;
  explanation: string | null;
  options: ReviewOption[];
}
export interface AttemptReview {
  attempt: {
    id: number;
    exam_id: number;
    attempt_no: number;
    final_score: number;
    percentage: number;
    pass_status: string;
  };
  exam: {
    id: number;
    title: string;
    allow_review: boolean;
    show_correct_answer: boolean;
    show_explanation: boolean;
  };
  questions: ReviewQuestion[];
}
export interface AttemptHistory {
  attempt_id: number;
  exam_id: number;
  exam_title: string;
  attempt_no: number;
  submission_type: string;
  started_at: string;
  submitted_at: string;
  total_questions: number;
  correct: number;
  wrong: number;
  unanswered: number;
  positive_marks: number;
  negative_marks: number;
  final_score: number;
  total_marks: number;
  pass_marks: number;
  percentage: number;
  pass_status: string;
}

// ==========================================================
// GET AVAILABLE EXAMS
// ==========================================================

export async function getAvailableExams() {
  return authenticatedApiClient<AvailableExam[]>("/attempts/available-exams");
}

// ==========================================================
// START EXAM
// ==========================================================

export async function startExam(examId: number) {
  return authenticatedApiClient<StartAttemptResponse>(
    `/attempts/exams/${examId}/start`,
    {
      method: "POST",
    },
  );
}

// ==========================================================
// GET ATTEMPT QUESTIONS
// ==========================================================

export async function getAttemptQuestions(attemptId: number) {
  return authenticatedApiClient<AttemptQuestionResponse>(
    `/attempts/${attemptId}/questions`,
  );
}

// ==========================================================
// SAVE ANSWER
// ==========================================================

export async function saveAttemptAnswer(
  attemptId: number,
  examQuestionId: number,
  selectedOptionId: number,
) {
  return authenticatedApiClient<SaveAnswerResponse>(
    `/attempts/${attemptId}/answers/${examQuestionId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        selected_option_id: selectedOptionId,
      }),
    },
  );
}

export async function submitAttempt(attemptId: number) {
  return authenticatedApiClient<SubmitAttemptResponse>(
    `/attempts/${attemptId}/submit`,
    { method: "POST" },
  );
}

export async function getAttemptResult(attemptId: number) {
  return authenticatedApiClient<AttemptResult>(`/attempts/${attemptId}/result`);
}

export async function getAttemptReview(attemptId: number) {
  return authenticatedApiClient<AttemptReview>(`/attempts/${attemptId}/review`);
}

export async function getAttemptHistory() {
  return authenticatedApiClient<AttemptHistory[]>("/attempts/history");
}
