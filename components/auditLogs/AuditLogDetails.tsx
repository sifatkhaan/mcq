"use client";

import { Modal } from "antd";

import type { AuditLog } from "@/lib/api/auditLogs";

interface AuditLogDetailsProps {
  log: AuditLog | null;
  open: boolean;
  onClose: () => void;
}

function formatJson(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

export default function AuditLogDetails({
  log,
  open,
  onClose,
}: AuditLogDetailsProps) {
  if (!log) {
    return null;
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Audit Log Details"
      width={800}
    >
      <div className="space-y-5">
        {/* BASIC INFO */}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-400">Action</p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {log.action}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">Entity</p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {log.entity_type}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">Record ID</p>

            <p className="mt-1 text-sm text-gray-700">{log.entity_id ?? "—"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400">User ID</p>

            <p className="mt-1 text-sm text-gray-700">
              {log.user_id ?? "System"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">IP Address</p>

            <p className="mt-1 text-sm text-gray-700">
              {log.ip_address ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">Created At</p>

            <p className="mt-1 text-sm text-gray-700">
              {new Date(log.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* OLD VALUES */}

        {log.old_values && (
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-800">
              Old Values
            </p>

            <pre className="max-h-72 overflow-auto rounded-xl bg-gray-50 p-4 text-xs leading-5 text-gray-700">
              {formatJson(log.old_values)}
            </pre>
          </div>
        )}

        {/* NEW VALUES */}

        {log.new_values && (
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-800">
              New Values
            </p>

            <pre className="max-h-72 overflow-auto rounded-xl bg-gray-50 p-4 text-xs leading-5 text-gray-700">
              {formatJson(log.new_values)}
            </pre>
          </div>
        )}

        {/* USER AGENT */}

        {log.user_agent && (
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-800">
              User Agent
            </p>

            <p className="break-all rounded-xl bg-gray-50 p-4 text-xs leading-5 text-gray-600">
              {log.user_agent}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
