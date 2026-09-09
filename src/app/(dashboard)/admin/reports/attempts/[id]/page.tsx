"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAttemptReport } from "@/lib/api/attemptReports";
import type { AttemptReport } from "@/lib/api/attemptReports";
import AttemptReportHeader from "../../../../../../../components/reports/AttemptReportHeader";
import AttemptResultStats from "../../../../../../../components/reports/AttemptResultStats";
import ReportSection from "../../../../../../../components/reports/ReportSection";
import AttemptQuestionResult from "../../../../../../../components/reports/AttemptQuestionResult";

export default function AttemptReportPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = Number(params.id);
  const [report, setReport] = useState<AttemptReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadReport() {
      try {
        setLoading(true);
        setError("");

        const response = await getAttemptReport(attemptId);

        if (!cancelled) {
          setReport(response);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load attempt report.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (Number.isFinite(attemptId)) {
      loadReport();
    }

    return () => {
      cancelled = true;
    };
  }, [attemptId]);
  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <div className="animate-pulse space-y-5">
          <div className="h-32 rounded-2xl bg-gray-100" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div key={index} className="h-28 rounded-2xl bg-gray-100" />
            ))}
          </div>

          {Array.from({
            length: 3,
          }).map((_, index) => (
            <div key={index} className="h-56 rounded-2xl bg-gray-100" />
          ))}
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
      {/* BACK */}

      <button
        type="button"
        onClick={() => router.back()}
        className="text-sm text-gray-500 hover:text-gray-900"
      >
        ← Back
      </button>

      {/* HEADER */}

      <AttemptReportHeader report={report} />

      {/* RESULT STATS */}

      <AttemptResultStats attempt={report.attempt} />

      {/* ATTEMPT INFORMATION */}

      <ReportSection
        title="Attempt Information"
        description="Details about this exam attempt."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs text-gray-500">Started At</p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {new Date(report.attempt.started_at).toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs text-gray-500">Submitted At</p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {new Date(report.attempt.submitted_at).toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs text-gray-500">Total Marks</p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {report.exam.total_marks}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs text-gray-500">Pass Marks</p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {report.exam.pass_marks}
            </p>
          </div>
        </div>
      </ReportSection>

      {/* QUESTION DETAILS */}

      <ReportSection
        title="Question-wise Performance"
        description={`${report.questions.length} questions in this attempt.`}
      >
        <div className="space-y-4">
          {report.questions.map((question) => (
            <AttemptQuestionResult
              key={question.exam_question_id}
              question={question}
            />
          ))}
        </div>
      </ReportSection>
    </div>
  );
}
