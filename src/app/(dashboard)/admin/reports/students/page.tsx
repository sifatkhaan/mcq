"use client";

import { useEffect, useState } from "react";
import { getStudentPerformanceReport } from "@/lib/api/attemptReports";
import type {
  ReportPeriod,
  StudentPerformanceReportResponse,
} from "@/lib/api/attemptReports";
import ReportPeriodSelect from "../../../../../../components/reports/ReportPeriodSelect";
import ReportStatCard from "../../../../../../components/reports/ReportStatCard";
import ReportSection from "../../../../../../components/reports/ReportSection";
import StudentPerformanceList from "../../../../../../components/reports/StudentPerformanceList";

export default function StudentReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("monthly");
  const [report, setReport] = useState<StudentPerformanceReportResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;

    async function loadReport() {
      try {
        setLoading(true);
        setError("");

        const response = await getStudentPerformanceReport(period);

        if (!cancelled) {
          setReport(response);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load student report.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadReport();

    return () => {
      cancelled = true;
    };
  }, [period]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-56 rounded bg-gray-200" />

          <div className="h-28 rounded-2xl bg-gray-100" />

          <div className="h-96 rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-2xl bg-red-50 p-6 text-center text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Student Performance
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View student performance for the selected period.
          </p>
        </div>

        <ReportPeriodSelect value={period} onChange={setPeriod} />
      </div>

      {/* SUMMARY */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReportStatCard title="Total Students" value={report.total_students} />

        <ReportStatCard
          title="Excellent"
          value={
            report.students.filter(
              (student) => student.performance_level === "EXCELLENT",
            ).length
          }
        />

        <ReportStatCard
          title="Average"
          value={
            report.students.filter(
              (student) => student.performance_level === "AVERAGE",
            ).length
          }
        />

        <ReportStatCard
          title="Needs Attention"
          value={
            report.students.filter(
              (student) => student.performance_level === "WEAK",
            ).length
          }
        />
      </div>

      {/* STUDENT LIST */}

      <ReportSection
        title="Student Performance"
        description="Performance summary for each student during this period."
      >
        <StudentPerformanceList students={report.students} />
      </ReportSection>
    </div>
  );
}
