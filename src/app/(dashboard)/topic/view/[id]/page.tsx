"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { getTopic } from "@/lib/api/topics";

import { getChapter } from "@/lib/api/chapters";

import { getSubject } from "@/lib/api/subject";

import type { Topic } from "@/lib/api/topics";

import type { Chapter } from "@/lib/api/chapters";

import type { Subject } from "@/lib/api/subject";
import Button from "../../../../../../components/button/Button";
// import Button from "../../../../../components/button/Button";

export default function ViewTopicPage() {
  const params = useParams();

  const id = Number(params.id);

  const [topic, setTopic] = useState<Topic | null>(null);

  const [chapter, setChapter] = useState<Chapter | null>(null);

  const [subject, setSubject] = useState<Subject | null>(null);

  const [loading, setLoading] = useState(true);

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

        const result = await getTopic(id);

        if (cancelled) {
          return;
        }

        setTopic(result);

        try {
          const chapterResult = await getChapter(result.chapter_id);

          if (cancelled) {
            return;
          }

          setChapter(chapterResult);

          try {
            const subjectResult = await getSubject(chapterResult.subject_id);

            if (!cancelled) {
              setSubject(subjectResult);
            }
          } catch {
            // Subject name is optional
          }
        } catch {
          // Chapter name is optional
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

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading topic...</div>;
  }

  if (error || !topic) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
        {error || "Topic not found"}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Topic {topic.topic_no}</p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {topic.name}
          </h1>
        </div>

        <Button href={`/topic/edit/${topic.id}`}>Edit</Button>
      </div>

      <div className="mt-6 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white">
        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">ID</p>

          <p className="text-gray-900 sm:col-span-2">{topic.id}</p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Subject</p>

          <p className="text-gray-900 sm:col-span-2">
            {subject?.name ?? `Subject #${chapter?.subject_id ?? "—"}`}
          </p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Chapter</p>

          <p className="text-gray-900 sm:col-span-2">
            {chapter
              ? `Chapter ${chapter.chapter_no} - ${chapter.name}`
              : `Chapter #${topic.chapter_id}`}
          </p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Topic Number</p>

          <p className="text-gray-900 sm:col-span-2">{topic.topic_no}</p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Name</p>

          <p className="font-medium text-gray-900 sm:col-span-2">
            {topic.name}
          </p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Description</p>

          <p className="whitespace-pre-wrap text-gray-900 sm:col-span-2">
            {topic.description || "—"}
          </p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Status</p>

          <p className="sm:col-span-2">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
              {topic.status}
            </span>
          </p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Created By</p>

          <p className="text-gray-900 sm:col-span-2">{topic.created_by}</p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Created At</p>

          <p className="text-gray-900 sm:col-span-2">
            {new Date(topic.created_at).toLocaleString()}
          </p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Updated By</p>

          <p className="text-gray-900 sm:col-span-2">
            {topic.updated_by ?? "—"}
          </p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Updated At</p>

          <p className="text-gray-900 sm:col-span-2">
            {topic.updated_at
              ? new Date(topic.updated_at).toLocaleString()
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
