"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    label: "Home",
    href: "/student",
    icon: "⌂",
  },
  {
    label: "Exams",
    href: "/student/exams",
    icon: "📝",
  },
  {
    label: "Results",
    href: "/student/results",
    icon: "📊",
  },
  {
    label: "Profile",
    href: "/student/profile",
    icon: "👤",
  },
];

export default function StudentBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-lg items-stretch">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-1 flex-col items-center justify-center gap-0.5
                text-xs font-medium
                ${active ? "text-gray-900" : "text-gray-500"}
              `}
            >
              <span className="text-lg leading-none">{item.icon}</span>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
