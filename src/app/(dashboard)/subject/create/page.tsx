"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/lib/auth/auth-storage";
import { getOrganizations, Organization } from "@/lib/api/organizations";
import { createSubject } from "@/lib/api/subject";

export default function CreateSubjectPage() {
  const router = useRouter();
  const user = getStoredUser();
  const isSuperAdmin = user?.role?.includes("SUPER_ADMIN") ?? false;
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationId, setOrganizationId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [organizationLoading, setOrganizationLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSuperAdmin) {
      return;
    }

    async function loadOrganizations() {
      try {
        setOrganizationLoading(true);

        const result = await getOrganizations();

        setOrganizations(result);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load organizations",
        );
      } finally {
        setOrganizationLoading(false);
      }
    }

    loadOrganizations();
  }, [isSuperAdmin]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Subject name is required.");

      return;
    }

    if (isSuperAdmin && !organizationId) {
      setError("Please select an organization.");

      return;
    }

    try {
      setLoading(true);

      await createSubject({
        ...(isSuperAdmin && {
          organization_id: Number(organizationId),
        }),

        name: name.trim(),

        code: code.trim() || undefined,

        description: description.trim() || undefined,
      });

      router.push("/subject");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create subject",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Subject</h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a new examination subject
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
      >
        {/* Organization */}

        {isSuperAdmin && (
          <div>
            <label
              htmlFor="organization"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Organization
              <span className="ml-1 text-red-500">*</span>
            </label>

            <select
              id="organization"
              value={organizationId}
              onChange={(event) => setOrganizationId(event.target.value)}
              disabled={organizationLoading}
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200 disabled:bg-gray-100"
            >
              <option value="">
                {organizationLoading
                  ? "Loading organizations..."
                  : "Select organization"}
              </option>

              {organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name}
                  {organization.code ? ` (${organization.code})` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Name */}

        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Subject Name
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Mathematics"
            className="min-h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* Code */}

        <div>
          <label
            htmlFor="code"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Code
          </label>

          <input
            id="code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="e.g. MATH"
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

        {/* Error */}

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Actions */}

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
            disabled={loading || organizationLoading}
            className="min-h-11 rounded-lg bg-gray-900 px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Subject"}
          </button>
        </div>
      </form>
    </div>
  );
}
