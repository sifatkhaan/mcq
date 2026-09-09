"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { App } from "antd";
import NotificationList from "./NotificationList";
import {
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/api/notifications";

import type { Notification } from "@/lib/api/notifications";

interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
  onUnreadChange: () => void;
}

export default function NotificationDropdown({
  open,
  onClose,
  onUnreadChange,
}: NotificationDropdownProps) {
  const router = useRouter();
  const { message } = App.useApp();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        const response = await getMyNotifications();

        if (!cancelled) {
          setNotifications(response);
        }
      } catch {
        if (!cancelled) {
          message.error("Failed to load notifications.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [open, message]);

  async function handleRead(notification: Notification) {
    try {
      if (notification.status === "UNREAD") {
        await markNotificationAsRead(notification.id);

        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  status: "READ",
                  read_at: new Date().toISOString(),
                }
              : item,
          ),
        );

        onUnreadChange();
      }

      if (notification.reference_type === "EXAM" && notification.reference_id) {
        onClose();

        router.push(`/student/exams`);
      }
    } catch {
      message.error("Failed to update notification.");
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          status: "READ",
          read_at: notification.read_at ?? new Date().toISOString(),
        })),
      );

      onUnreadChange();

      message.success("All notifications marked as read.");
    } catch {
      message.error("Failed to mark notifications as read.");
    }
  }

  if (!open) {
    return null;
  }

  const unreadCount = notifications.filter(
    (item) => item.status === "UNREAD",
  ).length;

  return (
    <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
      {/* HEADER */}

      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>

          {unreadCount > 0 && (
            <p className="mt-0.5 text-xs text-gray-500">{unreadCount} unread</p>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* BODY */}

      <div className="max-h-[420px] overflow-y-auto">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-xl bg-gray-100 p-4"
              >
                <div className="h-4 w-1/2 rounded bg-gray-200" />

                <div className="mt-2 h-3 w-full rounded bg-gray-200" />

                <div className="mt-2 h-3 w-2/3 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <NotificationList notifications={notifications} onRead={handleRead} />
        )}
      </div>

      {/* FOOTER */}

      <div className="border-t border-gray-100 p-3">
        <button
          type="button"
          onClick={() => {
            onClose();
            router.push("/notifications");
          }}
          className="w-full rounded-xl bg-gray-50 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          View All Notifications
        </button>
      </div>
    </div>
  );
}
