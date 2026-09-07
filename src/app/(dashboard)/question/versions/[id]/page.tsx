"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { getQuestion, getQuestionVersions } from "@/lib/api/questions";

import type { Question, QuestionVersion } from "@/lib/api/questions";
import Button from "../../../../../../components/button/Button";

export default function QuestionVersionsPage() {
  const params = useParams();

  const router = useRouter();

  const id = Number(params.id);

  const [question, setQuestion] = useState<Question | null>(null);

  const [versions, setVersions] = useState<QuestionVersion[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==========================================
  // LOAD QUESTION + VERSIONS
  // ==========================================

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [questionResult, versionResult] = await Promise.all([
          getQuestion(id),
          getQuestionVersions(id),
        ]);

        if (cancelled) {
          return;
        }

        setQuestion(questionResult);

        setVersions(
          versionResult.slice().sort((a, b) => b.version_no - a.version_no),
        );
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load question versions",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading versions...</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Question #{id}</p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Question Versions
          </h1>

          {question && (
            <p className="mt-2 text-sm text-gray-500">
              {question.subject_name}
              {" · "}
              Chapter {question.chapter_no}
              {" · "}
              {question.chapter_name}
              {" · "}
              Topic {question.topic_no}
              {" · "}
              {question.topic_name}
            </p>
          )}
        </div>

        <Button
          variant="outline"
          onClick={() => router.push(`/question/view/${id}`)}
        >
          Back to Question
        </Button>
      </div>

      {/* Version Count */}

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-500">Total Versions</p>

        <p className="mt-1 text-2xl font-bold text-gray-900">
          {versions.length}
        </p>
      </div>

      {/* Versions */}

      <div className="mt-6 space-y-5">
        {versions.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            No versions found.
          </div>
        ) : (
          versions.map((version) => (
            <div
              key={version.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
            >
              {/* Version Header */}

              <div className="flex flex-col gap-3 border-b border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                    {version.version_no}
                  </span>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Version {version.version_no}
                    </h2>

                    <p className="text-xs text-gray-500">
                      Created {new Date(version.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <span
                  className={
                    version.status === "ACTIVE"
                      ? "w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                      : "w-fit rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600"
                  }
                >
                  {version.status}
                </span>
              </div>

              {/* Version Content */}

              <div className="p-4 sm:p-6">
                {/* Question */}

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      {version.difficulty}
                    </span>
                  </div>

                  <h3 className="mt-4 whitespace-pre-wrap text-lg font-semibold leading-7 text-gray-900">
                    {version.question_text}
                  </h3>
                </div>

                {/* Options */}

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
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                            option.is_correct
                              ? "bg-green-200 text-green-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {option.option_order}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm leading-6 text-gray-900">
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

                {/* Explanation */}

                {version.explanation && (
                  <div className="mt-6 rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Explanation
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                      {version.explanation}
                    </p>
                  </div>
                )}

                {/* Metadata */}

                <div className="mt-6 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-gray-500">Version ID</p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {version.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Created By</p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {version.created_by}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Status</p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {version.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
