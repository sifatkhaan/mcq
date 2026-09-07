import { authenticatedApiClient } from "./authenticated-client";

export interface Topic {
  id: number;

  chapter_id: number;

  topic_no: number;

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

export interface CreateTopicPayload {
  chapter_id: number;

  topic_no: number;

  name: string;

  description?: string;
}

export interface UpdateTopicPayload {
  chapter_id?: number;

  topic_no?: number;

  name?: string;

  description?: string;

  status?: string;
}

// ==========================================
// GET ALL TOPICS
// ==========================================

export async function getTopics(chapterId?: number) {
  const searchParams = new URLSearchParams();

  if (chapterId) {
    searchParams.set("chapter_id", String(chapterId));
  }

  const query = searchParams.toString();

  return authenticatedApiClient<Topic[]>(`/topics${query ? `?${query}` : ""}`);
}

// ==========================================
// GET ONE TOPIC
// ==========================================

export async function getTopic(id: number) {
  return authenticatedApiClient<Topic>(`/topics/${id}`);
}

// ==========================================
// CREATE TOPIC
// ==========================================

export async function createTopic(payload: CreateTopicPayload) {
  return authenticatedApiClient<Topic>("/topics", {
    method: "POST",

    body: JSON.stringify(payload),
  });
}

// ==========================================
// UPDATE TOPIC
// ==========================================

export async function updateTopic(id: number, payload: UpdateTopicPayload) {
  return authenticatedApiClient<Topic>(`/topics/${id}`, {
    method: "PATCH",

    body: JSON.stringify(payload),
  });
}

// ==========================================
// DELETE TOPIC
// ==========================================

export async function deleteTopic(id: number) {
  return authenticatedApiClient(`/topics/${id}`, {
    method: "DELETE",
  });
}
