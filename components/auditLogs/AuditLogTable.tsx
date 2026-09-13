"use client";
import { useMemo } from "react";
import type { AuditLog } from "@/lib/api/auditLogs";
import AuditActionBadge from "./AuditActionBadge";
interface AuditLogTableProps {
  logs: AuditLog[];
  onView: (log: AuditLog) => void;
}

export default function AuditLogTable({ logs, onView }: AuditLogTableProps) {
  const sortedLogs = useMemo(
    () =>
      [...logs].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [logs],
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
              Date
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
              Action
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
              Entity
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
              Record ID
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
              User
            </th>

            <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">
              Details
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedLogs.map((log) => (
            <tr
              key={log.id}
              className="border-b border-gray-50 transition hover:bg-gray-50"
            >
              <td className="px-5 py-4 text-xs text-gray-500">
                {new Date(log.created_at).toLocaleString()}
              </td>

              <td className="px-5 py-4">
                <AuditActionBadge action={log.action} />
              </td>

              <td className="px-5 py-4">
                <span className="text-sm font-medium text-gray-800">
                  {log.entity_type}
                </span>
              </td>

              <td className="px-5 py-4 text-sm text-gray-600">
                {log.entity_id ?? "—"}
              </td>

              <td className="px-5 py-4 text-sm text-gray-600">
                {log.user_id ? `User #${log.user_id}` : "System"}
              </td>

              <td className="px-5 py-4 text-right">
                <button
                  type="button"
                  onClick={() => onView(log)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
