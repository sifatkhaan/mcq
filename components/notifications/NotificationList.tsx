"use client";
import type { Notification } from "@/lib/api/notifications";
import NotificationItem from "./NotificationItem";

interface NotificationListProps {
  notifications: Notification[];
  onRead: (notification: Notification) => void;
}

export default function NotificationList({
  notifications,
  onRead,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
          🔔
        </div>

        <p className="mt-3 text-sm font-medium text-gray-700">
          No notifications
        </p>

        <p className="mt-1 text-xs text-gray-400">You are all caught up.</p>
      </div>
    );
  }

  return (
    <div>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRead={onRead}
        />
      ))}
    </div>
  );
}
