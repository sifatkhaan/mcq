"use client";
import type { Notification } from "@/lib/api/notifications";
interface NotificationItemProps {
  notification: Notification;
  onRead: (notification: Notification) => void;
}
function getNotificationIcon(type: string) {
  switch (type) {
    case "EXAM_ASSIGNED":
      return "📝";

    case "EXAM_PUBLISHED":
      return "📢";

    case "RESULT_AVAILABLE":
      return "🏆";

    case "EXAM_COMPLETED":
      return "✅";

    case "EXAM_CLOSING_SOON":
      return "⏰";

    default:
      return "🔔";
  }
}

export default function NotificationItem({
  notification,
  onRead,
}: NotificationItemProps) {
  const unread = notification.status === "UNREAD";

  return (
    <button
      type="button"
      onClick={() => onRead(notification)}
      className={`w-full border-b border-gray-100 p-4 text-left transition hover:bg-gray-50 ${
        unread ? "bg-blue-50/40" : "bg-white"
      }`}
    >
      <div className="flex gap-3">
        {/* ICON */}

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
            unread ? "bg-blue-100" : "bg-gray-100"
          }`}
        >
          {getNotificationIcon(notification.type)}
        </div>

        {/* CONTENT */}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`text-sm ${
                unread
                  ? "font-semibold text-gray-900"
                  : "font-medium text-gray-700"
              }`}
            >
              {notification.title}
            </p>

            {unread && (
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
            )}
          </div>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
            {notification.message}
          </p>

          <p className="mt-2 text-[11px] text-gray-400">
            {new Date(notification.created_at).toLocaleString()}
          </p>
        </div>
      </div>
    </button>
  );
}
