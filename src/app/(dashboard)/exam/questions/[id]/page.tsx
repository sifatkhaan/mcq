"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getExam,
  getExamQuestions,
  addExamQuestion,
  deleteExamQuestion,
} from "@/lib/api/exams";

import { getQuestions } from "@/lib/api/questions";

import { getSubjects } from "@/lib/api/subject";

import { getChapters } from "@/lib/api/chapters";

import { getTopics } from "@/lib/api/topics";

import type { Exam, ExamQuestion } from "@/lib/api/exams";

import type { Question } from "@/lib/api/questions";

import type { Subject } from "@/lib/api/subject";

import type { Chapter } from "@/lib/api/chapters";

import type { Topic } from "@/lib/api/topics";
import Button from "../../../../../../components/button/Button";
import useDebounced from "@/hooks/debounceHook";
import DeleteConfirm from "../../../../../../components/common/DeleteConfirm";

export default function ExamQuestionsPage() {
  const params = useParams();

  const router = useRouter();

  const examId = Number(params.id);

  // =========================================================
  // EXAM
  // =========================================================

  const [exam, setExam] = useState<Exam | null>(null);

  // =========================================================
  // CURRENT EXAM QUESTIONS
  // =========================================================

  const [questions, setQuestions] = useState<ExamQuestion[]>([]);

  // =========================================================
  // FILTER DATA
  // =========================================================

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [topics, setTopics] = useState<Topic[]>([]);

  // =========================================================
  // AVAILABLE QUESTIONS
  // =========================================================

  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);

  // =========================================================
  // FILTER VALUES
  // =========================================================

  const [search, setSearch] = useState("");

  const [subjectId, setSubjectId] = useState<number | undefined>();

  const [chapterId, setChapterId] = useState<number | undefined>();

  const [topicId, setTopicId] = useState<number | undefined>();

  // =========================================================
  // DEBOUNCED SEARCH
  // =========================================================

  const debouncedSearch = useDebounced({
    searchQuery: search,
    delay: 600,
  });

  // =========================================================
  // SELECTED QUESTION
  // =========================================================

  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null,
  );

  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(
    null,
  );

  // =========================================================
  // ADD FORM
  // =========================================================

  const [questionOrder, setQuestionOrder] = useState("");

  const [marks, setMarks] = useState("1");

  const [negativeMarks, setNegativeMarks] = useState("0.25");

  // =========================================================
  // LOADING STATES
  // =========================================================

  const [loading, setLoading] = useState(true);

  const [questionsLoading, setQuestionsLoading] = useState(false);

  const [subjectsLoading, setSubjectsLoading] = useState(false);

  const [chaptersLoading, setChaptersLoading] = useState(false);

  const [topicsLoading, setTopicsLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  // =========================================================
  // ERROR
  // =========================================================

  const [error, setError] = useState("");

  // =========================================================
  // LOAD EXAM + CURRENT EXAM QUESTIONS
  // =========================================================

  useEffect(() => {
    if (!examId) {
      return;
    }

    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);

        setError("");

        const [examResult, questionsResult] = await Promise.all([
          getExam(examId),
          getExamQuestions(examId),
        ]);

        if (cancelled) {
          return;
        }

        setExam(examResult);

        const sortedQuestions = questionsResult
          .slice()
          .sort((a, b) => a.question_order - b.question_order);

        setQuestions(sortedQuestions);

        setQuestionOrder(String(sortedQuestions.length + 1));
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load exam questions.",
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
  }, [examId]);

  // =========================================================
  // LOAD SUBJECTS
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    async function loadSubjects() {
      try {
        setSubjectsLoading(true);

        const result = await getSubjects();

        if (!cancelled) {
          setSubjects(result);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load subjects.",
          );
        }
      } finally {
        if (!cancelled) {
          setSubjectsLoading(false);
        }
      }
    }

    loadSubjects();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================================================
  // LOAD CHAPTERS WHEN SUBJECT CHANGES
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    setChapterId(undefined);
    setTopicId(undefined);

    setChapters([]);
    setTopics([]);

    if (!subjectId) {
      return;
    }

    async function loadChapters() {
      try {
        setChaptersLoading(true);

        const result = await getChapters(subjectId);

        if (!cancelled) {
          setChapters(result);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load chapters.",
          );
        }
      } finally {
        if (!cancelled) {
          setChaptersLoading(false);
        }
      }
    }

    loadChapters();

    return () => {
      cancelled = true;
    };
  }, [subjectId]);

  // =========================================================
  // LOAD TOPICS WHEN CHAPTER CHANGES
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    setTopicId(undefined);

    setTopics([]);

    if (!chapterId) {
      return;
    }

    async function loadTopics() {
      try {
        setTopicsLoading(true);

        const result = await getTopics(chapterId);

        if (!cancelled) {
          setTopics(result);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load topics.",
          );
        }
      } finally {
        if (!cancelled) {
          setTopicsLoading(false);
        }
      }
    }

    loadTopics();

    return () => {
      cancelled = true;
    };
  }, [chapterId]);

  // =========================================================
  // LOAD AVAILABLE QUESTIONS
  //
  // IMPORTANT:
  // Raw search is NOT used here.
  // debouncedSearch is used instead.
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    async function loadAvailableQuestions() {
      try {
        setQuestionsLoading(true);
        setError("");
        const result = await getQuestions({
          page: 1,
          pageSize: 20,
          search: debouncedSearch.trim() || undefined,
          subjectId,
          chapterId,
          topicId,
        });

        if (!cancelled) {
          setAvailableQuestions(result.data);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load questions.",
          );
        }
      } finally {
        if (!cancelled) {
          setQuestionsLoading(false);
        }
      }
    }

    loadAvailableQuestions();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, subjectId, chapterId, topicId]);

  const addedVersionIds = useMemo(
    () => new Set(questions.map((question) => question.question_version_id)),
    [questions],
  );

  // =========================================================
  // SELECT QUESTION
  // =========================================================

  function handleSelectQuestion(question: Question) {
    if (addedVersionIds.has(question.version_id)) {
      return;
    }
    setSelectedQuestionId(question.id);
    setSelectedVersionId(question.version_id);
  }

  // =========================================================
  // ADD QUESTION
  // =========================================================

  async function handleAddQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!selectedVersionId) {
      setError("Please select a question.");

      return;
    }

    const order = Number(questionOrder);

    const marksValue = Number(marks);

    const negativeMarksValue = Number(negativeMarks);

    if (!Number.isInteger(order) || order <= 0) {
      setError("Question order must be a positive integer.");

      return;
    }

    if (!Number.isFinite(marksValue) || marksValue <= 0) {
      setError("Marks must be greater than 0.");

      return;
    }

    if (!Number.isFinite(negativeMarksValue) || negativeMarksValue < 0) {
      setError("Negative marks cannot be negative.");

      return;
    }

    if (addedVersionIds.has(selectedVersionId)) {
      setError("This question version is already added to the exam.");

      return;
    }

    try {
      setSaving(true);

      const result = await addExamQuestion(examId, {
        question_version_id: selectedVersionId,

        question_order: order,

        marks: marksValue,

        negative_marks: negativeMarksValue,
      });

      setQuestions((current) =>
        [...current, result].sort(
          (a, b) => a.question_order - b.question_order,
        ),
      );

      setSelectedQuestionId(null);

      setSelectedVersionId(null);

      setQuestionOrder(String(questions.length + 2));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to add question.",
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // DELETE QUESTION
  // =========================================================

  async function handleDeleteQuestion(examQuestionId: number) {
    try {
      setDeletingId(examQuestionId);

      setError("");

      await deleteExamQuestion(examId, examQuestionId);

      setQuestions((current) => {
        const updated = current
          .filter((question) => question.exam_question_id !== examQuestionId)
          .map((question, index) => ({
            ...question,
            question_order: index + 1,
          }));

        setQuestionOrder(String(updated.length + 1));

        return updated;
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to remove question.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  function handleClearFilters() {
    setSearch("");

    setSubjectId(undefined);

    setChapterId(undefined);

    setTopicId(undefined);
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-7 w-48 rounded bg-gray-200" />

          <div className="h-4 w-64 rounded bg-gray-200" />

          <div className="h-32 rounded-2xl bg-gray-100" />

          <div className="h-24 rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Exam #{examId}</p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Exam Questions
          </h1>

          {exam && <p className="mt-2 text-sm text-gray-500">{exam.title}</p>}
        </div>

        <Button
          variant="outline"
          onClick={() => router.push(`/exam/view/${examId}`)}
        >
          Back to Exam
        </Button>
      </div>

      {/* ================================================== */}
      {/* ERROR */}
      {/* ================================================== */}

      {error && (
        <div className="mt-6 flex items-start justify-between gap-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0 text-red-400 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* ================================================== */}
      {/* CURRENT QUESTIONS */}
      {/* ================================================== */}

      <section className="mt-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Questions</h2>

          <p className="mt-1 text-sm text-gray-500">
            {questions.length} question
            {questions.length !== 1 ? "s" : ""} added to this exam
          </p>
        </div>

        {questions.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="text-sm font-medium text-gray-700">
              No questions added yet.
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Search and select questions below.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {questions.map((question) => (
              <div
                key={question.exam_question_id}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex items-start gap-3">
                  {/* ORDER */}

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                    {question.question_order}
                  </div>

                  {/* CONTENT */}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        {question.subject_name}
                      </span>

                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        {question.difficulty}
                      </span>

                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        Version {question.version_no}
                      </span>
                    </div>

                    <p className="mt-3 text-sm font-medium leading-6 text-gray-900">
                      {question.question_text}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
                      <span>
                        Marks:{" "}
                        <strong className="text-gray-700">
                          {question.marks}
                        </strong>
                      </span>

                      <span>
                        Negative:{" "}
                        <strong className="text-gray-700">
                          {question.negative_marks}
                        </strong>
                      </span>

                      <span>
                        Version ID:{" "}
                        <strong className="text-gray-700">
                          {question.question_version_id}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* DELETE */}

                  <div className="shrink-0">
                    <DeleteConfirm
                      loading={deletingId === question.exam_question_id}
                      onConfirm={() =>
                        handleDeleteQuestion(question.exam_question_id)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================================================== */}
      {/* ADD QUESTION */}
      {/* ================================================== */}

      <form
        id="add-exam-question-form"
        onSubmit={handleAddQuestion}
        className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Add Question</h2>

          <p className="mt-1 text-sm text-gray-500">
            Search and filter questions, then select one to add.
          </p>
        </div>
        <div className="mt-5 rounded-xl bg-gray-50 p-4">
          {/* SEARCH */}

          <div>
            <label
              htmlFor="question-search"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Search Questions
            </label>

            <div className="relative">
              <input
                id="question-search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by question text..."
                className="min-h-11 w-full rounded-xl border border-gray-300 bg-white px-4 pr-20 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />

              {/* LOADER */}

              {questionsLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                </div>
              )}

              {/* CLEAR */}

              {!questionsLoading && search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full text-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <p className="mt-1.5 text-xs text-gray-400">
              Search starts after you stop typing.
            </p>
          </div>

          {/* FILTERS */}

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {/* SUBJECT */}

            <div>
              <label
                htmlFor="subject-filter"
                className="mb-2 block text-xs font-medium text-gray-600"
              >
                Subject
              </label>

              <select
                id="subject-filter"
                value={subjectId ?? ""}
                disabled={subjectsLoading}
                onChange={(event) => {
                  const value = event.target.value;

                  setSubjectId(value ? Number(value) : undefined);
                }}
                className="min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <option value="">All Subjects</option>

                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* CHAPTER */}

            <div>
              <label
                htmlFor="chapter-filter"
                className="mb-2 block text-xs font-medium text-gray-600"
              >
                Chapter
              </label>

              <select
                id="chapter-filter"
                value={chapterId ?? ""}
                disabled={!subjectId || chaptersLoading}
                onChange={(event) => {
                  const value = event.target.value;

                  setChapterId(value ? Number(value) : undefined);
                }}
                className="min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <option value="">All Chapters</option>

                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    Chapter {chapter.chapter_no} — {chapter.name}
                  </option>
                ))}
              </select>
            </div>

            {/* TOPIC */}

            <div>
              <label
                htmlFor="topic-filter"
                className="mb-2 block text-xs font-medium text-gray-600"
              >
                Topic
              </label>

              <select
                id="topic-filter"
                value={topicId ?? ""}
                disabled={!chapterId || topicsLoading}
                onChange={(event) => {
                  const value = event.target.value;

                  setTopicId(value ? Number(value) : undefined);
                }}
                className="min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                <option value="">All Topics</option>

                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    Topic {topic.topic_no} — {topic.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CLEAR FILTER */}

          {(search || subjectId || chapterId || topicId) && (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-medium text-gray-500 transition hover:text-gray-900"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* ================================================= */}
        {/* QUESTION RESULTS */}
        {/* ================================================= */}

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              Available Questions
            </p>

            {!questionsLoading && (
              <p className="text-xs text-gray-500">
                {availableQuestions.length} found
              </p>
            )}
          </div>

          {/* LOADING */}

          {questionsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex gap-3">
                    <div className="h-5 w-5 shrink-0 rounded-full bg-gray-200" />

                    <div className="min-w-0 flex-1">
                      <div className="flex gap-2">
                        <div className="h-5 w-20 rounded-full bg-gray-200" />

                        <div className="h-5 w-16 rounded-full bg-gray-200" />
                      </div>

                      <div className="mt-3 h-4 w-4/5 rounded bg-gray-200" />

                      <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : availableQuestions.length === 0 ? (
            /* EMPTY */

            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                ?
              </div>

              <p className="mt-3 text-sm font-medium text-gray-700">
                No questions found
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            /* RESULTS */

            <div className="max-h-[500px] space-y-2 overflow-y-auto rounded-xl border border-gray-200 p-2">
              {availableQuestions.map((question) => {
                const alreadyAdded = addedVersionIds.has(question.version_id);

                const selected = selectedQuestionId === question.id;

                return (
                  <button
                    key={question.id}
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => handleSelectQuestion(question)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      alreadyAdded
                        ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-50"
                        : selected
                          ? "border-gray-900 bg-gray-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* RADIO */}

                      <div
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          selected
                            ? "border-gray-900 bg-gray-900"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {selected && (
                          <div className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </div>

                      {/* QUESTION CONTENT */}

                      <div className="min-w-0 flex-1">
                        {/* BADGES */}

                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                            {question.subject_name}
                          </span>

                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                            Chapter {question.chapter_no}
                          </span>

                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                            {question.difficulty}
                          </span>

                          <span className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">
                            Version {question.version_no}
                          </span>
                        </div>

                        {/* QUESTION */}

                        <p className="mt-2 text-sm font-medium leading-6 text-gray-900">
                          {question.question_text}
                        </p>

                        {/* IDS */}

                        <p className="mt-1 text-xs text-gray-400">
                          Question ID: {question.id}
                          {" · "}
                          Version ID: {question.version_id}
                        </p>

                        {/* ALREADY ADDED */}

                        {alreadyAdded && (
                          <p className="mt-2 text-xs font-medium text-gray-500">
                            Already added to this exam
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ================================================= */}
        {/* SELECTED QUESTION */}
        {/* ================================================= */}

        {selectedQuestionId && (
          <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Selected Question
            </p>

            <p className="mt-2 text-sm font-medium leading-6 text-gray-900">
              {
                availableQuestions.find(
                  (question) => question.id === selectedQuestionId,
                )?.question_text
              }
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Version ID:{" "}
              <strong className="text-gray-700">{selectedVersionId}</strong>
            </p>
          </div>
        )}

        {/* ================================================= */}
        {/* QUESTION SETTINGS */}
        {/* ================================================= */}

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {/* ORDER */}

          <div>
            <label
              htmlFor="question-order"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Question Order
            </label>

            <input
              id="question-order"
              type="number"
              min="1"
              value={questionOrder}
              onChange={(event) => setQuestionOrder(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {/* MARKS */}

          <div>
            <label
              htmlFor="question-marks"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Marks
            </label>

            <input
              id="question-marks"
              type="number"
              min="0"
              step="0.01"
              value={marks}
              onChange={(event) => setMarks(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          {/* NEGATIVE MARKS */}

          <div>
            <label
              htmlFor="negative-marks"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Negative Marks
            </label>

            <input
              id="negative-marks"
              type="number"
              min="0"
              step="0.01"
              value={negativeMarks}
              onChange={(event) => setNegativeMarks(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-gray-300 px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>

        {/* ================================================= */}
        {/* SUBMIT */}
        {/* ================================================= */}

        <div className="mt-5 flex justify-end border-t border-gray-100 pt-5">
          <Button
            type="submit"
            loading={saving}
            loadingText="Adding..."
            disabled={!selectedVersionId}
            onClick={() => {
              const form = document.getElementById(
                "add-exam-question-form",
              ) as HTMLFormElement | null;

              form?.requestSubmit();
            }}
          >
            Add Question
          </Button>
        </div>
      </form>
    </div>
  );
}
