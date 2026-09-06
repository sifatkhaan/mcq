"use client";

import { useState } from "react";
import { mcqSets } from "../mcq-data";

const optionLetters = ["a", "b", "c", "d"] as const;

export default function Dashboard() {
  const [activeSet, setActiveSet] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const handleSelect = (
    setIndex: number,
    questionIndex: number,
    optionIndex: number,
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [`${setIndex}-${questionIndex}`]: optionIndex,
    }));
  };

  const currentSet = mcqSets[activeSet];
  return (
    <div className="flex flex-1 flex-col items-center px-4 py-10 font-sans ">
      <div className="w-full max-w-2xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          MCQ Practice
        </h1>

        <div className="mb-8 flex justify-center gap-2">
          {mcqSets.map((set, index) => (
            <button
              key={set.title}
              type="button"
              onClick={() => setActiveSet(index)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeSet === index
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {set.title}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          {currentSet.questions.map((q, qIndex) => {
            const groupName = `set-${activeSet}-question-${qIndex}`;
            const selected = answers[`${activeSet}-${qIndex}`];

            return (
              <div
                key={groupName}
                className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="mb-4 font-medium text-zinc-900 dark:text-zinc-100">
                  {qIndex + 1}. {q.question}
                </p>
                <div className="flex flex-col gap-2">
                  {q.options.map((option, oIndex) => (
                    <label
                      key={oIndex}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <input
                        type="radio"
                        name={groupName}
                        checked={selected === oIndex}
                        onChange={() => handleSelect(activeSet, qIndex, oIndex)}
                        className="peer sr-only"
                      />
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-zinc-300 text-base font-semibold text-zinc-600 transition-colors peer-checked:border-zinc-900 peer-checked:bg-zinc-900 peer-checked:text-white dark:border-zinc-600 dark:text-zinc-300 dark:peer-checked:border-zinc-100 dark:peer-checked:bg-zinc-100 dark:peer-checked:text-zinc-900">
                        {optionLetters[oIndex]}
                      </span>
                      <span className="text-zinc-700 dark:text-zinc-300">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
