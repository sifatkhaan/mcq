"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getExamStudentsReport } from "@/lib/api/attemptReports";
import type { ExamStudentsReportResponse } from "@/lib/api/attemptReports";
import ExamStudentSummary from "../../../../../../../../components/reports/ExamStudentSummary";
import ReportSection from "../../../../../../../../components/reports/ReportSection";
import ExamStudentPerformanceList from "../../../../../../../../components/reports/ExamStudentPerformanceList";
export default function ExamStudentsReportPage() {
  const params = useParams();
  const router = useRouter();
  const examId = Number(params.id);
  const [report, setReport] = useState<ExamStudentsReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;

    async function loadReport() {
      try {
        setLoading(true);
        setError("");

        const response = await getExamStudentsReport(examId);

        if (!cancelled) {
          setReport(response);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load exam students report.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (Number.isFinite(examId)) {
      loadReport();
    }

    return () => {
      cancelled = true;
    };
  }, [examId]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <div className="animate-pulse space-y-5">
          <div className="h-10 w-72 rounded bg-gray-200" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <div key={index} className="h-28 rounded-2xl bg-gray-100" />
            ))}
          </div>

          <div className="h-80 rounded-2xl bg-gray-100" />
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

      <div>
        <button
          type="button"
          onClick={() => router.push(`/admin/reports/exams/${examId}`)}
          className="mb-3 text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Exam Report
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {report.exam.title}
          </h1>

          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
            {report.exam.status}
          </span>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          Student performance and participation
        </p>
      </div>

      {/* SUMMARY */}

      <ExamStudentSummary data={report.summary} />

      {/* STUDENTS */}

      <ReportSection
        title="Student Performance"
        description="Student-wise performance for this exam."
      >
        <ExamStudentPerformanceList students={report.students} />
      </ReportSection>
    </div>
  );
}
