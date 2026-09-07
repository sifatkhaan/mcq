"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import { getTopics, deleteTopic } from "@/lib/api/topics";

import { getSubjects } from "@/lib/api/subject";

import { getChapters } from "@/lib/api/chapters";

import type { Topic } from "@/lib/api/topics";

import type { Subject } from "@/lib/api/subject";

import type { Chapter } from "@/lib/api/chapters";
import DeleteConfirm from "../../../../components/common/DeleteConfirm";
import Button from "../../../../components/button/Button";

export default function TopicPage() {
  const [topics, setTopics] = useState<Topic[]>([]);

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [subjectId, setSubjectId] = useState("");

  const [chapterId, setChapterId] = useState("");

  const [loading, setLoading] = useState(true);

  const [subjectLoading, setSubjectLoading] = useState(true);

  const [chapterLoading, setChapterLoading] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState("");

  // ==========================================
  // LOAD SUBJECTS
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    async function loadSubjects() {
      try {
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

    loadSubjects();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================
  // LOAD CHAPTERS WHEN SUBJECT CHANGES
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    if (!subjectId) {
      return;
    }

    async function loadChapters() {
      try {
        const result = await getChapters(Number(subjectId));

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
          setChapterLoading(false);
        }
      }
    }

    loadChapters();

    return () => {
      cancelled = true;
    };
  }, [subjectId]);

  // ==========================================
  // LOAD TOPICS
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    async function loadTopics() {
      if (!chapterId) {
        return;
      }

      try {
        const result = await getTopics(Number(chapterId));

        if (!cancelled) {
          setTopics(result);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load topics",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTopics();

    return () => {
      cancelled = true;
    };
  }, [chapterId]);

  function handleSubjectChange(nextSubjectId: string) {
    setSubjectId(nextSubjectId);
    setChapterId("");
    setChapters([]);
    setTopics([]);
    setLoading(false);
    setError("");
    setChapterLoading(Boolean(nextSubjectId));
  }

  function handleChapterChange(nextChapterId: string) {
    setChapterId(nextChapterId);
    setTopics([]);
    setLoading(Boolean(nextChapterId));
    setError("");
  }

  // ==========================================
  // DELETE
  // ==========================================

  async function handleDelete(id: number) {
    try {
      setDeletingId(id);
      setError("");

      await deleteTopic(id);

      setTopics((current) => current.filter((topic) => topic.id !== id));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete topic",
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

  function getChapterName(id: number) {
    return (
      chapters.find((chapter) => chapter.id === id)?.name ?? `Chapter #${id}`
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Topics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage topics under chapters
          </p>
        </div>

        <Button href="/topic/create">Add Topic</Button>
      </div>

      {/* Filters */}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Subject */}

        <div>
          <label
            htmlFor="subject"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Subject
          </label>

          <select
            id="subject"
            value={subjectId}
            onChange={(event) => handleSubjectChange(event.target.value)}
            disabled={subjectLoading}
            className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
          >
            <option value="">
              {subjectLoading ? "Loading subjects..." : "Select subject"}
            </option>

            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Chapter */}

        <div>
          <label
            htmlFor="chapter"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Chapter
          </label>

          <select
            id="chapter"
            value={chapterId}
            onChange={(event) => handleChapterChange(event.target.value)}
            disabled={!subjectId || chapterLoading}
            className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
          >
            <option value="">
              {!subjectId
                ? "Select subject first"
                : chapterLoading
                  ? "Loading chapters..."
                  : "Select chapter"}
            </option>

            {chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                Chapter {chapter.chapter_no} - {chapter.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Data */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {!chapterId ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Select a subject and chapter to view topics.
          </div>
        ) : loading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading topics...
          </div>
        ) : topics.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">
              No topics found for this chapter.
            </p>

            <Button href="/topic/create">Create your first topic</Button>
          </div>
        ) : (
          <>
            {/* Desktop */}

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
                      Chapter
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
                  {topics.map((topic) => (
                    <tr
                      key={topic.id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-5 py-4 font-medium text-gray-900">
                        {topic.topic_no}
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-900">
                        {topic.name}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {getSubjectName(Number(subjectId))}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {getChapterName(topic.chapter_id)}
                      </td>

                      <td className="max-w-xs px-5 py-4 text-gray-600">
                        <p className="truncate">{topic.description || "—"}</p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={
                            topic.status === "ACTIVE"
                              ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                              : "rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
                          }
                        >
                          {topic.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-3">
                          <Button
                            href={`/topic/view/${topic.id}`}
                            variant="outline"
                            size="sm"
                          >
                            View
                          </Button>

                          <Button
                            href={`/topic/edit/${topic.id}`}
                            variant="outline"
                            size="sm"
                          >
                            Edit
                          </Button>

                          <DeleteConfirm
                            title="Delete Topic"
                            content="Are you sure you want to delete this topic?"
                            loading={deletingId === topic.id}
                            onConfirm={() => handleDelete(topic.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}

            <div className="divide-y divide-gray-100 md:hidden">
              {topics.map((topic) => (
                <div key={topic.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">
                        Topic {topic.topic_no}
                      </p>

                      <h2 className="mt-1 font-semibold text-gray-900">
                        {topic.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {getChapterName(topic.chapter_id)}
                      </p>
                    </div>

                    <span
                      className={
                        topic.status === "ACTIVE"
                          ? "shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                          : "shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
                      }
                    >
                      {topic.status}
                    </span>
                  </div>

                  {topic.description && (
                    <p className="mt-3 text-sm text-gray-600">
                      {topic.description}
                    </p>
                  )}

                  <div className="mt-4 flex gap-4">
                    <Link
                      href={`/topic/view/${topic.id}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      View
                    </Link>

                    <Link
                      href={`/topic/edit/${topic.id}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      Edit
                    </Link>

                    <DeleteConfirm
                      loading={deletingId === topic.id}
                      onConfirm={() => handleDelete(topic.id)}
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
