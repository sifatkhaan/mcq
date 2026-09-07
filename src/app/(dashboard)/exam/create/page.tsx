"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { createExam } from "@/lib/api/exams";
import Button from "../../../../../components/button/Button";

export default function CreateExamPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [duration, setDuration] = useState("");

  const [totalMarks, setTotalMarks] = useState("");

  const [passMarks, setPassMarks] = useState("");

  const [negativeMarking, setNegativeMarking] = useState(true);

  const [correctMark, setCorrectMark] = useState("1");

  const [negativeMark, setNegativeMark] = useState("0.25");

  const [shuffleQuestions, setShuffleQuestions] = useState(true);

  const [shuffleOptions, setShuffleOptions] = useState(true);

  const [showResult, setShowResult] = useState(true);

  const [allowReview, setAllowReview] = useState(true);

  const [showCorrectAnswer, setShowCorrectAnswer] = useState(true);

  const [showExplanation, setShowExplanation] = useState(true);

  const [maxAttempts, setMaxAttempts] = useState("1");

  const [startAt, setStartAt] = useState("");

  const [endAt, setEndAt] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // SUBMIT
  // ==========================================

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Exam title is required.");

      return;
    }

    const durationValue = Number(duration);

    const totalMarksValue = Number(totalMarks);

    const passMarksValue = Number(passMarks);

    const correctMarkValue = Number(correctMark);

    const negativeMarkValue = Number(negativeMark);

    const maxAttemptsValue = Number(maxAttempts);

    if (!Number.isFinite(durationValue) || durationValue <= 0) {
      setError("Duration must be greater than 0.");

      return;
    }

    if (!Number.isFinite(totalMarksValue) || totalMarksValue <= 0) {
      setError("Total marks must be greater than 0.");

      return;
    }

    if (
      !Number.isFinite(passMarksValue) ||
      passMarksValue < 0 ||
      passMarksValue > totalMarksValue
    ) {
      setError("Pass marks must be between 0 and total marks.");

      return;
    }

    if (!Number.isFinite(correctMarkValue) || correctMarkValue <= 0) {
      setError("Correct mark must be greater than 0.");

      return;
    }

    if (!Number.isFinite(negativeMarkValue) || negativeMarkValue < 0) {
      setError("Negative mark cannot be negative.");

      return;
    }

    if (!Number.isInteger(maxAttemptsValue) || maxAttemptsValue <= 0) {
      setError("Maximum attempts must be a positive integer.");

      return;
    }

    if (!startAt || !endAt) {
      setError("Start and end time are required.");

      return;
    }

    const startDate = new Date(startAt);

    const endDate = new Date(endAt);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      setError("Please provide valid dates.");

      return;
    }

    if (endDate <= startDate) {
      setError("End time must be after start time.");

      return;
    }

    try {
      setLoading(true);

      const exam = await createExam({
        title: title.trim(),

        description: description.trim() || undefined,

        duration_minutes: durationValue,

        total_marks: totalMarksValue,

        pass_marks: passMarksValue,

        negative_marking_enabled: negativeMarking,

        default_correct_mark: correctMarkValue,

        default_negative_mark: negativeMarking ? negativeMarkValue : 0,

        shuffle_questions: shuffleQuestions,

        shuffle_options: shuffleOptions,

        show_result: showResult,

        allow_review: allowReview,

        show_correct_answer: showCorrectAnswer,

        show_explanation: showExplanation,

        max_attempts: maxAttemptsValue,

        start_at: startDate.toISOString(),

        end_at: endDate.toISOString(),
      });

      router.push(`/exam/view/${exam.id}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create exam",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Exam</h1>

        <p className="mt-1 text-sm text-gray-500">
          Configure a new examination
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
      >
        {/* Basic Information */}

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Exam Title
              </label>

              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Mathematics Weekly Test"
                className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                placeholder="Weekly mathematics assessment"
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>
        </section>

        {/* Marks */}

        <section className="border-t border-gray-100 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Marks & Duration
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>

              <input
                type="number"
                min="1"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Total Marks
              </label>

              <input
                type="number"
                min="1"
                value={totalMarks}
                onChange={(event) => setTotalMarks(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Pass Marks
              </label>

              <input
                type="number"
                min="0"
                value={passMarks}
                onChange={(event) => setPassMarks(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Maximum Attempts
              </label>

              <input
                type="number"
                min="1"
                value={maxAttempts}
                onChange={(event) => setMaxAttempts(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
              />
            </div>
          </div>
        </section>

        {/* Negative Marking */}

        <section className="border-t border-gray-100 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Negative Marking
          </h2>

          <label className="mt-4 flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={negativeMarking}
              onChange={(event) => setNegativeMarking(event.target.checked)}
              className="h-4 w-4"
            />

            <span className="text-sm text-gray-700">
              Enable negative marking
            </span>
          </label>

          {negativeMarking && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Correct Answer Mark
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={correctMark}
                  onChange={(event) => setCorrectMark(event.target.value)}
                  className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Negative Mark
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={negativeMark}
                  onChange={(event) => setNegativeMark(event.target.value)}
                  className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
                />
              </div>
            </div>
          )}
        </section>

        {/* Exam Behavior */}

        <section className="border-t border-gray-100 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">Exam Behavior</h2>

          <div className="mt-4 space-y-3">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={shuffleQuestions}
                onChange={(event) => setShuffleQuestions(event.target.checked)}
                className="h-4 w-4"
              />

              <span className="text-sm text-gray-700">Shuffle questions</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={shuffleOptions}
                onChange={(event) => setShuffleOptions(event.target.checked)}
                className="h-4 w-4"
              />

              <span className="text-sm text-gray-700">Shuffle options</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={showResult}
                onChange={(event) => setShowResult(event.target.checked)}
                className="h-4 w-4"
              />

              <span className="text-sm text-gray-700">Show result</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={allowReview}
                onChange={(event) => setAllowReview(event.target.checked)}
                className="h-4 w-4"
              />

              <span className="text-sm text-gray-700">Allow review</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={showCorrectAnswer}
                onChange={(event) => setShowCorrectAnswer(event.target.checked)}
                className="h-4 w-4"
              />

              <span className="text-sm text-gray-700">Show correct answer</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={showExplanation}
                onChange={(event) => setShowExplanation(event.target.checked)}
                className="h-4 w-4"
              />

              <span className="text-sm text-gray-700">Show explanation</span>
            </label>
          </div>
        </section>

        {/* Schedule */}

        <section className="border-t border-gray-100 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">Schedule</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Start At
              </label>

              <input
                type="datetime-local"
                value={startAt}
                onChange={(event) => setStartAt(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                End At
              </label>

              <input
                type="datetime-local"
                value={endAt}
                onChange={(event) => setEndAt(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
              />
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Actions */}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>

          <Button type="submit" loading={loading} loadingText="Creating...">
            Create Exam
          </Button>
        </div>
      </form>
    </div>
  );
}
