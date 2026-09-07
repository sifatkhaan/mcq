"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { getChapter } from "@/lib/api/chapters";

import { getSubject } from "@/lib/api/subject";

import type { Chapter } from "@/lib/api/chapters";

import type { Subject } from "@/lib/api/subject";

export default function ViewChapterPage() {
  const params = useParams();

  const id = Number(params.id);

  const [chapter, setChapter] = useState<Chapter | null>(null);

  const [subject, setSubject] = useState<Subject | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    async function loadChapter() {
      try {
        setLoading(true);
        setError("");

        const result = await getChapter(id);

        if (cancelled) {
          return;
        }

        setChapter(result);

        try {
          const subjectResult = await getSubject(result.subject_id);

          if (!cancelled) {
            setSubject(subjectResult);
          }
        } catch {
          // Subject name is optional
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load chapter",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadChapter();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading chapter...</div>;
  }

  if (error || !chapter) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
        {error || "Chapter not found"}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Chapter {chapter.chapter_no}</p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {chapter.name}
          </h1>
        </div>

        <Link
          href={`/chapter/edit/${chapter.id}`}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gray-900 px-4 text-sm font-medium text-white"
        >
          Edit
        </Link>
      </div>

      <div className="mt-6 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white">
        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">ID</p>

          <p className="text-gray-900 sm:col-span-2">{chapter.id}</p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Subject</p>

          <p className="font-medium text-gray-900 sm:col-span-2">
            {subject?.name ?? `Subject #${chapter.subject_id}`}
          </p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Chapter Number</p>

          <p className="text-gray-900 sm:col-span-2">{chapter.chapter_no}</p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Name</p>

          <p className="font-medium text-gray-900 sm:col-span-2">
            {chapter.name}
          </p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Description</p>

          <p className="whitespace-pre-wrap text-gray-900 sm:col-span-2">
            {chapter.description || "—"}
          </p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Status</p>

          <p className="sm:col-span-2">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
              {chapter.status}
            </span>
          </p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Created By</p>

          <p className="text-gray-900 sm:col-span-2">{chapter.created_by}</p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Created At</p>

          <p className="text-gray-900 sm:col-span-2">
            {new Date(chapter.created_at).toLocaleString()}
          </p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Updated By</p>

          <p className="text-gray-900 sm:col-span-2">
            {chapter.updated_by ?? "—"}
          </p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Updated At</p>

          <p className="text-gray-900 sm:col-span-2">
            {chapter.updated_at
              ? new Date(chapter.updated_at).toLocaleString()
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
