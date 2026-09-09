"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { getStudentAssessmentReport } from "@/lib/api/attemptReports";

import type {
  ReportPeriod,
  StudentAssessmentReport,
} from "@/lib/api/attemptReports";
import StudentReportHeader from "../../../../../../../components/reports/StudentReportHeader";
import PerformanceSummary from "../../../../../../../components/reports/PerformanceSummary";
import ReportSection from "../../../../../../../components/reports/ReportSection";
import PercentageIndicator from "../../../../../../../components/reports/PercentageIndicator";
import AcademicPerformance from "../../../../../../../components/reports/AcademicPerformance";
import PerformanceTrend from "../../../../../../../components/reports/PerformanceTrend";
import Recommendations from "../../../../../../../components/reports/Recommendations";

export default function StudentAssessmentPage() {
  const params = useParams();

  const studentId = Number(params.id);

  const [period, setPeriod] = useState<ReportPeriod>("weekly");

  const [report, setReport] = useState<StudentAssessmentReport | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadReport() {
      try {
        setLoading(true);
        setError("");

        const response = await getStudentAssessmentReport(studentId, period);

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

    if (Number.isFinite(studentId)) {
      loadReport();
    }

    return () => {
      cancelled = true;
    };
  }, [studentId, period]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <div className="animate-pulse space-y-5">
          <div className="h-14 w-72 rounded-xl bg-gray-200" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div key={index} className="h-28 rounded-2xl bg-gray-100" />
            ))}
          </div>

          <div className="h-72 rounded-2xl bg-gray-100" />
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

      <StudentReportHeader
        report={report}
        period={period}
        onPeriodChange={setPeriod}
      />

      {/* SUMMARY */}

      <PerformanceSummary data={report.overall} />

      {/* ACADEMIC HIGHLIGHTS */}

      <ReportSection
        title="Academic Highlights"
        description="Strongest and weakest academic areas."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-green-100 bg-green-50 p-4">
            <p className="text-xs font-medium text-green-700">
              Strongest Subject
            </p>

            {report.academic.strongest_subject ? (
              <div className="mt-2">
                <p className="text-base font-semibold text-gray-900">
                  {report.academic.strongest_subject.name}
                </p>

                <div className="mt-2">
                  <PercentageIndicator
                    value={report.academic.strongest_subject.percentage}
                  />
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">No data available.</p>
            )}
          </div>

          <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
            <p className="text-xs font-medium text-orange-700">
              Weakest Subject
            </p>

            {report.academic.weakest_subject ? (
              <div className="mt-2">
                <p className="text-base font-semibold text-gray-900">
                  {report.academic.weakest_subject.name}
                </p>

                <div className="mt-2">
                  <PercentageIndicator
                    value={report.academic.weakest_subject.percentage}
                  />
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">No data available.</p>
            )}
          </div>
        </div>
      </ReportSection>

      {/* SUBJECT PERFORMANCE */}

      <ReportSection title="Subject Performance">
        <AcademicPerformance
          title="Subjects"
          data={report.subject_performance}
        />
      </ReportSection>

      {/* CHAPTER + TOPIC */}

      <div className="grid gap-6 lg:grid-cols-2">
        <ReportSection title="Chapter Performance">
          <AcademicPerformance
            title="Chapters"
            data={report.chapter_performance}
          />
        </ReportSection>

        <ReportSection title="Topic Performance">
          <AcademicPerformance title="Topics" data={report.topic_performance} />
        </ReportSection>
      </div>

      {/* WEAK AREAS */}

      {(report.academic.weak_chapters.length > 0 ||
        report.academic.weak_topics.length > 0) && (
        <ReportSection title="Areas Needing Improvement">
          <div className="grid gap-6 lg:grid-cols-2">
            <AcademicPerformance
              title="Weak Chapters"
              data={report.academic.weak_chapters}
            />

            <AcademicPerformance
              title="Weak Topics"
              data={report.academic.weak_topics}
            />
          </div>
        </ReportSection>
      )}

      {/* PERFORMANCE TREND */}

      <ReportSection
        title="Performance Trend"
        description="Recent exam performance during the selected period."
      >
        <PerformanceTrend data={report.performance_trend} />
      </ReportSection>

      {/* RECOMMENDATIONS */}

      <ReportSection
        title="Recommendations"
        description="Suggested actions based on the student's performance."
      >
        <Recommendations items={report.recommendations} />
      </ReportSection>
    </div>
  );
}
