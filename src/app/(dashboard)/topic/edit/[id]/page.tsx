"use client";

import { FormEvent, useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { getTopic, updateTopic } from "@/lib/api/topics";

import { getSubjects } from "@/lib/api/subject";

import { getChapter, getChapters } from "@/lib/api/chapters";

import type { Subject } from "@/lib/api/subject";

import type { Chapter } from "@/lib/api/chapters";
import Button from "../../../../../../components/button/Button";

export default function EditTopicPage() {
  const params = useParams();

  const router = useRouter();

  const id = Number(params.id);

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [chapters, setChapters] = useState<Chapter[]>([]);

  const [subjectId, setSubjectId] = useState("");

  const [chapterId, setChapterId] = useState("");

  const [topicNo, setTopicNo] = useState("");

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [status, setStatus] = useState("ACTIVE");

  const [loading, setLoading] = useState(true);

  const [chapterLoading, setChapterLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [topic, subjectList] = await Promise.all([
          getTopic(id),
          getSubjects(),
        ]);

        if (cancelled) {
          return;
        }

        setSubjects(subjectList);

        setTopicNo(String(topic.topic_no));

        setName(topic.name);

        setDescription(topic.description ?? "");

        setStatus(topic.status);

        const chapter = await getChapter(topic.chapter_id);

        if (cancelled) {
          return;
        }

        setChapterId(String(chapter.id));

        setSubjectId(String(chapter.subject_id));

        const chapterList = await getChapters(chapter.subject_id);

        if (!cancelled) {
          setChapters(chapterList);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load topic",
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

  // ==========================================
  // SUBJECT CHANGE
  // ==========================================

  async function handleSubjectChange(value: string) {
    setSubjectId(value);

    setChapterId("");

    setChapters([]);

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
  // SUBMIT
  // ==========================================

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

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
      setSaving(true);

      await updateTopic(id, {
        chapter_id: Number(chapterId),

        topic_no: parsedTopicNo,

        name: name.trim(),

        description: description.trim() || undefined,

        status,
      });

      router.push(`/topic/view/${id}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update topic",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading topic...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Topic</h1>

        <p className="mt-1 text-sm text-gray-500">Update topic information</p>
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
          </label>

          <input
            id="topicNo"
            type="number"
            min="1"
            value={topicNo}
            onChange={(event) => setTopicNo(event.target.value)}
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
          </label>

          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
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
            className="w-full resize-y rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* Status */}

        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          >
            <option value="ACTIVE">ACTIVE</option>

            <option value="INACTIVE">INACTIVE</option>
          </select>
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
