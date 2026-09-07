"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createQuestion } from "@/lib/api/questions";
import { getSubjects } from "@/lib/api/subject";
import { getChapters } from "@/lib/api/chapters";
import { getTopics } from "@/lib/api/topics";
import type { Subject } from "@/lib/api/subject";
import type { Chapter } from "@/lib/api/chapters";
import type { Topic } from "@/lib/api/topics";
import Button from "../../../../../components/button/Button";

interface FormOption {
  option_order: number;

  option_text: string;

  is_correct: boolean;
}

export default function CreateQuestionPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [options, setOptions] = useState<FormOption[]>([
    {
      option_order: 1,
      option_text: "",
      is_correct: false,
    },
    {
      option_order: 2,
      option_text: "",
      is_correct: false,
    },
    {
      option_order: 3,
      option_text: "",
      is_correct: false,
    },
    {
      option_order: 4,
      option_text: "",
      is_correct: false,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [subjectLoading, setSubjectLoading] = useState(true);
  const [chapterLoading, setChapterLoading] = useState(false);
  const [topicLoading, setTopicLoading] = useState(false);
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

  function handleSubjectChange(value: string) {
    setSubjectId(value);
    setChapterId("");
    setTopicId("");
    setChapters([]);
    setTopics([]);
    setError("");
    setChapterLoading(Boolean(value));
    setTopicLoading(false);
  }

  function handleChapterChange(value: string) {
    setChapterId(value);
    setTopicId("");
    setTopics([]);
    setError("");
    setTopicLoading(Boolean(value));
  }

  // ==========================================
  // OPTION CHANGE
  // ==========================================

  function updateOptionText(index: number, value: string) {
    setOptions((current) =>
      current.map((option, optionIndex) =>
        optionIndex === index
          ? {
              ...option,
              option_text: value,
            }
          : option,
      ),
    );
  }

  function selectCorrectOption(index: number) {
    setOptions((current) =>
      current.map((option, optionIndex) => ({
        ...option,
        is_correct: optionIndex === index,
      })),
    );
  }

  function addOption() {
    if (options.length >= 6) {
      return;
    }

    setOptions((current) => [
      ...current,
      {
        option_order: current.length + 1,
        option_text: "",
        is_correct: false,
      },
    ]);
  }

  function removeOption(index: number) {
    if (options.length <= 2) {
      return;
    }

    setOptions((current) =>
      current
        .filter((_, optionIndex) => optionIndex !== index)
        .map((option, optionIndex) => ({
          ...option,
          option_order: optionIndex + 1,
        })),
    );
  }

  // ==========================================
  // SUBMIT
  // ==========================================

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!subjectId) {
      setError("Please select a subject.");
      return;
    }

    if (!chapterId) {
      setError("Please select a chapter.");
      return;
    }

    if (!topicId) {
      setError("Please select a topic.");
      return;
    }

    if (!questionText.trim()) {
      setError("Question text is required.");
      return;
    }

    const emptyOption = options.find((option) => !option.option_text.trim());
    if (emptyOption) {
      setError("All options must have text.");
      return;
    }

    const hasCorrectAnswer = options.some((option) => option.is_correct);
    if (!hasCorrectAnswer) {
      setError("Please select the correct answer.");
      return;
    }

    try {
      setLoading(true);

      const question = await createQuestion({
        subject_id: Number(subjectId),
        chapter_id: Number(chapterId),
        topic_id: Number(topicId),
        question_text: questionText.trim(),
        explanation: explanation.trim() || undefined,
        difficulty,
        options: options.map((option) => ({
          option_order: option.option_order,
          option_text: option.option_text.trim(),
          is_correct: option.is_correct,
        })),
      });

      router.push(`/question/view/${question.id}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create question",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Question</h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a multiple-choice question
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
      >
        {/* Subject */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Subject
          </label>

          <select
            value={subjectId}
            onChange={(event) => handleSubjectChange(event.target.value)}
            disabled={subjectLoading}
            className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
          >
            <option value="">
              {subjectLoading ? "Loading..." : "Select subject"}
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
            className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm disabled:bg-gray-100"
          >
            <option value="">
              {!subjectId
                ? "Select subject first"
                : chapterLoading
                  ? "Loading..."
                  : "Select chapter"}
            </option>

            {chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                Chapter {chapter.chapter_no} - {chapter.name}
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
            onChange={(event) => setTopicId(event.target.value)}
            disabled={!chapterId || topicLoading}
            className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm disabled:bg-gray-100"
          >
            <option value="">
              {!chapterId
                ? "Select chapter first"
                : topicLoading
                  ? "Loading..."
                  : "Select topic"}
            </option>

            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                Topic {topic.topic_no} - {topic.name}
              </option>
            ))}
          </select>
        </div>

        {/* Question */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Question
          </label>

          <textarea
            value={questionText}
            onChange={(event) => setQuestionText(event.target.value)}
            rows={5}
            placeholder="Write your question..."
            className="w-full resize-y rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* Difficulty */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Difficulty
          </label>

          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
          >
            <option value="EASY">Easy</option>

            <option value="MEDIUM">Medium</option>

            <option value="HARD">Hard</option>
          </select>
        </div>

        {/* Options */}

        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Options</h2>

              <p className="mt-1 text-xs text-gray-500">
                Select one correct answer.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
              disabled={options.length >= 6}
            >
              Add Option
            </Button>
          </div>

          <div className="space-y-3">
            {options.map((option, index) => (
              <div
                key={option.option_order}
                className="rounded-xl border border-gray-200 p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-700">
                    {option.option_order}
                  </div>

                  <input
                    value={option.option_text}
                    onChange={(event) =>
                      updateOptionText(index, event.target.value)
                    }
                    placeholder={`Option ${option.option_order}`}
                    className="min-h-11 min-w-0 flex-1 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                  />

                  <label className="flex min-h-11 shrink-0 cursor-pointer items-center gap-2 text-sm text-gray-600">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={option.is_correct}
                      onChange={() => selectCorrectOption(index)}
                      className="h-4 w-4"
                    />

                    <span className="hidden sm:inline">Correct</span>
                  </label>
                </div>

                {options.length > 2 && (
                  <div className="mt-2 flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Explanation */}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Explanation
          </label>

          <textarea
            value={explanation}
            onChange={(event) => setExplanation(event.target.value)}
            rows={4}
            placeholder="Optional explanation..."
            className="w-full resize-y rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>

          <Button type="submit" loading={loading} loadingText="Creating...">
            Create Question
          </Button>
        </div>
      </form>
    </div>
  );
}
