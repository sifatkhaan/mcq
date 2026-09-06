"use client";
import { clearAuth, getStoredUser } from "@/lib/auth/auth-storage";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MobileSidebar from "./MobileSidebar";
export default function AdminHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const user = getStoredUser();
  function handleLogout() {
    clearAuth();
    router.replace("/login");
  }

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Notifications"
          >
            🔔
          </button>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-gray-900">
              {user?.name ?? "User"}
            </p>

            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700 hover:bg-gray-200"
            title="Logout"
          >
            {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
          </button>
        </div>
      </header>

      <MobileSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
