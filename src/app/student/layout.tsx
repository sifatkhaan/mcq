"use client";

import { ReactNode, useEffect } from "react";

import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth/auth-storage";
import StudentHeader from "../../../components/layout/StudentHeader";
import StudentBottomNav from "../../../components/layout/StudentBottomNav";

// import { getAccessToken } from "@/lib/auth/auth-storage";

// import StudentHeader from "@/components/layout/StudentHeader";

// import StudentBottomNav from "@/components/layout/StudentBottomNav";

interface StudentLayoutProps {
  children: ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />

      <main className="min-h-[calc(100vh-3.5rem)] pb-20">{children}</main>

      <StudentBottomNav />
    </div>
  );
}
