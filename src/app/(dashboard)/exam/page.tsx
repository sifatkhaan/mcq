"use client";

import { useEffect, useState } from "react";
import { getExams, publishExam, closeExam, deleteExam } from "@/lib/api/exams";

import type { Exam } from "@/lib/api/exams";
import Button from "../../../../components/button/Button";
import DeleteConfirm from "../../../../components/common/DeleteConfirm";

export default function ExamPage() {
  const [exams, setExams] = useState<Exam[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [actionId, setActionId] = useState<number | null>(null);

  // ==========================================
  // LOAD
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    async function loadExams() {
      try {
        setLoading(true);
        setError("");

        const result = await getExams();

        if (!cancelled) {
          setExams(result);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load exams",
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

  // ==========================================
  // PUBLISH
  // ==========================================

  async function handlePublish(id: number) {
    try {
      setActionId(id);
      setError("");

      const result = await publishExam(id);

      setExams((current) =>
        current.map((exam) => (exam.id === id ? result : exam)),
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to publish exam",
      );
    } finally {
      setActionId(null);
    }
  }

  // ==========================================
  // CLOSE
  // ==========================================

  async function handleClose(id: number) {
    try {
      setActionId(id);
      setError("");

      const result = await closeExam(id);

      setExams((current) =>
        current.map((exam) => (exam.id === id ? result : exam)),
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to close exam");
    } finally {
      setActionId(null);
    }
  }

  // ==========================================
  // DELETE
  // ==========================================

  async function handleDelete(id: number) {
    try {
      setActionId(id);
      setError("");

      await deleteExam(id);

      setExams((current) => current.filter((exam) => exam.id !== id));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete exam",
      );

      throw error;
    } finally {
      setActionId(null);
    }
  }

  function formatDate(value: string | null) {
    if (!value) {
      return "—";
    }

    return new Date(value).toLocaleString();
  }

  function statusClass(status: string) {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-700";

      case "CLOSED":
        return "bg-gray-200 text-gray-700";

      case "DRAFT":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exams</h1>

          <p className="mt-1 text-sm text-gray-500">
            Create and manage examinations
          </p>
        </div>

        <Button href="/exam/create">Create Exam</Button>
      </div>

      {/* Error */}

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Data */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading exams...
          </div>
        ) : exams.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No exams found.
          </div>
        ) : (
          <>
            {/* Desktop */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 font-medium text-gray-600">
                      Title
                    </th>

                    <th className="px-5 py-3 font-medium text-gray-600">
                      Duration
                    </th>

                    <th className="px-5 py-3 font-medium text-gray-600">
                      Marks
                    </th>

                    <th className="px-5 py-3 font-medium text-gray-600">
                      Start
                    </th>

                    <th className="px-5 py-3 font-medium text-gray-600">End</th>

                    <th className="px-5 py-3 font-medium text-gray-600">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {exams.map((exam) => (
                    <tr
                      key={exam.id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {exam.title}
                        </p>

                        {exam.description && (
                          <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                            {exam.description}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {exam.duration_minutes} min
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {exam.total_marks}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {formatDate(exam.start_at)}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {formatDate(exam.end_at)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
                            exam.status,
                          )}`}
                        >
                          {exam.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            href={`/exam/view/${exam.id}`}
                            variant="ghost"
                            size="sm"
                          >
                            View
                          </Button>

                          {exam.status === "DRAFT" && (
                            <>
                              <Button
                                href={`/exam/edit/${exam.id}`}
                                variant="outline"
                                size="sm"
                              >
                                Edit
                              </Button>

                              <Button
                                variant="success"
                                size="sm"
                                loading={actionId === exam.id}
                                loadingText="Publishing..."
                                onClick={() => handlePublish(exam.id)}
                              >
                                Publish
                              </Button>
                            </>
                          )}

                          {exam.status === "PUBLISHED" && (
                            <Button
                              variant="warning"
                              size="sm"
                              loading={actionId === exam.id}
                              loadingText="Closing..."
                              onClick={() => handleClose(exam.id)}
                            >
                              Close
                            </Button>
                          )}

                          {(exam.status === "DRAFT" ||
                            exam.status === "CLOSED") && (
                            <DeleteConfirm
                              loading={actionId === exam.id}
                              onConfirm={() => handleDelete(exam.id)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}

            <div className="divide-y divide-gray-100 md:hidden">
              {exams.map((exam) => (
                <div key={exam.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">Exam #{exam.id}</p>

                      <h2 className="mt-1 font-semibold text-gray-900">
                        {exam.title}
                      </h2>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
                        exam.status,
                      )}`}
                    >
                      {exam.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>

                      <p className="mt-1 text-gray-900">
                        {exam.duration_minutes} min
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Marks</p>

                      <p className="mt-1 text-gray-900">{exam.total_marks}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Start</p>

                      <p className="mt-1 text-gray-900">
                        {formatDate(exam.start_at)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">End</p>

                      <p className="mt-1 text-gray-900">
                        {formatDate(exam.end_at)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      href={`/exam/view/${exam.id}`}
                      variant="ghost"
                      size="sm"
                    >
                      View
                    </Button>

                    {exam.status === "DRAFT" && (
                      <>
                        <Button
                          href={`/exam/edit/${exam.id}`}
                          variant="outline"
                          size="sm"
                        >
                          Edit
                        </Button>

                        <Button
                          variant="success"
                          size="sm"
                          loading={actionId === exam.id}
                          loadingText="Publishing..."
                          onClick={() => handlePublish(exam.id)}
                        >
                          Publish
                        </Button>
                      </>
                    )}

                    {exam.status === "PUBLISHED" && (
                      <Button
                        variant="warning"
                        size="sm"
                        loading={actionId === exam.id}
                        loadingText="Closing..."
                        onClick={() => handleClose(exam.id)}
                      >
                        Close
                      </Button>
                    )}

                    {(exam.status === "DRAFT" || exam.status === "CLOSED") && (
                      <DeleteConfirm
                        loading={actionId === exam.id}
                        onConfirm={() => handleDelete(exam.id)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
