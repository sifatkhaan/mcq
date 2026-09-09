import { authenticatedApiClient } from "./authenticated-client";

export interface Notification {
  id: number;
  organization_id: number | null;
  user_id: number;
  type: string;
  title: string;
  message: string;
  channel: string;
  status: "UNREAD" | "READ";
  reference_type: string | null;
  reference_id: number | null;
  read_at: string | null;
  created_at: string;
}

export async function getMyNotifications() {
  return authenticatedApiClient<Notification[]>("/notifications");
}
export async function getUnreadNotificationCount() {
  return authenticatedApiClient<{ count: number }>(
    "/notifications/unread-count",
  );
}
export async function markNotificationAsRead(notificationId: number) {
  return authenticatedApiClient<{
    message: string;
  }>(`/notifications/${notificationId}/read`, {
    method: "PATCH",
  });
}
export async function markAllNotificationsAsRead() {
  return authenticatedApiClient<{
    message: string;
  }>("/notifications/read-all", {
    method: "PATCH",
  });
}
