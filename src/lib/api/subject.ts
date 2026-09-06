import { authenticatedApiClient } from "./authenticated-client";

export interface Subject {
  id: number;
  organization_id: number;
  name: string;
  code: string | null;
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

export interface CreateSubjectPayload {
  name: string;
  code?: string;
  description?: string;
}

export interface UpdateSubjectPayload {
  name?: string;
  code?: string;
  description?: string;
  status?: string;
}

// ==========================================
// GET ALL SUBJECTS
// ==========================================

export async function getSubjects(organizationId?: number) {
  const searchParams = new URLSearchParams();
  if (organizationId) {
    searchParams.set("organization_id", String(organizationId));
  }
  const query = searchParams.toString();

  return authenticatedApiClient<Subject[]>(
    `/subjects${query ? `?${query}` : ""}`,
  );
}

// ==========================================
// GET ONE SUBJECT
// ==========================================

export async function getSubject(id: number) {
  return authenticatedApiClient<Subject>(`/subjects/${id}`);
}

// ==========================================
// CREATE SUBJECT
// ==========================================

export async function createSubject(payload: CreateSubjectPayload) {
  return authenticatedApiClient<Subject>("/subjects", {
    method: "POST",

    body: JSON.stringify(payload),
  });
}

// ==========================================
// UPDATE SUBJECT
// ==========================================

export async function updateSubject(id: number, payload: UpdateSubjectPayload) {
  return authenticatedApiClient<Subject>(`/subjects/${id}`, {
    method: "PATCH",

    body: JSON.stringify(payload),
  });
}

// ==========================================
// DELETE SUBJECT
// ==========================================

export async function deleteSubject(id: number) {
  return authenticatedApiClient(`/subjects/${id}`, {
    method: "DELETE",
  });
}
