"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { getExam } from "@/lib/api/exams";

import type { Exam } from "@/lib/api/exams";
import Button from "../../../../../../components/button/Button";

export default function ViewExamPage() {
  const params = useParams();

  const router = useRouter();

  const id = Number(params.id);

  const [exam, setExam] = useState<Exam | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

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

        if (!cancelled) {
          setExam(result);
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

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading exam...</div>;
  }

  if (error || !exam) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
        {error || "Exam not found"}
      </div>
    );
  }

  function formatDate(value: string | null) {
    if (!value) {
      return "—";
    }

    return new Date(value).toLocaleString();
  }

  function statusClass() {
    switch (exam.status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-700";

      case "CLOSED":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Exam #{exam.id}</p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {exam.title}
          </h1>

          {exam.description && (
            <p className="mt-2 text-sm text-gray-500">{exam.description}</p>
          )}
        </div>

        {exam.status === "DRAFT" && (
          <Button href={`/exam/edit/${exam.id}`}>Edit</Button>
        )}
        <Button href={`/exam/questions/${exam.id}`} variant="outline">
          Questions
        </Button>
      </div>
      <Button href={`/exam/assignments/${exam.id}`} variant="outline">
        Assignments
      </Button>

      {/* Status */}

      <div className="mt-6">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass()}`}
        >
          {exam.status}
        </span>
      </div>

      {/* Basic */}

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Exam Information
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <div>
            <p className="text-xs text-gray-500">Duration</p>

            <p className="mt-1 font-medium text-gray-900">
              {exam.duration_minutes} minutes
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Total Marks</p>

            <p className="mt-1 font-medium text-gray-900">{exam.total_marks}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Pass Marks</p>

            <p className="mt-1 font-medium text-gray-900">{exam.pass_marks}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Maximum Attempts</p>

            <p className="mt-1 font-medium text-gray-900">
              {exam.max_attempts}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Start At</p>

            <p className="mt-1 text-sm text-gray-900">
              {formatDate(exam.start_at)}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">End At</p>

            <p className="mt-1 text-sm text-gray-900">
              {formatDate(exam.end_at)}
            </p>
          </div>
        </div>
      </section>

      {/* Marks */}

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900">Marking</h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <div>
            <p className="text-xs text-gray-500">Negative Marking</p>

            <p className="mt-1 font-medium text-gray-900">
              {exam.negative_marking_enabled ? "Enabled" : "Disabled"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Correct Mark</p>

            <p className="mt-1 font-medium text-gray-900">
              {exam.default_correct_mark}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Negative Mark</p>

            <p className="mt-1 font-medium text-gray-900">
              {exam.default_negative_mark}
            </p>
          </div>
        </div>
      </section>

      {/* Behavior */}

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900">Exam Behavior</h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Setting label="Shuffle Questions" enabled={exam.shuffle_questions} />

          <Setting label="Shuffle Options" enabled={exam.shuffle_options} />

          <Setting label="Show Result" enabled={exam.show_result} />

          <Setting label="Allow Review" enabled={exam.allow_review} />

          <Setting
            label="Show Correct Answer"
            enabled={exam.show_correct_answer}
          />

          <Setting label="Show Explanation" enabled={exam.show_explanation} />
        </div>
      </section>

      {/* Metadata */}

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900">Metadata</h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500">Created By</p>

            <p className="mt-1 text-sm text-gray-900">{exam.created_by}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Created At</p>

            <p className="mt-1 text-sm text-gray-900">
              {formatDate(exam.created_at)}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Updated By</p>

            <p className="mt-1 text-sm text-gray-900">
              {exam.updated_by ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Updated At</p>

            <p className="mt-1 text-sm text-gray-900">
              {formatDate(exam.updated_at)}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>
    </div>
  );
}

function Setting({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
      <span className="text-sm text-gray-700">{label}</span>

      <span
        className={
          enabled
            ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
            : "rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500"
        }
      >
        {enabled ? "Yes" : "No"}
      </span>
    </div>
  );
}
