"use client";

import { useEffect, useState } from "react";
import { getQuestions, deleteQuestion } from "@/lib/api/questions";

import { getSubjects } from "@/lib/api/subject";

import { getChapters } from "@/lib/api/chapters";

import { getTopics } from "@/lib/api/topics";

import type { Question } from "@/lib/api/questions";

import type { Subject } from "@/lib/api/subject";

import type { Chapter } from "@/lib/api/chapters";

import type { Topic } from "@/lib/api/topics";
import Button from "../../../../components/button/Button";
import DeleteConfirm from "../../../../components/common/DeleteConfirm";

export default function QuestionPage() {
  const [questions, setQuestions] = useState<Question[]>([]);

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [topics, setTopics] = useState<Topic[]>([]);

  const [search, setSearch] = useState("");

  const [subjectId, setSubjectId] = useState("");

  const [chapterId, setChapterId] = useState("");

  const [topicId, setTopicId] = useState("");

  const [difficulty, setDifficulty] = useState("");

  const [page, setPage] = useState(1);

  const pageSize = 10;

  const [total, setTotal] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);

  const [subjectLoading, setSubjectLoading] = useState(true);

  const [chapterLoading, setChapterLoading] = useState(false);

  const [topicLoading, setTopicLoading] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState("");

  // ==========================================
  // SUBJECTS
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
  // CHAPTERS
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
  // TOPICS
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    if (!chapterId) {
      return;
    }

    async function loadTopics() {
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
          setTopicLoading(false);
        }
      }
    }

    loadTopics();

    return () => {
      cancelled = true;
    };
  }, [chapterId]);

  // ==========================================
  // LOAD QUESTIONS
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      try {
        const result = await getQuestions({
          page,
          pageSize,
          search,
          subjectId: subjectId ? Number(subjectId) : undefined,
          chapterId: chapterId ? Number(chapterId) : undefined,
          topicId: topicId ? Number(topicId) : undefined,
          difficulty: difficulty || undefined,
        });

        if (!cancelled) {
          setQuestions(result.data);
          setTotal(result.pagination.total);
          setTotalPages(result.pagination.total_pages);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load questions",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadQuestions();

    return () => {
      cancelled = true;
    };
  }, [page, search, subjectId, chapterId, topicId, difficulty]);

  // ==========================================
  // DELETE
  // ==========================================

  async function handleDelete(id: number) {
    try {
      setDeletingId(id);
      setError("");

      await deleteQuestion(id);

      setQuestions((current) =>
        current.filter((question) => question.id !== id),
      );

      setTotal((current) => Math.max(current - 1, 0));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete question",
      );

      throw error;
    } finally {
      setDeletingId(null);
    }
  }

  // ==========================================
  // RESET FILTERS
  // ==========================================

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
    setLoading(true);
    setError("");
  }

  function handleSubjectChange(value: string) {
    setSubjectId(value);
    setChapterId("");
    setTopicId("");
    setChapters([]);
    setTopics([]);
    setPage(1);
    setLoading(true);
    setError("");
    setChapterLoading(Boolean(value));
    setTopicLoading(false);
  }

  function handleChapterChange(value: string) {
    setChapterId(value);
    setTopicId("");
    setTopics([]);
    setPage(1);
    setLoading(true);
    setError("");
    setTopicLoading(Boolean(value));
  }

  function handleTopicChange(value: string) {
    setTopicId(value);
    setPage(1);
    setLoading(true);
    setError("");
  }

  function handleDifficultyChange(value: string) {
    setDifficulty(value);
    setPage(1);
    setLoading(true);
    setError("");
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    setLoading(true);
    setError("");
  }

  function resetFilters() {
    setSearch("");
    setSubjectId("");
    setChapterId("");
    setTopicId("");
    setChapters([]);
    setTopics([]);
    setDifficulty("");
    setPage(1);
    setLoading(true);
    setError("");
    setChapterLoading(false);
    setTopicLoading(false);
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Questions</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your question bank
          </p>
        </div>

        <Button href="/question/create">Add Question</Button>
      </div>

      {/* Filters */}

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Search */}

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Search
            </label>

            <input
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search question..."
              className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {/* Subject */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Subject
            </label>

            <select
              value={subjectId}
              onChange={(event) => handleSubjectChange(event.target.value)}
              disabled={subjectLoading}
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none disabled:bg-gray-100"
            >
              <option value="">
                {subjectLoading ? "Loading subjects..." : "All Subjects"}
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
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Chapter
            </label>

            <select
              value={chapterId}
              onChange={(event) => handleChapterChange(event.target.value)}
              disabled={!subjectId || chapterLoading}
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none disabled:bg-gray-100"
            >
              <option value="">
                {!subjectId
                  ? "Select subject first"
                  : chapterLoading
                    ? "Loading..."
                    : "All Chapters"}
              </option>

              {chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.chapter_no} - {chapter.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Topic
            </label>

            <select
              value={topicId}
              onChange={(event) => handleTopicChange(event.target.value)}
              disabled={!chapterId || topicLoading}
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none disabled:bg-gray-100"
            >
              <option value="">
                {!chapterId
                  ? "Select chapter first"
                  : topicLoading
                    ? "Loading..."
                    : "All Topics"}
              </option>

              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.topic_no} - {topic.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Difficulty
            </label>

            <select
              value={difficulty}
              onChange={(event) => handleDifficultyChange(event.target.value)}
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none"
            >
              <option value="">All Difficulties</option>

              <option value="EASY">Easy</option>

              <option value="MEDIUM">Medium</option>

              <option value="HARD">Hard</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Count */}

      <div className="mt-6 text-sm text-gray-500">
        {total} question{total !== 1 ? "s" : ""}
      </div>

      {/* Questions */}

      <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading questions...
          </div>
        ) : questions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">No questions found.</p>
          </div>
        ) : (
          <>
            {/* Desktop */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 font-medium text-gray-600">
                      Question
                    </th>

                    <th className="px-5 py-3 font-medium text-gray-600">
                      Subject
                    </th>

                    <th className="px-5 py-3 font-medium text-gray-600">
                      Chapter
                    </th>

                    <th className="px-5 py-3 font-medium text-gray-600">
                      Topic
                    </th>

                    <th className="px-5 py-3 font-medium text-gray-600">
                      Difficulty
                    </th>

                    <th className="px-5 py-3 text-right font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {questions.map((question) => (
                    <tr
                      key={question.id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="max-w-md px-5 py-4">
                        <p className="line-clamp-2 font-medium text-gray-900">
                          {question.question_text}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Version {question.version_no ?? "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {question.subject_name}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {question.chapter_no} - {question.chapter_name}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {question.topic_no} - {question.topic_name}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                          {question.difficulty}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            href={`/question/view/${question.id}`}
                            variant="ghost"
                            size="sm"
                          >
                            View
                          </Button>

                          <Button
                            href={`/question/edit/${question.id}`}
                            variant="outline"
                            size="sm"
                          >
                            Edit
                          </Button>
                          <Button
                            href={`/question/versions/${question.id}`}
                            variant="ghost"
                            size="sm"
                          >
                            Versions
                          </Button>

                          <DeleteConfirm
                            loading={deletingId === question.id}
                            onConfirm={() => handleDelete(question.id)}
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
              {questions.map((question) => (
                <div key={question.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">
                        Question #{question.id}
                      </p>

                      <p className="mt-1 font-medium text-gray-900">
                        {question.question_text}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      {question.difficulty}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-sm text-gray-500">
                    <p>{question.subject_name}</p>

                    <p>
                      Chapter {question.chapter_no}: {question.chapter_name}
                    </p>

                    <p>
                      Topic {question.topic_no}: {question.topic_name}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      href={`/question/view/${question.id}`}
                      variant="ghost"
                      size="sm"
                    >
                      View
                    </Button>

                    <Button
                      href={`/question/edit/${question.id}`}
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      href={`/question/versions/${question.id}`}
                      variant="ghost"
                      size="sm"
                    >
                      Versions
                    </Button>

                    <DeleteConfirm
                      loading={deletingId === question.id}
                      onConfirm={() => handleDelete(question.id)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 p-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  Previous
                </Button>

                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
