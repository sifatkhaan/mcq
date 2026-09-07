import { authenticatedApiClient } from "./authenticated-client";

export interface Chapter {
  id: number;
  subject_id: number;
  chapter_no: number;
  name: string;
  description: string | null;
  status: string;
  created_by: number;
  created_at: string;
  updated_by: number | null;
  updated_at: string | null;
  is_deleted: boolean;
  deleted_by: number | null;
  deleted_at: string | null;
}

export interface CreateChapterPayload {
  subject_id: number;
  chapter_no: number;
  name: string;
  description?: string;
}

export interface UpdateChapterPayload {
  subject_id?: number;
  chapter_no?: number;
  name?: string;
  description?: string;
  status?: string;
}

// ==========================================
// GET ALL CHAPTERS
// ==========================================

export async function getChapters(subjectId?: number) {
  const searchParams = new URLSearchParams();

  if (subjectId) {
    searchParams.set("subject_id", String(subjectId));
  }

  const query = searchParams.toString();

  return authenticatedApiClient<Chapter[]>(
    `/chapters${query ? `?${query}` : ""}`,
  );
}

// ==========================================
// GET ONE CHAPTER
// ==========================================

export async function getChapter(id: number) {
  return authenticatedApiClient<Chapter>(`/chapters/${id}`);
}

// ==========================================
// CREATE CHAPTER
// ==========================================

export async function createChapter(payload: CreateChapterPayload) {
  return authenticatedApiClient<Chapter>("/chapters", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ==========================================
// UPDATE CHAPTER
// ==========================================

export async function updateChapter(id: number, payload: UpdateChapterPayload) {
  return authenticatedApiClient<Chapter>(`/chapters/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// ==========================================
// DELETE CHAPTER
// ==========================================

export async function deleteChapter(id: number) {
  return authenticatedApiClient(`/chapters/${id}`, {
    method: "DELETE",
  });
}
