import { authenticatedApiClient } from "./authenticated-client";

export interface AuditLog {
  id: number;
  organization_id: number | null;
  user_id: number | null;
  action: string;
  entity_type: string;
  entity_id: number | null;
  old_values: string | null;
  new_values: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface AuditLogPagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface AuditLogResponse {
  data: AuditLog[];
  pagination: AuditLogPagination;
}

// =========================================================
// GET AUDIT LOGS
// =========================================================

export async function getAuditLogs(page = 1, pageSize = 10) {
  return authenticatedApiClient<AuditLogResponse>(
    `/audit-logs?page=${page}&page_size=${pageSize}`,
  );
}
