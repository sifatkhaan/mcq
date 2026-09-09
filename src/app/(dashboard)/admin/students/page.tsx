"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrganizationStudents } from "@/lib/api/organizations";
import type { OrganizationStudent } from "@/lib/api/organizations";
import EmptyReportState from "../../../../../components/reports/EmptyReportState";
import StudentList from "../../../../../components/students/StudentList";
export default function StudentsPage() {
  const router = useRouter();

  /*
   * Replace this with your actual organization context.
   *
   * Super Admin:
   * selected organization
   *
   * Other users:
   * profile.organization_id
   */
  const organizationId = 2;

  const [students, setStudents] = useState<OrganizationStudent[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadStudents() {
      try {
        setLoading(true);
        setError("");

        const response = await getOrganizationStudents(organizationId);

        if (!cancelled) {
          setStudents(response);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load students.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (Number.isFinite(organizationId)) {
      loadStudents();
    }

    return () => {
      cancelled = true;
    };
  }, [organizationId]);

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return students;
    }

    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term) ||
        student.phone?.toLowerCase().includes(term),
    );
  }, [students, search]);

  function handleView(student: OrganizationStudent) {
    router.push(`/admin/students/${student.id}`);
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-48 rounded bg-gray-200" />

          <div className="h-11 rounded-xl bg-gray-100" />

          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div key={index} className="h-24 rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-2xl bg-red-50 p-6 text-center text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage students in the selected organization.
        </p>
      </div>

      {/* SEARCH */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email or phone..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        <p className="text-sm text-gray-500">
          {filteredStudents.length} student
          {filteredStudents.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* LIST */}

      {filteredStudents.length === 0 ? (
        <EmptyReportState
          message={
            students.length === 0
              ? "No students found."
              : "No students match your search."
          }
        />
      ) : (
        <StudentList students={filteredStudents} onView={handleView} />
      )}
    </div>
  );
}
