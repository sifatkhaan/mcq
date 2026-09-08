"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAttemptResult } from "@/lib/api/attempts";
import type { AttemptResult } from "@/lib/api/attempts";
import Button from "../../../../../components/button/Button";
export default function StudentResultPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = Number(params.id);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // =========================================================
  // LOAD RESULT
  // =========================================================

  useEffect(() => {
    if (!attemptId) {
      return;
    }

    let cancelled = false;

    async function loadResult() {
      try {
        setLoading(true);

        setError("");

        const response = await getAttemptResult(attemptId);

        if (!cancelled) {
          setResult(response);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load result.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadResult();

    return () => {
      cancelled = true;
    };
  }, [attemptId]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-8 w-56 rounded bg-gray-200" />

          <div className="mx-auto h-4 w-72 rounded bg-gray-200" />

          <div className="h-40 rounded-2xl bg-gray-100" />

          <div className="grid gap-3 sm:grid-cols-4">
            <div className="h-24 rounded-2xl bg-gray-100" />

            <div className="h-24 rounded-2xl bg-gray-100" />

            <div className="h-24 rounded-2xl bg-gray-100" />

            <div className="h-24 rounded-2xl bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-2xl bg-red-50 p-6 text-center text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const passed = result.pass_status === "PASS";

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="text-center">
        <p className="text-sm text-gray-500">Exam Result</p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
          {result.exam.title}
        </h1>

        <div className="mt-5">
          <div
            className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold ${
              passed ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {result.percentage}%
          </div>

          <p
            className={`mt-3 text-lg font-bold ${
              passed ? "text-green-700" : "text-red-700"
            }`}
          >
            {result.pass_status}
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* SCORE */}
      {/* ================================================= */}

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="text-center">
          <p className="text-sm text-gray-500">Final Score</p>

          <p className="mt-1 text-4xl font-bold text-gray-900">
            {result.final_score}
            <span className="text-xl font-medium text-gray-400">
              {" "}
              / {result.exam.total_marks}
            </span>
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Pass mark: {result.exam.pass_marks}
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* STATISTICS */}
      {/* ================================================= */}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {result.total_questions}
          </p>

          <p className="mt-1 text-xs text-gray-500">Total</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{result.correct}</p>

          <p className="mt-1 text-xs text-gray-500">Correct</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{result.wrong}</p>

          <p className="mt-1 text-xs text-gray-500">Wrong</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-gray-600">
            {result.unanswered}
          </p>

          <p className="mt-1 text-xs text-gray-500">Unanswered</p>
        </div>
      </div>

      {/* ================================================= */}
      {/* MARK BREAKDOWN */}
      {/* ================================================= */}

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900">Mark Breakdown</h2>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Positive marks</span>

            <span className="font-medium text-green-600">
              +{result.positive_marks}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Negative marks</span>

            <span className="font-medium text-red-600">
              -{result.negative_marks}
            </span>
          </div>

          <div className="border-t border-gray-100 pt-3 flex justify-between">
            <span className="font-semibold text-gray-900">Final score</span>

            <span className="font-bold text-gray-900">
              {result.final_score}
            </span>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* ACTIONS */}
      {/* ================================================= */}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button variant="outline" onClick={() => router.push(`/student/exams`)}>
          Back to Exams
        </Button>

        <Button onClick={() => router.push(`/student/review/${attemptId}`)}>
          Review Answers
        </Button>
      </div>
    </div>
  );
}
