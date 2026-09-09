"use client";
import { useEffect, useState } from "react";
import { getAttemptReportDashboard } from "@/lib/api/attemptReports";
import type { DashboardReport, ReportPeriod } from "@/lib/api/attemptReports";
import ReportPeriodSelect from "../../../../../components/reports/ReportPeriodSelect";
import ReportStatCard from "../../../../../components/reports/ReportStatCard";
import ReportSection from "../../../../../components/reports/ReportSection";
import PerformanceDistribution from "../../../../../components/reports/PerformanceDistribution";
import TopPerformers from "../../../../../components/reports/TopPerformers";
import EmptyReportState from "../../../../../components/reports/EmptyReportState";
export default function AdminReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("monthly");
  const [report, setReport] = useState<DashboardReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // =========================================================
  // LOAD REPORT
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    async function loadReport() {
      try {
        setLoading(true);
        setError("");

        const response = await getAttemptReportDashboard(period);

        if (!cancelled) {
          setReport(response);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load report.",
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

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-48 rounded bg-gray-200" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div key={index} className="h-28 rounded-2xl bg-gray-100" />
            ))}
          </div>

          <div className="h-64 rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

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
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reports Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Overview of student participation and exam performance.
          </p>
        </div>

        <ReportPeriodSelect value={period} onChange={setPeriod} />
      </div>

      {/* ================================================= */}
      {/* STUDENT / ATTEMPT SUMMARY */}
      {/* ================================================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReportStatCard title="Total Students" value={report.students.total} />

        <ReportStatCard
          title="Participation Rate"
          value={`${report.students.participation_rate}%`}
          percentage={report.students.participation_rate}
          description={`${report.students.participated} students participated`}
        />

        <ReportStatCard title="Total Attempts" value={report.attempts.total} />

        <ReportStatCard
          title="Pass Rate"
          value={`${report.attempts.pass_rate}%`}
          percentage={report.attempts.pass_rate}
          description={`${report.attempts.passed} passed · ${report.attempts.failed} failed`}
        />
      </div>

      {/* ================================================= */}
      {/* PERFORMANCE */}
      {/* ================================================= */}

      <ReportSection title="Performance Overview">
        <div className="grid gap-4 sm:grid-cols-3">
          <ReportStatCard
            title="Average Percentage"
            value={`${report.performance.average_percentage}%`}
            percentage={report.performance.average_percentage}
          />

          <ReportStatCard
            title="Best Average"
            value={`${report.performance.best_average}%`}
            percentage={report.performance.best_average}
          />

          <ReportStatCard
            title="Lowest Average"
            value={`${report.performance.lowest_average}%`}
            percentage={report.performance.lowest_average}
          />
        </div>
      </ReportSection>

      {/* ================================================= */}
      {/* DISTRIBUTION + TOP PERFORMERS */}
      {/* ================================================= */}

      <div className="grid gap-6 lg:grid-cols-2">
        <ReportSection
          title="Performance Distribution"
          description="Students grouped by their performance level."
        >
          <PerformanceDistribution data={report.performance_distribution} />
        </ReportSection>

        <ReportSection
          title="Top Performers"
          description="Students with the strongest performance during this period."
        >
          <TopPerformers students={report.top_performers} />
        </ReportSection>
      </div>

      {/* ================================================= */}
      {/* NEEDS ATTENTION */}
      {/* ================================================= */}

      <ReportSection
        title="Needs Attention"
        description="Students who may require additional support."
      >
        {report.needs_attention.length === 0 ? (
          <EmptyReportState message="No students need attention for this period." />
        ) : (
          <TopPerformers students={report.needs_attention} />
        )}
      </ReportSection>

      {/* ================================================= */}
      {/* NO PARTICIPATION */}
      {/* ================================================= */}

      <ReportSection
        title="No Participation"
        description="Students who did not participate during this period."
      >
        {report.no_participation.length === 0 ? (
          <EmptyReportState message="All students participated during this period." />
        ) : (
          <TopPerformers students={report.no_participation} />
        )}
      </ReportSection>
    </div>
  );
}
