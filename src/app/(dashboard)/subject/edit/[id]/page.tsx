"use client";

import { FormEvent, useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";
import { getSubject, updateSubject } from "@/lib/api/subject";

export default function EditSubjectPage() {
  const params = useParams();

  const router = useRouter();

  const id = Number(params.id);

  const [name, setName] = useState("");

  const [code, setCode] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    async function loadSubject() {
      try {
        const subject = await getSubject(id);

        setName(subject.name);
        setCode(subject.code ?? "");
        setDescription(subject.description ?? "");
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load subject",
        );
      } finally {
        setLoading(false);
      }
    }

    loadSubject();
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Subject name is required.");
      return;
    }

    try {
      setSaving(true);

      await updateSubject(id, {
        name: name.trim(),
        code: code.trim() || undefined,
        description: description.trim() || undefined,
      });

      router.push(`/subject/view/${id}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update subject",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading subject...</div>;
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Subject</h1>

        <p className="mt-1 text-sm text-gray-500">Update subject information</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Subject Name
          </label>

          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Code
          </label>

          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
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

          <button
            type="submit"
            disabled={saving}
            className="min-h-11 rounded-lg bg-gray-900 px-5 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
