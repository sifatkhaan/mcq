"use client";

import { useEffect, useState } from "react";

import { App } from "antd";

import {
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/api/notifications";

import type { Notification } from "@/lib/api/notifications";
import NotificationList from "../../../../components/notifications/NotificationList";

export default function NotificationsPage() {
  const { message } = App.useApp();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [message]);

  async function handleRead(notification: Notification) {
    if (notification.status === "READ") {
      return;
    }

    try {
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
    } catch {
      message.error("Failed to mark notification as read.");
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

      message.success("All notifications marked as read.");
    } catch {
      message.error("Failed to mark notifications as read.");
    }
  }

  const unreadCount = notifications.filter(
    (notification) => notification.status === "UNREAD",
  ).length;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>

          <p className="mt-1 text-sm text-gray-500">
            Stay updated with your exams and results.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="w-fit rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* CONTENT */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-xl bg-gray-100 p-5"
              >
                <div className="h-4 w-1/3 rounded bg-gray-200" />

                <div className="mt-2 h-3 w-full rounded bg-gray-200" />

                <div className="mt-2 h-3 w-2/3 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <NotificationList notifications={notifications} onRead={handleRead} />
        )}
      </div>
    </div>
  );
}
