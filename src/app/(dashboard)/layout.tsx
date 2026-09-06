"use client";
import { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/api/auth/auth-storage";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
