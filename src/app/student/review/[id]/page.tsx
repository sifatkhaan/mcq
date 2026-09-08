"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";
import { getAttemptReview } from "@/lib/api/attempts";

import type { AttemptReview, ReviewQuestion } from "@/lib/api/attempts";
import Button from "../../../../../components/button/Button";

export default function StudentReviewPage() {
  const params = useParams();

  const router = useRouter();

  const attemptId = Number(params.id);

  const [review, setReview] = useState<AttemptReview | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================================================
  // LOAD REVIEW
  // =========================================================

  useEffect(() => {
    if (!attemptId) {
      return;
    }

    let cancelled = false;

    async function loadReview() {
      try {
        setLoading(true);

        setError("");

        const response = await getAttemptReview(attemptId);

        if (!cancelled) {
          setReview(response);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load review.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadReview();

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
          <div className="h-8 w-56 rounded bg-gray-200" />

          <div className="h-20 rounded-2xl bg-gray-100" />

          <div className="h-40 rounded-2xl bg-gray-100" />

          <div className="h-40 rounded-2xl bg-gray-100" />
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

  if (!review) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Answer Review</p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {review.exam.title}
          </h1>

          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
              Score: {review.attempt.final_score}
            </span>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
              {review.attempt.percentage}%
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                review.attempt.pass_status === "PASS"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {review.attempt.pass_status}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => router.push(`/student/result/${attemptId}`)}
        >
          Back to Result
        </Button>
      </div>

      {/* ================================================= */}
      {/* QUESTIONS */}
      {/* ================================================= */}

      <div className="mt-6 space-y-5">
        {review.questions.map((question: ReviewQuestion, index) => {
          const correct = question.is_correct === true;

          const unanswered = question.your_answer === null;

          return (
            <div
              key={question.exam_question_id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
            >
              {/* QUESTION HEADER */}

              <div className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    correct
                      ? "bg-green-50 text-green-700"
                      : unanswered
                        ? "bg-gray-100 text-gray-600"
                        : "bg-red-50 text-red-700"
                  }`}
                >
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        correct
                          ? "bg-green-50 text-green-700"
                          : unanswered
                            ? "bg-gray-100 text-gray-600"
                            : "bg-red-50 text-red-700"
                      }`}
                    >
                      {correct
                        ? "Correct"
                        : unanswered
                          ? "Unanswered"
                          : "Wrong"}
                    </span>

                    <span className="text-xs text-gray-400">
                      Marks: {question.marks_awarded}
                    </span>
                  </div>

                  <h2 className="mt-3 text-sm font-semibold leading-6 text-gray-900 sm:text-base">
                    {question.question_text}
                  </h2>
                </div>
              </div>

              {/* OPTIONS */}

              <div className="mt-5 space-y-2">
                {question.options.map((option) => {
                  const isYourAnswer =
                    question.your_answer?.option_id === option.id;

                  const isCorrectAnswer =
                    question.correct_answer?.option_id === option.id;

                  return (
                    <div
                      key={option.id}
                      className={`rounded-xl border p-4 ${
                        isCorrectAnswer && review.exam.show_correct_answer
                          ? "border-green-300 bg-green-50"
                          : isYourAnswer && !isCorrectAnswer
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 text-xs text-gray-500">
                          {option.option_order}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-800">
                            {option.option_text}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {isYourAnswer && (
                              <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                Your answer
                              </span>
                            )}

                            {isCorrectAnswer &&
                              review.exam.show_correct_answer && (
                                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                  Correct answer
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* EXPLANATION */}

              {review.exam.show_explanation && question.explanation && (
                <div className="mt-5 rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Explanation
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ================================================= */}
      {/* BOTTOM ACTION */}
      {/* ================================================= */}

      <div className="mt-6 flex justify-center">
        <Button
          variant="outline"
          onClick={() => router.push(`/student/result/${attemptId}`)}
        >
          Back to Result
        </Button>
      </div>
    </div>
  );
}
