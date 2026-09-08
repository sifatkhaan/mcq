"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getAttemptQuestions,
  getAttemptResult,
  saveAttemptAnswer,
  submitAttempt,
} from "@/lib/api/attempts";
import type { AttemptQuestion } from "@/lib/api/attempts";
import Button from "../../../../../components/button/Button";
import { Modal } from "antd";
export default function StudentAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = Number(params.id);
  const [questions, setQuestions] = useState<AttemptQuestion[]>([]);
  const [attempt, setAttempt] = useState<{
    id: number;
    exam_id: number;
    started_at: string;
    expires_at: string;
    total_questions: number;
  } | null>(null);
  const [exam, setExam] = useState<{
    id: number;
    title: string;
    duration_minutes: number;
    shuffle_questions: boolean;
    shuffle_options: boolean;
  } | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingQuestionId, setSavingQuestionId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const autoSubmitChecking = useRef(false);
  useEffect(() => {
    if (!attemptId) {
      return;
    }
    let cancelled = false;
    async function loadAttempt() {
      try {
        setLoading(true);
        setError("");
        const result = await getAttemptQuestions(attemptId);
        if (cancelled) {
          return;
        }
        setAttempt(result.attempt);
        setExam(result.exam);
        setQuestions(result.questions);
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load exam.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAttempt();

    return () => {
      cancelled = true;
    };
  }, [attemptId]);
  function formatTime(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
    )}`;
  }

  async function handleAnswer(question: AttemptQuestion, optionId: number) {
    try {
      setSavingQuestionId(question.exam_question_id);
      setError("");
      setQuestions((current) =>
        current.map((item) =>
          item.exam_question_id === question.exam_question_id
            ? {
                ...item,
                selected_option_id: optionId,
              }
            : item,
        ),
      );

      await saveAttemptAnswer(attemptId, question.exam_question_id, optionId);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to save answer.",
      );

      try {
        const result = await getAttemptQuestions(attemptId);
        setQuestions(result.questions);
      } catch {
        // Keep original error
      }
    } finally {
      setSavingQuestionId(null);
    }
  }
  async function handleSubmit() {
    if (submitting) {
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      const result = await submitAttempt(attemptId);
      router.push(`/student/result/${result.attempt.id}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to submit exam.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function waitForAutoSubmit() {
    const maxWaitTime = 90 * 1000; // 90 seconds
    const pollingInterval = 2000; // Check every 2 seconds

    const startedWaitingAt = Date.now();

    async function checkSubmission() {
      try {
        const result = await getAttemptResult(attemptId);
        if (result.submitted_at) {
          router.replace(`/student/result/${attemptId}`);

          return;
        }
      } catch {
        /*
         * IMPORTANT:
         *
         * Before the backend scheduler processes
         * the expired attempt, the result endpoint
         * may return 400 because the attempt is still
         * STARTED.
         *
         * That is expected here.
         *
         * So we keep polling.
         */
      }

      if (Date.now() - startedWaitingAt < maxWaitTime) {
        window.setTimeout(checkSubmission, pollingInterval);

        return;
      }

      setError(
        "The exam time has ended, but the result is still being processed. Please refresh the page after a moment.",
      );
    }

    await checkSubmission();
  }

  useEffect(() => {
    if (!attempt?.expires_at) {
      return;
    }

    let timer: number | undefined;

    function updateTimer() {
      const expiresAt = new Date(attempt!.expires_at).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((expiresAt - now) / 1000));
      setRemainingSeconds(remaining);
      if (remaining <= 0) {
        if (timer) {
          window.clearInterval(timer);
        }

        if (!autoSubmitChecking.current) {
          autoSubmitChecking.current = true;
          waitForAutoSubmit();
        }
      }
    }
    updateTimer();
    timer = window.setInterval(updateTimer, 1000);
    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, [attempt?.expires_at]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 rounded bg-gray-200" />

          <div className="h-20 rounded-2xl bg-gray-100" />

          <div className="h-32 rounded-2xl bg-gray-100" />

          <div className="h-32 rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!attempt || !exam) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-red-50 p-6 text-center text-sm text-red-600">
          Unable to load this exam attempt.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="sticky top-0 z-20 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900 sm:text-xl">
              {exam.title}
            </h1>

            <p className="text-xs text-gray-500">
              {questions.length} questions
            </p>
          </div>

          {/* <div className="rounded-xl bg-gray-100 px-4 py-2 text-center">
            <p className="text-xs text-gray-500">Time Limit</p>

            <p className="text-sm font-semibold text-gray-900">
              {exam.duration_minutes} minutes
            </p>
          </div> */}
          <div
            className={`rounded-xl px-4 py-2 text-center ${
              remainingSeconds <= 60 ? "bg-red-50" : "bg-gray-100"
            }`}
          >
            <p
              className={`text-xs ${
                remainingSeconds <= 60 ? "text-red-500" : "text-gray-500"
              }`}
            >
              Time Remaining
            </p>

            <p
              className={`font-mono text-lg font-bold ${
                remainingSeconds <= 60 ? "text-red-600" : "text-gray-900"
              }`}
            >
              {formatTime(remainingSeconds)}
            </p>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ================================================= */}
      {/* QUESTIONS */}
      {/* ================================================= */}

      <div className="mt-5 space-y-4">
        {questions.map((question, index) => {
          const selected = question.selected_option_id;

          const saving = savingQuestionId === question.exam_question_id;

          return (
            <div
              key={question.exam_question_id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
            >
              {/* QUESTION NUMBER */}

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                  {index + 1}
                </div>

                <h2 className="text-sm font-semibold leading-6 text-gray-900 sm:text-base">
                  {question.question_text}
                </h2>
              </div>

              {/* OPTIONS */}

              <div className="mt-5 space-y-2">
                {question.options.map((option) => {
                  const isSelected = selected === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={saving}
                      onClick={() => handleAnswer(question, option.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                        isSelected
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      } ${saving ? "cursor-wait opacity-70" : ""}`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-gray-900 bg-gray-900"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </span>

                      <span className="text-sm leading-6 text-gray-800">
                        {option.option_text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* SAVING */}

              {saving && (
                <p className="mt-3 text-xs text-gray-400">Saving answer...</p>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex justify-end border-t border-gray-200 pt-5">
        <Button
          loading={submitting}
          loadingText="Submitting..."
          disabled={submitting}
          onClick={() => {
            Modal.confirm({
              title: "Submit Exam?",
              content:
                "Are you sure you want to submit your exam? You will not be able to change your answers after submission.",
              okText: "Submit Exam",
              cancelText: "Continue Exam",
              onOk: handleSubmit,
            });
          }}
        >
          Submit Exam
        </Button>
      </div>
    </div>
  );
}
