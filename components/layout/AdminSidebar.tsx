"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getStoredUser } from "@/lib/auth/auth-storage";
import { getUserRoles } from "@/lib/auth/route-access";
import { navigationItems } from "./navigation";
export default function AdminSidebar() {
  const pathname = usePathname();
  const user = getStoredUser();
  const roles = getUserRoles(user);
  const visibleItems = navigationItems.filter((item) =>
    item.roles.some((role) => roles.includes(role)),
  );

  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <span className="text-lg font-bold text-gray-900">MCQ Exam</span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {visibleItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                block rounded-lg px-3 py-2.5 text-sm font-medium transition
                ${
                  active
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
