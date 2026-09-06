"use client";

import { getOrganizations, Organization } from "@/lib/api/organizations";
import { getSubjects, Subject } from "@/lib/api/subject";
import { getStoredUser } from "@/lib/auth/auth-storage";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationId, setOrganizationId] = useState("");
  const user = getStoredUser();

  const isSuperAdmin = user?.role?.includes("SUPER_ADMIN") ?? false;

  console.log("user", user?.role);

  useEffect(() => {
    if (!isSuperAdmin) {
      return;
    }
    async function loadOrganizations() {
      try {
        const result = await getOrganizations();
        setOrganizations(result);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load organizations",
        );
      }
    }

    loadOrganizations();
  }, [isSuperAdmin]);

  useEffect(() => {
    let cancelled = false;

    async function fetchSubjects() {
      if (isSuperAdmin && !organizationId) {
        setSubjects([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const result = await getSubjects(
          isSuperAdmin ? Number(organizationId) : undefined,
        );

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
          setLoading(false);
        }
      }
    }

    fetchSubjects();

    return () => {
      cancelled = true;
    };
  }, [isSuperAdmin, organizationId]);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage examination subjects
          </p>
        </div>

        <Link
          href="/subject/create"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add Subject
        </Link>
      </div>

      {/* Search */}
      {isSuperAdmin && (
        <div className="mt-6">
          <label
            htmlFor="organization"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Organization
          </label>

          <select
            id="organization"
            value={organizationId}
            onChange={(event) => setOrganizationId(event.target.value)}
            className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 sm:max-w-md"
          >
            <option value="">Select organization</option>

            {organizations.map((organization) => (
              <option key={organization.id} value={organization.id}>
                {organization.name}
                {organization.code ? ` (${organization.code})` : ""}
              </option>
            ))}
          </select>
        </div>
      )}
      <form
        onSubmit={handleSearchSubmit}
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search subjects..."
          className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 sm:max-w-md"
        />

        <button
          type="submit"
          className="min-h-11 rounded-lg border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Search
        </button>
      </form>

      {/* Error */}

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Data */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading subjects...
          </div>
        ) : subjects.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">No subjects found.</p>

            <Link
              href="/subject/create"
              className="mt-3 inline-block text-sm font-medium text-gray-900 underline"
            >
              Create your first subject
            </Link>
          </div>
        ) : (
          <>
            {/* ================================
                Desktop Table
            ================================= */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 font-medium text-gray-600">ID</th>

                    <th className="px-5 py-3 font-medium text-gray-600">
                      Name
                    </th>

                    <th className="px-5 py-3 font-medium text-gray-600">
                      Code
                    </th>

                    <th className="px-5 py-3 font-medium text-gray-600">
                      Description
                    </th>

                    <th className="px-5 py-3 font-medium text-gray-600">
                      Status
                    </th>

                    <th className="px-5 py-3 font-medium text-gray-600">
                      Created By
                    </th>

                    <th className="px-5 py-3 font-medium text-gray-600">
                      Created At
                    </th>

                    <th className="px-5 py-3 text-right font-medium text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {subjects.map((subject) => (
                    <tr
                      key={subject.id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-5 py-4 text-gray-600">{subject.id}</td>

                      <td className="px-5 py-4 font-medium text-gray-900">
                        {subject.name}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {subject.code || "—"}
                      </td>

                      <td className="max-w-xs px-5 py-4 text-gray-600">
                        <p className="truncate">{subject.description || "—"}</p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`
                            rounded-full px-2.5 py-1
                            text-xs font-medium
                            ${
                              subject.status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }
                          `}
                        >
                          {subject.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {subject.created_by}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        {new Date(subject.created_at).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/subject/view/${subject.id}`}
                          className="font-medium text-gray-700 hover:text-gray-900"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================================
                Mobile Cards
            ================================= */}

            <div className="divide-y divide-gray-100 md:hidden">
              {subjects.map((subject) => (
                <Link
                  key={subject.id}
                  href={`/subjects/view/${subject.id}`}
                  className="block p-4 active:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">#{subject.id}</p>

                      <h2 className="mt-1 truncate font-semibold text-gray-900">
                        {subject.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Code: {subject.code || "—"}
                      </p>
                    </div>

                    <span
                      className={`
                        shrink-0 rounded-full px-2.5 py-1
                        text-xs font-medium
                        ${
                          subject.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      `}
                    >
                      {subject.status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-gray-500">
                    <p>Created by: {subject.created_by}</p>

                    <p>
                      Created:{" "}
                      {new Date(subject.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
