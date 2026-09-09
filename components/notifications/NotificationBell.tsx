"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getUnreadNotificationCount } from "@/lib/api/notifications";
import NotificationDropdown from "./NotificationDropdown";
export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const loadUnreadCount = useCallback(() => {
    getUnreadNotificationCount()
      .then((response) => {
        setUnreadCount(response.count);
      })
      .catch(() => {
        // Keep bell functional even if count request fails.
      });
  }, []);

  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  console.log(unreadCount, "count");

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17H9m10-2V11a7 7 0 10-14 0v4l-2 2h18l-2-2z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 21h4" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <NotificationDropdown
        open={open}
        onClose={() => setOpen(false)}
        onUnreadChange={loadUnreadCount}
      />
    </div>
  );
}
