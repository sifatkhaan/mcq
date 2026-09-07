"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { getQuestion, updateQuestion } from "@/lib/api/questions";

import { getSubjects } from "@/lib/api/subject";

import { getChapters } from "@/lib/api/chapters";

import { getTopics } from "@/lib/api/topics";

import type { Question } from "@/lib/api/questions";

import type { Subject } from "@/lib/api/subject";

import type { Chapter } from "@/lib/api/chapters";

import type { Topic } from "@/lib/api/topics";
import Button from "../../../../../../components/button/Button";

interface FormOption {
  option_order: number;
  option_text: string;
  is_correct: boolean;
}

export default function EditQuestionPage() {
  const params = useParams();

  const router = useRouter();

  const id = Number(params.id);

  const [question, setQuestion] = useState<Question | null>(null);

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [topics, setTopics] = useState<Topic[]>([]);

  const [subjectId, setSubjectId] = useState("");

  const [chapterId, setChapterId] = useState("");

  const [topicId, setTopicId] = useState("");

  const [questionText, setQuestionText] = useState("");

  const [explanation, setExplanation] = useState("");

  const [difficulty, setDifficulty] = useState("EASY");

  const [options, setOptions] = useState<FormOption[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [chapterLoading, setChapterLoading] = useState(false);

  const [topicLoading, setTopicLoading] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // LOAD QUESTION + SUBJECTS
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

        const [questionResult, subjectResult] = await Promise.all([
          getQuestion(id),
          getSubjects(),
        ]);

        if (cancelled) {
          return;
        }

        setQuestion(questionResult);

        setSubjects(subjectResult);

        const version = questionResult.version;

        if (!version) {
          throw new Error("Question version data was not found.");
        }

        setSubjectId(String(questionResult.subject_id));

        setChapterId(String(questionResult.chapter_id));

        setTopicId(String(questionResult.topic_id));

        setQuestionText(version.question_text);

        setExplanation(version.explanation ?? "");

        setDifficulty(version.difficulty);

        setOptions(
          version.options
            .slice()
            .sort((a, b) => a.option_order - b.option_order)
            .map((option) => ({
              option_order: option.option_order,

              option_text: option.option_text,

              is_correct: option.is_correct,
            })),
        );

        // Load chapters

        setChapterLoading(true);

        const chapterResult = await getChapters(questionResult.subject_id);

        if (cancelled) {
          return;
        }

        setChapters(chapterResult);

        // Load topics

        setTopicLoading(true);

        const topicResult = await getTopics(questionResult.chapter_id);

        if (cancelled) {
          return;
        }

        setTopics(topicResult);
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load question",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);

          setChapterLoading(false);

          setTopicLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ==========================================
  // SUBJECT CHANGE
  // ==========================================

  async function handleSubjectChange(value: string) {
    setSubjectId(value);

    setChapterId("");

    setTopicId("");

    setChapters([]);

    setTopics([]);

    if (!value) {
      return;
    }

    try {
      setChapterLoading(true);

      setError("");

      const result = await getChapters(Number(value));

      setChapters(result);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load chapters",
      );
    } finally {
      setChapterLoading(false);
    }
  }

  // ==========================================
  // CHAPTER CHANGE
  // ==========================================

  async function handleChapterChange(value: string) {
    setChapterId(value);

    setTopicId("");

    setTopics([]);

    if (!value) {
      return;
    }

    try {
      setTopicLoading(true);

      setError("");

      const result = await getTopics(Number(value));

      setTopics(result);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load topics",
      );
    } finally {
      setTopicLoading(false);
    }
  }

  // ==========================================
  // OPTION TEXT
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

  // ==========================================
  // CORRECT ANSWER
  // ==========================================

  function selectCorrectOption(index: number) {
    setOptions((current) =>
      current.map((option, optionIndex) => ({
        ...option,

        is_correct: optionIndex === index,
      })),
    );
  }

  // ==========================================
  // ADD OPTION
  // ==========================================

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

  // ==========================================
  // REMOVE OPTION
  // ==========================================

  function removeOption(index: number) {
    if (options.length <= 2) {
      return;
    }

    const removingCorrect = options[index].is_correct;

    const updated = options
      .filter((_, optionIndex) => optionIndex !== index)
      .map((option, optionIndex) => ({
        ...option,

        option_order: optionIndex + 1,
      }));

    // If the removed option was correct,
    // no option becomes automatically correct.

    if (removingCorrect) {
      setOptions(
        updated.map((option) => ({
          ...option,
          is_correct: false,
        })),
      );

      return;
    }

    setOptions(updated);
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

    if (options.length < 2) {
      setError("At least two options are required.");

      return;
    }

    const emptyOption = options.find((option) => !option.option_text.trim());

    if (emptyOption) {
      setError("All options must have text.");

      return;
    }

    const correctOptions = options.filter((option) => option.is_correct);

    if (correctOptions.length !== 1) {
      setError("Please select exactly one correct answer.");

      return;
    }

    try {
      setSaving(true);

      await updateQuestion(id, {
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

      router.push(`/question/view/${id}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update question",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading question...</div>;
  }

  if (error && !question) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Header */}

      <div>
        <p className="text-sm text-gray-500">Question #{id}</p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">Edit Question</h1>

        <p className="mt-1 text-sm text-gray-500">
          Updating this question will create/update its current version
          according to the backend rules.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
      >
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
            className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          >
            <option value="">Select subject</option>

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
            className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none disabled:bg-gray-100"
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
          <label
            htmlFor="topic"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Topic
          </label>

          <select
            id="topic"
            value={topicId}
            onChange={(event) => setTopicId(event.target.value)}
            disabled={!chapterId || topicLoading}
            className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none disabled:bg-gray-100"
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
          <label
            htmlFor="questionText"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Question
          </label>

          <textarea
            id="questionText"
            value={questionText}
            onChange={(event) => setQuestionText(event.target.value)}
            rows={5}
            className="w-full resize-y rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* Difficulty */}

        <div>
          <label
            htmlFor="difficulty"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Difficulty
          </label>

          <select
            id="difficulty"
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
                Select exactly one correct answer.
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
                key={index}
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
        <div>
          <label
            htmlFor="explanation"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Explanation
          </label>

          <textarea
            id="explanation"
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

          <Button type="submit" loading={saving} loadingText="Saving...">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
