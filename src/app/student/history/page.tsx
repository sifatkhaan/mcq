"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAttemptHistory } from "@/lib/api/attempts";
import type { AttemptHistory } from "@/lib/api/attempts";
import Button from "../../../../components/button/Button";
export default function StudentHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<AttemptHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // =========================================================
  // LOAD HISTORY
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      try {
        setLoading(true);
        setError("");

        const result = await getAttemptHistory();

        if (!cancelled) {
          setHistory(result);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load attempt history.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-20 rounded-2xl bg-gray-100" />
          <div className="h-20 rounded-2xl bg-gray-100" />
          <div className="h-20 rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Exam History</h1>

        <p className="mt-1 text-sm text-gray-500">
          View your previous exam attempts and results.
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

      {history.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-sm font-medium text-gray-700">No exam history</p>

          <p className="mt-1 text-xs text-gray-500">
            Your completed exam attempts will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {history.map((attempt) => {
            const passed = attempt.pass_status === "PASS";

            const timeExpired = attempt.submission_type === "TIME_EXPIRED";

            return (
              <div
                key={attempt.attempt_id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* ================================= */}
                  {/* EXAM */}
                  {/* ================================= */}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
                        {attempt.exam_title}
                      </h2>

                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                        Attempt #{attempt.attempt_no}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      Submitted{" "}
                      {new Date(attempt.submitted_at).toLocaleString()}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          passed
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {attempt.pass_status}
                      </span>

                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                        {timeExpired ? "Time Expired" : "Manual Submit"}
                      </span>
                    </div>
                  </div>

                  {/* ================================= */}
                  {/* SCORE */}
                  {/* ================================= */}

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex lg:items-center">
                    <div className="rounded-xl bg-gray-50 px-4 py-3 text-center">
                      <p className="text-lg font-bold text-gray-900">
                        {attempt.final_score}
                        <span className="text-xs font-normal text-gray-400">
                          {" "}
                          / {attempt.total_marks}
                        </span>
                      </p>

                      <p className="text-[11px] text-gray-500">Score</p>
                    </div>

                    <div className="rounded-xl bg-gray-50 px-4 py-3 text-center">
                      <p className="text-lg font-bold text-gray-900">
                        {attempt.percentage}%
                      </p>

                      <p className="text-[11px] text-gray-500">Percentage</p>
                    </div>

                    <div className="rounded-xl bg-gray-50 px-4 py-3 text-center">
                      <p className="text-lg font-bold text-green-600">
                        {attempt.correct}
                      </p>

                      <p className="text-[11px] text-gray-500">Correct</p>
                    </div>

                    <div className="rounded-xl bg-gray-50 px-4 py-3 text-center">
                      <p className="text-lg font-bold text-red-600">
                        {attempt.wrong}
                      </p>

                      <p className="text-[11px] text-gray-500">Wrong</p>
                    </div>
                  </div>

                  {/* ================================= */}
                  {/* ACTION */}
                  {/* ================================= */}

                  <div className="shrink-0">
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/student/result/${attempt.attempt_id}`)
                      }
                    >
                      View Result
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
