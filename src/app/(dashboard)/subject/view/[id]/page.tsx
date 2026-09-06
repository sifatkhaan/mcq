"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSubject, Subject } from "@/lib/api/subject";

export default function ViewSubjectPage() {
  const params = useParams();
  const id = Number(params.id);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    async function load() {
      try {
        setLoading(true);

        const result = await getSubject(id);

        setSubject(result);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load subject",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading subject...</div>;
  }

  if (error || !subject) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
        {error || "Subject not found"}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{subject.name}</h1>

          <p className="mt-1 text-sm text-gray-500">Subject details</p>
        </div>

        <Link
          href={`/subject/edit/${subject.id}`}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gray-900 px-4 text-sm font-medium text-white"
        >
          Edit
        </Link>
      </div>

      <div className="mt-6 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white">
        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Name</p>

          <p className="font-medium text-gray-900 sm:col-span-2">
            {subject.name}
          </p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Code</p>

          <p className="text-gray-900 sm:col-span-2">{subject.code || "—"}</p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Description</p>

          <p className="whitespace-pre-wrap text-gray-900 sm:col-span-2">
            {subject.description || "—"}
          </p>
        </div>

        <div className="grid gap-1 p-5 sm:grid-cols-3">
          <p className="text-sm text-gray-500">Status</p>

          <p className="sm:col-span-2">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
              {subject.is_active === false ? "Inactive" : "Active"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
