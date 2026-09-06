import type { UserRole } from "@/types/auth";
export interface NavigationItem {
  label: string;
  href: string;
  roles: UserRole[];
}

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    roles: ["SUPER_ADMIN", "ADMIN", "EXAMINER", "TEACHER"],
  },
  {
    label: "Questions",
    href: "/questions",
    roles: ["SUPER_ADMIN", "ADMIN", "EXAMINER", "TEACHER"],
  },
  {
    label: "Exams",
    href: "/exams",
    roles: ["SUPER_ADMIN", "ADMIN", "EXAMINER", "TEACHER"],
  },
  {
    label: "Subjects",
    href: "/subjects",
    roles: ["SUPER_ADMIN", "ADMIN", "EXAMINER", "TEACHER"],
  },
  {
    label: "Students",
    href: "/students",
    roles: ["SUPER_ADMIN", "ADMIN", "EXAMINER", "TEACHER"],
  },
  {
    label: "Reports",
    href: "/reports",
    roles: ["SUPER_ADMIN", "ADMIN", "EXAMINER", "TEACHER"],
  },
  {
    label: "Notifications",
    href: "/notifications",
    roles: ["SUPER_ADMIN", "ADMIN", "EXAMINER", "TEACHER"],
  },
];
