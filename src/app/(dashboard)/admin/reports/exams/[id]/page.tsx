"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReportSection from "../../../../../../../components/reports/ReportSection";
import ExamReportHeader from "../../../../../../../components/reports/ExamReportHeader";
import ExamParticipation from "../../../../../../../components/reports/ExamParticipation";
import ExamResultSummary from "../../../../../../../components/reports/ExamResultSummary";
import ExamScoreRange from "../../../../../../../components/reports/ExamScoreRange";
import EmptyReportState from "../../../../../../../components/reports/EmptyReportState";
import { getExamAssessmentReport } from "@/lib/api/attemptReports";

import type {
  ExamAssessmentReport,
  ReportPeriod,
} from "@/lib/api/attemptReports";

export default function ExamAssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const examId = Number(params.id);
  const [period, setPeriod] = useState<ReportPeriod>("weekly");
  const [report, setReport] = useState<ExamAssessmentReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;

    async function loadReport() {
      try {
        setLoading(true);
        setError("");

        const response = await getExamAssessmentReport(examId, period);

        if (!cancelled) {
          setReport(response);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load exam report.",
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
  }, [examId, period]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <div className="animate-pulse space-y-5">
          <div className="h-16 w-80 rounded-xl bg-gray-200" />

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
      {/* HEADER */}

      <ExamReportHeader
        report={report}
        period={period}
        onPeriodChange={setPeriod}
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            router.push(`/admin/reports/exams/${report.exam.id}/students`)
          }
          className="inline-flex h-10 items-center rounded-xl bg-gray-900 px-4 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          View Students
        </button>
      </div>

      <ReportSection
        title="Participation"
        description="Student participation in this exam."
      >
        <ExamParticipation data={report.participation} />
      </ReportSection>

      {/* RESULT SUMMARY */}

      <ReportSection
        title="Result Summary"
        description="Overall result statistics for this exam."
      >
        <ExamResultSummary data={report.result_summary} />
      </ReportSection>

      {/* SCORE RANGE */}

      <ReportSection title="Score Range">
        <ExamScoreRange data={report.result_summary} />
      </ReportSection>

      {/* QUESTION PERFORMANCE */}

      <ReportSection
        title="Question Performance"
        description="Performance of students on individual questions."
      >
        {report.question_performance.length === 0 ? (
          <EmptyReportState message="No question performance data is available for this period." />
        ) : (
          <div className="space-y-3">
            {report.question_performance.map((question) => (
              <div
                key={question.id}
                className="rounded-xl border border-gray-100 p-4"
              >
                <p className="text-sm font-medium text-gray-900">
                  {question.question_text}
                </p>

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                  <span>
                    Attempts:{" "}
                    <strong className="text-gray-700">
                      {question.total_attempts}
                    </strong>
                  </span>

                  <span>
                    Correct:{" "}
                    <strong className="text-green-600">
                      {question.correct}
                    </strong>
                  </span>

                  <span>
                    Wrong:{" "}
                    <strong className="text-red-600">{question.wrong}</strong>
                  </span>

                  <span>
                    Unanswered:{" "}
                    <strong className="text-gray-700">
                      {question.unanswered}
                    </strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ReportSection>

      {/* DIFFICULT / EASY */}

      <div className="grid gap-6 lg:grid-cols-2">
        <ReportSection title="Most Difficult Questions">
          {report.most_difficult_questions.length === 0 ? (
            <EmptyReportState message="No difficult question data available." />
          ) : (
            <div className="space-y-3">
              {report.most_difficult_questions.map((question) => (
                <div
                  key={question.id}
                  className="rounded-xl border border-red-100 bg-red-50 p-4"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {question.question_text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ReportSection>

        <ReportSection title="Easiest Questions">
          {report.easiest_questions.length === 0 ? (
            <EmptyReportState message="No easy question data available." />
          ) : (
            <div className="space-y-3">
              {report.easiest_questions.map((question) => (
                <div
                  key={question.id}
                  className="rounded-xl border border-green-100 bg-green-50 p-4"
                >
                  <p className="text-sm font-medium text-gray-900">
                    {question.question_text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ReportSection>
      </div>
    </div>
  );
}
