"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAvailableExams, startExam } from "@/lib/api/attempts";
import type { AvailableExam } from "@/lib/api/attempts";
import Button from "../../../../components/button/Button";
export default function StudentExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<AvailableExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingExamId, setStartingExamId] = useState<number | null>(null);
  const [error, setError] = useState("");
  // =========================================================
  // LOAD AVAILABLE EXAMS
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    async function loadExams() {
      try {
        setLoading(true);

        setError("");

        const result = await getAvailableExams();

        if (!cancelled) {
          setExams(result);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load available exams.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadExams();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================================================
  // START EXAM
  // =========================================================

  async function handleStartExam(examId: number) {
    try {
      setStartingExamId(examId);

      setError("");

      const result = await startExam(examId);

      const attemptId = result.attempt.id;

      router.push(`/student/attempt/${attemptId}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to start exam.",
      );
    } finally {
      setStartingExamId(null);
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="animate-pulse space-y-4">
          <div className="h-7 w-48 rounded bg-gray-200" />

          <div className="h-24 rounded-2xl bg-gray-100" />

          <div className="h-24 rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Available Exams</h1>

        <p className="mt-1 text-sm text-gray-500">
          Exams assigned to you are shown here.
        </p>
      </div>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ================================================= */}
      {/* EMPTY */}
      {/* ================================================= */}

      {exams.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-sm font-medium text-gray-700">
            No exams available
          </p>

          <p className="mt-1 text-xs text-gray-500">
            You currently have no assigned exams.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {exams.map((exam) => (
            <div
              key={exam.exam_id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                {/* DETAILS */}

                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {exam.title}
                  </h2>

                  {exam.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {exam.description}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                      {exam.duration_minutes} minutes
                    </span>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                      {exam.total_marks} marks
                    </span>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                      Pass: {exam.pass_marks}
                    </span>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                      {exam.assignment_status}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-gray-400">
                    Available until {new Date(exam.end_at).toLocaleString()}
                  </p>
                </div>
                <div className="shrink-0">
                  <Button
                    loading={startingExamId === exam.exam_id}
                    loadingText="Starting..."
                    disabled={startingExamId !== null}
                    onClick={() => handleStartExam(exam.exam_id)}
                  >
                    Start Exam
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
