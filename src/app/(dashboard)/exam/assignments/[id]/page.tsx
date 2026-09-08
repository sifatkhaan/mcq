"use client";

import { useEffect, useMemo, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import {
  getExam,
  getExamAssignments,
  getAvailableStudents,
  assignStudentToExam,
} from "@/lib/api/exams";

import type { Exam, ExamAssignment, AvailableStudent } from "@/lib/api/exams";
import Button from "../../../../../../components/button/Button";

export default function ExamAssignmentsPage() {
  const params = useParams();

  const router = useRouter();

  const examId = Number(params.id);

  // =========================================================
  // EXAM
  // =========================================================

  const [exam, setExam] = useState<Exam | null>(null);

  // =========================================================
  // ASSIGNED STUDENTS
  // =========================================================

  const [assignments, setAssignments] = useState<ExamAssignment[]>([]);

  // =========================================================
  // AVAILABLE STUDENTS
  // =========================================================

  const [students, setStudents] = useState<AvailableStudent[]>([]);

  // =========================================================
  // SEARCH
  // =========================================================

  const [search, setSearch] = useState("");

  // =========================================================
  // LOADING
  // =========================================================

  const [loading, setLoading] = useState(true);

  const [studentsLoading, setStudentsLoading] = useState(false);

  const [assigningStudentId, setAssigningStudentId] = useState<number | null>(
    null,
  );

  // =========================================================
  // ERROR
  // =========================================================

  const [error, setError] = useState("");

  // =========================================================
  // LOAD EXAM + ASSIGNMENTS + AVAILABLE STUDENTS
  // =========================================================

  useEffect(() => {
    if (!examId) {
      return;
    }

    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);

        setError("");

        const [examResult, assignmentsResult, studentsResult] =
          await Promise.all([
            getExam(examId),
            getExamAssignments(examId),
            getAvailableStudents(examId),
          ]);

        if (cancelled) {
          return;
        }

        setExam(examResult);

        setAssignments(assignmentsResult);

        setStudents(studentsResult);
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load exam assignments.",
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
  }, [examId]);

  // =========================================================
  // FILTER STUDENTS
  // =========================================================

  const filteredStudents = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return students;
    }

    return students.filter(
      (student) =>
        student.username.toLowerCase().includes(value) ||
        student.email.toLowerCase().includes(value),
    );
  }, [students, search]);

  // =========================================================
  // ASSIGN STUDENT
  // =========================================================

  async function handleAssign(studentId: number) {
    try {
      setAssigningStudentId(studentId);

      setError("");

      const assignment = await assignStudentToExam(examId, studentId);

      // Add to assigned list

      setAssignments((current) => [...current, assignment]);

      // Remove from available list

      setStudents((current) =>
        current.filter((student) => student.id !== studentId),
      );

      // Clear search if needed

      setSearch("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to assign student.",
      );
    } finally {
      setAssigningStudentId(null);
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl p-1">
        <div className="animate-pulse space-y-5">
          <div className="h-7 w-48 rounded bg-gray-200" />

          <div className="h-4 w-64 rounded bg-gray-200" />

          <div className="h-32 rounded-2xl bg-gray-100" />

          <div className="h-40 rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Exam #{examId}</p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Student Assignments
          </h1>

          {exam && <p className="mt-2 text-sm text-gray-500">{exam.title}</p>}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/exam/view/${examId}`)}
          >
            Back to Exam
          </Button>
        </div>
      </div>

      {/* ================================================== */}
      {/* ERROR */}
      {/* ================================================== */}

      {error && (
        <div className="mt-6 flex items-start justify-between gap-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0 text-red-400 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* ================================================== */}
      {/* ASSIGNED STUDENTS */}
      {/* ================================================== */}

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Assigned Students
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {assignments?.length} student
              {assignments?.length !== 1 ? "s" : ""} assigned to this exam
            </p>
          </div>
        </div>

        {assignments?.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              👤
            </div>

            <p className="mt-3 text-sm font-medium text-gray-700">
              No students assigned yet
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Select a student below to assign them to this exam.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="divide-y divide-gray-100">
              {assignments?.map((assignment) => (
                <div key={assignment?.assignment_id} className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    {/* AVATAR */}

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                      {assignment?.student_username?.charAt(0)?.toUpperCase()}
                    </div>

                    {/* DETAILS */}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {assignment?.student_username}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {assignment?.student_email}
                      </p>
                    </div>

                    {/* STATUS */}

                    <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                      {assignment?.status}
                    </span>
                  </div>

                  {/* ASSIGNMENT INFO */}

                  <div className="mt-3 ml-[52px] flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-400">
                    <span>
                      Assigned:{" "}
                      {new Date(assignment?.assigned_at).toLocaleDateString()}
                    </span>

                    {assignment?.completed_at && (
                      <span>
                        Completed:{" "}
                        {new Date(
                          assignment?.completed_at,
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ================================================== */}
      {/* AVAILABLE STUDENTS */}
      {/* ================================================== */}

      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Assign Students
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Only active students who are not already assigned are shown.
          </p>
        </div>

        {/* SEARCH */}

        <div className="relative mt-5">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search student by name or email..."
            className="min-h-11 w-full rounded-xl border border-gray-300 bg-white px-4 pr-10 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* AVAILABLE COUNT */}

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">
            Available Students
          </p>

          <p className="text-xs text-gray-500">
            {filteredStudents.length} available
          </p>
        </div>

        {/* STUDENT LIST */}

        <div className="mt-3">
          {studentsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200" />

                    <div className="flex-1">
                      <div className="h-3 w-32 rounded bg-gray-200" />

                      <div className="mt-2 h-3 w-48 rounded bg-gray-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <p className="text-sm font-medium text-gray-700">
                {search
                  ? "No matching students found"
                  : "No available students"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {search
                  ? "Try another name or email."
                  : "All active students may already be assigned."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map((student) => {
                const assigning = assigningStudentId === student.id;

                return (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 transition hover:border-gray-300 hover:bg-gray-50"
                  >
                    {/* AVATAR */}

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                      {student.username.charAt(0).toUpperCase()}
                    </div>

                    {/* DETAILS */}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {student.username}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {student.email}
                      </p>
                    </div>

                    {/* ASSIGN */}

                    <Button
                      size="sm"
                      loading={assigning}
                      loadingText="Assigning..."
                      disabled={assigningStudentId !== null}
                      onClick={() => handleAssign(student.id)}
                    >
                      Assign
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
