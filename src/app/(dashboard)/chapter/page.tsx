"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getChapters, deleteChapter } from "@/lib/api/chapters";
import { getSubjects } from "@/lib/api/subject";
import type { Chapter } from "@/lib/api/chapters";
import type { Subject } from "@/lib/api/subject";
import { Modal } from "antd";
import DeleteConfirm from "../../../../components/common/DeleteConfirm";
import Button from "../../../../components/button/Button";
export default function ChapterPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [loading, setLoading] = useState(true);
  const [subjectLoading, setSubjectLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD SUBJECTS
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    async function fetchSubjects() {
      try {
        setSubjectLoading(true);
        const result = await getSubjects();
        if (!cancelled) {
          setSubjects(result);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load subjects",
          );
        }
      } finally {
        if (!cancelled) {
          setSubjectLoading(false);
        }
      }
    }

    fetchSubjects();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================
  // LOAD CHAPTERS
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    async function fetchChapters() {
      try {
        setLoading(true);
        setError("");

        const result = await getChapters(
          subjectId ? Number(subjectId) : undefined,
        );

        if (!cancelled) {
          setChapters(result);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load chapters",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchChapters();

    return () => {
      cancelled = true;
    };
  }, [subjectId]);

  // ==========================================
  // DELETE
  // ==========================================

  async function handleDelete(id: number) {
    try {
      setDeletingId(id);
      setError("");
      await deleteChapter(id);
      setChapters((current) => current.filter((chapter) => chapter.id !== id));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete chapter",
      );

      throw error;
    } finally {
      setDeletingId(null);
    }
  }
  function getSubjectName(id: number) {
    return (
      subjects.find((subject) => subject.id === id)?.name ?? `Subject #${id}`
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* =====================================
          HEADER
      ====================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chapters</h1>

          <p className="mt-1 text-sm text-gray-500">Manage subject chapters</p>
        </div>

        <Button href="/chapter/create">Add Chapter</Button>
      </div>

      {/* =====================================
          SUBJECT FILTER
      ====================================== */}

      <div className="mt-6">
        <label
          htmlFor="subject"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Filter by Subject
        </label>

        <select
          id="subject"
          value={subjectId}
          onChange={(event) => setSubjectId(event.target.value)}
          disabled={subjectLoading}
          className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 sm:max-w-md"
        >
          <option value="">All Subjects</option>

          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {/* =====================================
          ERROR
      ====================================== */}

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* =====================================
          DATA
      ====================================== */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading chapters...
          </div>
        ) : chapters.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">No chapters found.</p>

            <Link
              href="/chapter/create"
              className="mt-3 inline-block text-sm font-medium text-gray-900 underline"
            >
              Create your first chapter
            </Link>
          </div>
        ) : (
          <>
            {/* =================================
                DESKTOP
            ================================== */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 font-medium text-gray-600">No.</th>

                    <th className="px-5 py-3 font-medium text-gray-600">
                      Name
                    </th>

                    <th className="px-5 py-3 font-medium text-gray-600">
                      Subject
                    </th>

                    <th className="px-5 py-3 font-medium text-gray-600">
                      Description
                    </th>

                    <th className="px-5 py-3 font-medium text-gray-600">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {chapters.map((chapter) => (
                    <tr
                      key={chapter.id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-5 py-4 font-medium text-gray-900">
                        {chapter.chapter_no}
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-900">
                        {chapter.name}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {getSubjectName(chapter.subject_id)}
                      </td>

                      <td className="max-w-xs px-5 py-4 text-gray-600">
                        <p className="truncate">{chapter.description || "—"}</p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={
                            chapter.status === "ACTIVE"
                              ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                              : "rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
                          }
                        >
                          {chapter.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-3">
                          <Button
                            href={`/chapter/view/${chapter.id}`}
                            size="sm"
                            variant="ghost"
                          >
                            View
                          </Button>

                          <Button
                            size="sm"
                            href={`/chapter/edit/${chapter.id}`}
                            variant="outline"
                          >
                            Edit
                          </Button>

                          <DeleteConfirm
                            title="Delete Chapter"
                            content="Are you sure you want to delete this chapter?"
                            loading={deletingId === chapter.id}
                            onConfirm={() => handleDelete(chapter.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* =================================
                MOBILE
            ================================== */}

            <div className="divide-y divide-gray-100 md:hidden">
              {chapters.map((chapter) => (
                <div key={chapter.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">
                        Chapter {chapter.chapter_no}
                      </p>

                      <h2 className="mt-1 font-semibold text-gray-900">
                        {chapter.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {getSubjectName(chapter.subject_id)}
                      </p>
                    </div>

                    <span
                      className={
                        chapter.status === "ACTIVE"
                          ? "shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                          : "shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
                      }
                    >
                      {chapter.status}
                    </span>
                  </div>

                  {chapter.description && (
                    <p className="mt-3 text-sm text-gray-600">
                      {chapter.description}
                    </p>
                  )}

                  <div className="mt-4 flex gap-4">
                    <Link
                      href={`/chapter/view/${chapter.id}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      View
                    </Link>

                    <Link
                      href={`/chapter/edit/${chapter.id}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      Edit
                    </Link>

                    <DeleteConfirm
                      title="Delete Chapter"
                      content="Are you sure you want to delete this chapter?"
                      loading={deletingId === chapter.id}
                      onConfirm={() => handleDelete(chapter.id)}
                    />
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
