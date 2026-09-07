"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { getExam, updateExam } from "@/lib/api/exams";
import Button from "../../../../../../components/button/Button";

export default function EditExamPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  // ==========================================
  // FORM STATE
  // ==========================================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [passMarks, setPassMarks] = useState("");

  const [negativeMarking, setNegativeMarking] = useState(false);

  const [correctMark, setCorrectMark] = useState("");

  const [negativeMark, setNegativeMark] = useState("");

  const [shuffleQuestions, setShuffleQuestions] = useState(false);

  const [shuffleOptions, setShuffleOptions] = useState(false);

  const [showResult, setShowResult] = useState(false);

  const [allowReview, setAllowReview] = useState(false);

  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const [showExplanation, setShowExplanation] = useState(false);

  const [maxAttempts, setMaxAttempts] = useState("");

  const [startAt, setStartAt] = useState("");

  const [endAt, setEndAt] = useState("");

  // ==========================================
  // PAGE STATE
  // ==========================================

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // UTC → DATETIME LOCAL
  // ==========================================

  function toDateTimeLocal(value: string | null) {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");

    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // ==========================================
  // LOAD EXAM
  // ==========================================

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    async function loadExam() {
      try {
        setLoading(true);
        setError("");

        const result = await getExam(id);

        if (cancelled) {
          return;
        }

        setTitle(result.title);

        setDescription(result.description ?? "");

        setDuration(String(result.duration_minutes));

        setTotalMarks(String(result.total_marks));

        setPassMarks(String(result.pass_marks));

        setNegativeMarking(result.negative_marking_enabled);

        setCorrectMark(String(result.default_correct_mark));

        setNegativeMark(String(result.default_negative_mark));

        setShuffleQuestions(result.shuffle_questions);

        setShuffleOptions(result.shuffle_options);

        setShowResult(result.show_result);

        setAllowReview(result.allow_review);

        setShowCorrectAnswer(result.show_correct_answer);

        setShowExplanation(result.show_explanation);

        setMaxAttempts(String(result.max_attempts));

        setStartAt(toDateTimeLocal(result.start_at));

        setEndAt(toDateTimeLocal(result.end_at));

        // Editing is allowed only for DRAFT exams.
        if (result.status !== "DRAFT") {
          setError("Only draft exams can be edited.");
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load exam",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadExam();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ==========================================
  // SUBMIT
  // ==========================================

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const durationValue = Number(duration);

    const totalMarksValue = Number(totalMarks);

    const passMarksValue = Number(passMarks);

    const correctMarkValue = Number(correctMark);

    const negativeMarkValue = Number(negativeMark);

    const maxAttemptsValue = Number(maxAttempts);

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!title.trim()) {
      setError("Exam title is required.");

      return;
    }

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

    // ==========================================
    // UPDATE
    // ==========================================

    try {
      setSaving(true);

      const result = await updateExam(id, {
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

      router.push(`/exam/view/${result.id}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update exam",
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading exam...</div>;
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Header */}

      <div>
        <p className="text-sm text-gray-500">Exam #{id}</p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">Edit Exam</h1>

        <p className="mt-1 text-sm text-gray-500">
          Update the exam configuration
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

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
                className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>
        </section>

        {/* Marks & Duration */}

        <section className="border-t border-gray-100 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Marks & Duration
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <NumberField
              label="Duration (minutes)"
              value={duration}
              onChange={setDuration}
              min="1"
            />

            <NumberField
              label="Total Marks"
              value={totalMarks}
              onChange={setTotalMarks}
              min="1"
            />

            <NumberField
              label="Pass Marks"
              value={passMarks}
              onChange={setPassMarks}
              min="0"
            />

            <NumberField
              label="Maximum Attempts"
              value={maxAttempts}
              onChange={setMaxAttempts}
              min="1"
            />
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
              <NumberField
                label="Correct Answer Mark"
                value={correctMark}
                onChange={setCorrectMark}
                min="0"
                step="0.01"
              />

              <NumberField
                label="Negative Mark"
                value={negativeMark}
                onChange={setNegativeMark}
                min="0"
                step="0.01"
              />
            </div>
          )}
        </section>

        {/* Behavior */}

        <section className="border-t border-gray-100 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">Exam Behavior</h2>

          <div className="mt-4 space-y-3">
            <Checkbox
              label="Shuffle questions"
              checked={shuffleQuestions}
              onChange={setShuffleQuestions}
            />

            <Checkbox
              label="Shuffle options"
              checked={shuffleOptions}
              onChange={setShuffleOptions}
            />

            <Checkbox
              label="Show result"
              checked={showResult}
              onChange={setShowResult}
            />

            <Checkbox
              label="Allow review"
              checked={allowReview}
              onChange={setAllowReview}
            />

            <Checkbox
              label="Show correct answer"
              checked={showCorrectAnswer}
              onChange={setShowCorrectAnswer}
            />

            <Checkbox
              label="Show explanation"
              checked={showExplanation}
              onChange={setShowExplanation}
            />
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

        {/* Actions */}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>

          <Button
            type="submit"
            loading={saving}
            loadingText="Saving..."
            disabled={!!error && error === "Only draft exams can be edited."}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// NUMBER FIELD
// ==========================================

function NumberField({
  label,
  value,
  onChange,
  min,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
      />
    </div>
  );
}

// ==========================================
// CHECKBOX
// ==========================================

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4"
      />

      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}
