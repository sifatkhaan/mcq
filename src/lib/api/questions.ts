import { authenticatedApiClient } from "./authenticated-client";

export interface QuestionOption {
  id?: number;
  question_version_id?: number;
  option_text: string;
  option_order: number;
  is_correct: boolean;
  created_at?: string;
}

export interface Question {
  id: number;
  subject_id: number;
  chapter_id: number;
  topic_id: number;
  status: string;
  subject_name: string;
  chapter_no: number;
  chapter_name: string;
  topic_no: number;
  topic_name: string;
  version_id?: number;
  version_no?: number;
  question_text?: string;
  difficulty?: string;
  version?: QuestionVersion;
}

export interface QuestionVersion {
  id: number;
  question_id: number;
  version_no: number;
  question_text: string;
  explanation: string | null;
  difficulty: string;
  status: string;
  created_by: number;
  created_at: string;
  options: QuestionOption[];
}

export interface CreateQuestionPayload {
  subject_id: number;
  chapter_id: number;
  topic_id: number;
  question_text: string;
  explanation?: string;
  difficulty: string;
  options: QuestionOption[];
}

export interface UpdateQuestionPayload {
  subject_id: number;
  chapter_id: number;
  topic_id: number;
  question_text: string;
  explanation?: string;
  difficulty: string;
  options: QuestionOption[];
}

export interface QuestionListResponse {
  data: Question[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

// ==========================================
// GET QUESTIONS
// ==========================================

export async function getQuestions(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  subjectId?: number;
  chapterId?: number;
  topicId?: number;
  difficulty?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params?.page) {
    searchParams.set("page", String(params.page));
  }

  if (params?.pageSize) {
    searchParams.set("page_size", String(params.pageSize));
  }

  if (params?.search) {
    searchParams.set("search", params.search);
  }

  if (params?.subjectId) {
    searchParams.set("subject_id", String(params.subjectId));
  }

  if (params?.chapterId) {
    searchParams.set("chapter_id", String(params.chapterId));
  }

  if (params?.topicId) {
    searchParams.set("topic_id", String(params.topicId));
  }

  if (params?.difficulty) {
    searchParams.set("difficulty", params.difficulty);
  }

  const query = searchParams.toString();

  return authenticatedApiClient<QuestionListResponse>(
    `/questions${query ? `?${query}` : ""}`,
  );
}

// ==========================================
// GET ONE QUESTION
// ==========================================

export async function getQuestion(id: number) {
  return authenticatedApiClient<Question>(`/questions/${id}`);
}

// ==========================================
// CREATE QUESTION
// ==========================================

export async function createQuestion(payload: CreateQuestionPayload) {
  return authenticatedApiClient<Question>("/questions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ==========================================
// UPDATE QUESTION
// ==========================================

export async function updateQuestion(
  id: number,
  payload: UpdateQuestionPayload,
) {
  return authenticatedApiClient<Question>(`/questions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// ==========================================
// DELETE QUESTION
// ==========================================

export async function deleteQuestion(id: number) {
  return authenticatedApiClient(`/questions/${id}`, {
    method: "DELETE",
  });
}
// ==========================================
// GET QUESTION VERSIONS
// ==========================================

export async function getQuestionVersions(questionId: number) {
  return authenticatedApiClient<QuestionVersion[]>(
    `/questions/${questionId}/versions`,
  );
}
