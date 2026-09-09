import type { UserRole } from "@/types/auth";
export interface NavigationItem {
  label: string;
  href: string;
  roles: UserRole[];
}

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/",
    roles: ["SUPER_ADMIN", "ADMIN", "EXAMINER", "TEACHER"],
  },
  {
    label: "Questions",
    href: "/question",
    roles: ["SUPER_ADMIN", "ADMIN", "EXAMINER", "TEACHER"],
  },
  {
    label: "Exams",
    href: "/exam",
    roles: ["SUPER_ADMIN", "ADMIN", "EXAMINER", "TEACHER"],
  },
  {
    label: "Subjects",
    href: "/subject",
    roles: ["SUPER_ADMIN", "ADMIN", "EXAMINER", "TEACHER"],
  },
  {
    label: "Students",
    href: "/admin/students",
    roles: ["SUPER_ADMIN", "ADMIN", "EXAMINER", "TEACHER"],
  },
  {
    label: "Reports",
    href: "/admin/reports",
    roles: ["SUPER_ADMIN", "ADMIN", "EXAMINER", "TEACHER"],
  },
  {
    label: "Notifications",
    href: "/notifications",
    roles: ["SUPER_ADMIN", "ADMIN", "EXAMINER", "TEACHER"],
  },
];
