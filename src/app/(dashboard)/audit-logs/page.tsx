"use client";

import { useEffect, useState } from "react";
import { getAuditLogs } from "@/lib/api/auditLogs";
import type { AuditLog, AuditLogPagination } from "@/lib/api/auditLogs";
import AuditLogTable from "../../../../components/auditLogs/AuditLogTable";
import AuditLogDetails from "../../../../components/auditLogs/AuditLogDetails";
import Pagination from "../../../../components/common/Pagination";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [search, setSearch] = useState("");
  const [loadedAt, setLoadedAt] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [pagination, setPagination] = useState<AuditLogPagination>({
    page: 1,
    page_size: 10,
    total: 0,
    total_pages: 0,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadLogs() {
      try {
        setLoading(true);
        setError("");

        const response = await getAuditLogs(page, pageSize);

        if (!cancelled) {
          setLogs(response.data);
          setPagination(response.pagination);
          setLoadedAt(Date.now());
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load audit logs.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLogs();

    return () => {
      cancelled = true;
    };
  }, [page, pageSize]);

  const filteredLogs = logs.filter((log) => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return true;
    }

    return (
      log.action.toLowerCase().includes(term) ||
      log.entity_type.toLowerCase().includes(term) ||
      String(log.entity_id ?? "").includes(term) ||
      String(log.user_id ?? "").includes(term)
    );
  });

  const uniqueUsers = new Set(
    logs.map((log) => log.user_id).filter((id) => id !== null),
  ).size;

  const recentLogs = loadedAt
    ? logs.filter(
        (log) =>
          loadedAt - new Date(log.created_at).getTime() < 24 * 60 * 60 * 1000,
      ).length
    : 0;

  const handlePageChange = (newPage: number) => {
    setSearch("");
    setSelectedLog(null);
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setSearch("");
    setSelectedLog(null);
    setPageSize(newPageSize);
    setPage(1);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {" "}
      <div>
        {" "}
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track important activities and changes made in your organization.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total Logs</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {pagination.total}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <p className="text-xs font-medium text-blue-600">Last 24 Hours</p>

          <p className="mt-2 text-2xl font-bold text-blue-700">{recentLogs}</p>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
          <p className="text-xs font-medium text-purple-600">Active Users</p>

          <p className="mt-2 text-2xl font-bold text-purple-700">
            {uniqueUsers}
          </p>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Activity History
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {filteredLogs.length} log
              {filteredLogs.length !== 1 ? "s" : ""} on this page
            </p>
          </div>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search this page..."
            className="h-10 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-72"
          />
        </div>

        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-xl bg-gray-100 p-5"
              />
            ))}
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
              📋
            </div>

            <p className="mt-3 text-sm font-medium text-gray-700">
              No audit logs found
            </p>

            <p className="mt-1 text-xs text-gray-400">
              There are no activities matching your search.
            </p>
          </div>
        ) : (
          <AuditLogTable logs={filteredLogs} onView={setSelectedLog} />
        )}

        {!loading && !error && pagination.total > 0 && (
          <Pagination
            page={pagination.page}
            pageSize={pagination.page_size}
            total={pagination.total}
            totalPages={pagination.total_pages}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
      <AuditLogDetails
        log={selectedLog}
        open={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
