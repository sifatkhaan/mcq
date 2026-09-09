"use client";
import { ReactNode } from "react";
import RoleGuard from "../../../components/auth/RoleGuard";
import StudentHeader from "../../../components/layout/StudentHeader";
import StudentBottomNav from "../../../components/layout/StudentBottomNav";

interface StudentLayoutProps {
  children: ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <RoleGuard area="student">
      <div className="min-h-screen bg-gray-50">
        <StudentHeader />
        <main className="min-h-[calc(100vh-3.5rem)] pb-20 px-2">
          {children}
        </main>
        <StudentBottomNav />
      </div>
    </RoleGuard>
  );
}
