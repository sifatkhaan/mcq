"use client";
import { clearAuth, getStoredUser } from "@/lib/auth/auth-storage";
import { useRouter } from "next/navigation";
import NotificationBell from "../notifications/NotificationBell";

export default function StudentHeader() {
  const router = useRouter();
  const user = getStoredUser();
  function handleLogout() {
    clearAuth();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4">
        <div>
          <p className="text-base font-bold text-gray-900">MCQ Exam</p>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell />
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700"
            title="Logout"
          >
            {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
          </button>
        </div>
      </div>
    </header>
  );
}
