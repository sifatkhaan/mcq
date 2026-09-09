"use client";

import { useEffect, useMemo, useState } from "react";
import { getExams } from "@/lib/api/exams";

import type { Exam } from "@/lib/api/exams";
import EmptyReportState from "../../../../../../components/reports/EmptyReportState";
import ExamReportCard from "../../../../../../components/reports/ExamReportCard";

export default function ExamReportsPage() {
  const [exams, setExams] = useState<Exam[]>([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadExams() {
      try {
        setLoading(true);
        setError("");

        const response = await getExams();

        if (!cancelled) {
          setExams(response);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load exams.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadExams();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredExams = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return exams.filter((exam) => {
      const matchesSearch =
        !searchTerm ||
        exam.title.toLowerCase().includes(searchTerm) ||
        exam.description?.toLowerCase().includes(searchTerm);

      const matchesStatus = status === "ALL" || exam.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [exams, search, status]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-56 rounded bg-gray-200" />

          <div className="h-12 rounded-xl bg-gray-100" />

          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div key={index} className="h-32 rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-900">Exam Reports</h1>

        <p className="mt-1 text-sm text-gray-500">
          View performance reports for your exams.
        </p>
      </div>

      {/* FILTERS */}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search exam..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none focus:border-gray-400"
        >
          <option value="ALL">All Status</option>

          <option value="DRAFT">Draft</option>

          <option value="PUBLISHED">Published</option>

          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* RESULT COUNT */}

      <div className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-800">
          {filteredExams.length}
        </span>{" "}
        of <span className="font-semibold text-gray-800">{exams.length}</span>{" "}
        exams
      </div>

      {/* EXAMS */}

      {filteredExams.length === 0 ? (
        <EmptyReportState
          message={
            exams.length === 0
              ? "No exams found."
              : "No exams match your search or filter."
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredExams.map((exam) => (
            <ExamReportCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  );
}
