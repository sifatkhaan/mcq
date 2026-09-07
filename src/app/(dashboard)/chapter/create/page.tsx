"use client";

import { FormEvent, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { createChapter } from "@/lib/api/chapters";

import { getSubjects } from "@/lib/api/subject";

import type { Subject } from "@/lib/api/subject";
import Button from "../../../../../components/button/Button";

export default function CreateChapterPage() {
  const router = useRouter();

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [subjectId, setSubjectId] = useState("");

  const [chapterNo, setChapterNo] = useState("");

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const [subjectLoading, setSubjectLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSubjects() {
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

    loadSubjects();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!subjectId) {
      setError("Please select a subject.");

      return;
    }

    if (!chapterNo) {
      setError("Chapter number is required.");

      return;
    }

    if (!name.trim()) {
      setError("Chapter name is required.");

      return;
    }

    const parsedChapterNo = Number(chapterNo);

    if (!Number.isInteger(parsedChapterNo) || parsedChapterNo <= 0) {
      setError("Chapter number must be a positive integer.");

      return;
    }

    try {
      setLoading(true);

      const chapter = await createChapter({
        subject_id: Number(subjectId),

        chapter_no: parsedChapterNo,

        name: name.trim(),

        description: description.trim() || undefined,
      });

      router.push(`/chapter/view/${chapter.id}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create chapter",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Chapter</h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a chapter under a subject
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
            onChange={(event) => setSubjectId(event.target.value)}
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

        {/* Chapter Number */}

        <div>
          <label
            htmlFor="chapterNo"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Chapter Number
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="chapterNo"
            type="number"
            min="1"
            value={chapterNo}
            onChange={(event) => setChapterNo(event.target.value)}
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
            Chapter Name
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Number System"
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
          <button
            type="button"
            onClick={() => router.back()}
            className="min-h-11 rounded-lg border border-gray-300 px-5 text-sm font-medium text-gray-700"
          >
            Cancel
          </button>

          <Button type="submit" loading={loading} loadingText="Creating...">
            Create Chapter
          </Button>
        </div>
      </form>
    </div>
  );
}
