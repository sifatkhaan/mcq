"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getStoredUser } from "@/lib/auth/auth-storage";
import { navigationItems } from "./navigation";
interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const user = getStoredUser();
  const roles = user?.roles ?? [];
  const visibleItems = navigationItems.filter((item) =>
    item.roles.some((role) => roles.includes(role)),
  );

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Close menu"
      />
      <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl">
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
          <span className="text-lg font-bold text-gray-900">MCQ Exam</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {visibleItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  block rounded-lg px-3 py-3 text-sm font-medium
                  ${
                    active
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
