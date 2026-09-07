"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getQuestion } from "@/lib/api/questions";
import type { Question } from "@/lib/api/questions";
import Button from "../../../../../../components/button/Button";

export default function ViewQuestionPage() {
  const params = useParams();
  const id = Number(params.id);
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    async function loadQuestion() {
      try {
        setLoading(true);
        setError("");

        const result = await getQuestion(id);

        if (!cancelled) {
          setQuestion(result);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load question",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadQuestion();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading question...</div>;
  }

  if (error || !question) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
        {error || "Question not found"}
      </div>
    );
  }

  const version = question.version;

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Header */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Question #{question.id}</p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Question Details
          </h1>
        </div>

        <Button href={`/question/edit/${question.id}`}>Edit</Button>
      </div>

      {/* Information */}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Subject</p>

          <p className="mt-1 font-medium text-gray-900">
            {question.subject_name}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Chapter</p>

          <p className="mt-1 font-medium text-gray-900">
            {question.chapter_no} - {question.chapter_name}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Topic</p>

          <p className="mt-1 font-medium text-gray-900">
            {question.topic_no} - {question.topic_name}
          </p>
        </div>
      </div>

      {/* Question */}

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
            {version?.difficulty ?? question.difficulty}
          </span>

          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
            Version {version?.version_no ?? question.version_no ?? "—"}
          </span>
        </div>

        <div className="mt-5">
          <h2 className="whitespace-pre-wrap text-lg font-semibold leading-7 text-gray-900">
            {version?.question_text ?? question.question_text}
          </h2>
        </div>

        {/* Options */}

        {version?.options && (
          <div className="mt-6 space-y-3">
            {version.options
              .slice()
              .sort((a, b) => a.option_order - b.option_order)
              .map((option) => (
                <div
                  key={option.id ?? option.option_order}
                  className={`flex items-start gap-3 rounded-xl border p-4 ${
                    option.is_correct
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
                    {option.option_order}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900">
                      {option.option_text}
                    </p>
                  </div>

                  {option.is_correct && (
                    <span className="shrink-0 text-xs font-semibold text-green-700">
                      Correct
                    </span>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Explanation */}

        {version?.explanation && (
          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Explanation
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
              {version.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Metadata */}

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500">Status</p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {question.status}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Version ID</p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {version?.id ?? question.version_id ?? "—"}
            </p>
          </div>

          {version?.created_at && (
            <div>
              <p className="text-xs text-gray-500">Version Created At</p>

              <p className="mt-1 text-sm text-gray-900">
                {new Date(version.created_at).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
