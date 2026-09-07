"use client";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getChapter, updateChapter } from "@/lib/api/chapters";
import { getSubjects } from "@/lib/api/subject";
import type { Subject } from "@/lib/api/subject";
import Button from "../../../../../../components/button/Button";
export default function EditChapterPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [chapterNo, setChapterNo] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [loading, setLoading] = useState(true);
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

        const [chapter, subjectList] = await Promise.all([
          getChapter(id),
          getSubjects(),
        ]);

        if (cancelled) {
          return;
        }

        setSubjects(subjectList);
        setSubjectId(String(chapter.subject_id));
        setChapterNo(String(chapter.chapter_no));
        setName(chapter.name);
        setDescription(chapter.description ?? "");
        setStatus(chapter.status);
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

    loadData();

    return () => {
      cancelled = true;
    };
  }, [id]);

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
      setSaving(true);

      await updateChapter(id, {
        subject_id: Number(subjectId),
        chapter_no: parsedChapterNo,
        name: name.trim(),
        description: description.trim() || undefined,
        status,
      });

      router.push(`/chapter/view/${id}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update chapter",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading chapter...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Chapter</h1>

        <p className="mt-1 text-sm text-gray-500">Update chapter information</p>
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
            onChange={(event) => setSubjectId(event.target.value)}
            className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          >
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
          </label>

          <input
            id="chapterNo"
            type="number"
            min="1"
            value={chapterNo}
            onChange={(event) => setChapterNo(event.target.value)}
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
          <Button variant="secondary" onClick={() => router.back()}>
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
