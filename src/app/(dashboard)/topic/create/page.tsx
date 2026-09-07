"use client";

import { FormEvent, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { createTopic } from "@/lib/api/topics";

import { getSubjects } from "@/lib/api/subject";

import { getChapters } from "@/lib/api/chapters";

import type { Subject } from "@/lib/api/subject";

import type { Chapter } from "@/lib/api/chapters";
import Button from "../../../../../components/button/Button";

export default function CreateTopicPage() {
  const router = useRouter();

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [subjectId, setSubjectId] = useState("");

  const [chapterId, setChapterId] = useState("");

  const [topicNo, setTopicNo] = useState("");

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [subjectLoading, setSubjectLoading] = useState(true);

  const [chapterLoading, setChapterLoading] = useState(false);

  const [loading, setLoading] = useState(false);

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
  // LOAD CHAPTERS
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

  function handleSubjectChange(nextSubjectId: string) {
    setSubjectId(nextSubjectId);
    setChapterId("");
    setChapters([]);
    setError("");
    setChapterLoading(Boolean(nextSubjectId));
  }

  // ==========================================
  // SUBMIT
  // ==========================================

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

    if (!topicNo) {
      setError("Topic number is required.");

      return;
    }

    if (!name.trim()) {
      setError("Topic name is required.");

      return;
    }

    const parsedTopicNo = Number(topicNo);

    if (!Number.isInteger(parsedTopicNo) || parsedTopicNo <= 0) {
      setError("Topic number must be a positive integer.");

      return;
    }

    try {
      setLoading(true);

      const topic = await createTopic({
        chapter_id: Number(chapterId),

        topic_no: parsedTopicNo,

        name: name.trim(),

        description: description.trim() || undefined,
      });

      router.push(`/topic/view/${topic.id}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create topic",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Topic</h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a topic under a chapter
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
      >
        {/* Subject */}

        <div>
          <label
            htmlFor="subject"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Subject
            <span className="ml-1 text-red-500">*</span>
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
            <span className="ml-1 text-red-500">*</span>
          </label>

          <select
            id="chapter"
            value={chapterId}
            onChange={(event) => setChapterId(event.target.value)}
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

        {/* Topic Number */}

        <div>
          <label
            htmlFor="topicNo"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Topic Number
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="topicNo"
            type="number"
            min="1"
            value={topicNo}
            onChange={(event) => setTopicNo(event.target.value)}
            placeholder="e.g. 1"
            className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* Name */}

        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Topic Name
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Sets"
            className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* Description */}

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            placeholder="Optional description"
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

          <Button
            type="submit"
            loading={loading}
            loadingText="Creating..."
            disabled={subjectLoading}
          >
            Create Topic
          </Button>
        </div>
      </form>
    </div>
  );
}
