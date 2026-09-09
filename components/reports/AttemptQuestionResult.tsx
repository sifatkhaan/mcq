import type { AttemptReportQuestion } from "@/lib/api/attemptReports";

interface AttemptQuestionResultProps {
  question: AttemptReportQuestion;
}

export default function AttemptQuestionResult({
  question,
}: AttemptQuestionResultProps) {
  const correct = question.is_correct;

  const unanswered = !question.answered || !question.selected_option;

  return (
    <div
      className={`rounded-2xl border p-5 ${
        correct
          ? "border-green-200 bg-green-50/40"
          : unanswered
            ? "border-gray-200 bg-gray-50"
            : "border-red-200 bg-red-50/40"
      }`}
    >
      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              correct
                ? "bg-green-100 text-green-700"
                : unanswered
                  ? "bg-gray-200 text-gray-600"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {question.question_order}
          </span>

          <div>
            <p className="text-xs text-gray-500">
              {question.subject.name}
              {" • "}
              {question.chapter.name}
              {" • "}
              {question.topic.name}
            </p>

            <h3 className="mt-1 text-sm font-semibold leading-6 text-gray-900">
              {question.question_text}
            </h3>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
            correct
              ? "bg-green-100 text-green-700"
              : unanswered
                ? "bg-gray-100 text-gray-600"
                : "bg-red-100 text-red-700"
          }`}
        >
          {correct ? "Correct" : unanswered ? "Unanswered" : "Wrong"}
        </span>
      </div>

      {/* OPTIONS */}

      <div className="mt-5 space-y-2">
        {question.options.map((option) => {
          const isSelected = question.selected_option?.id === option.id;

          const isCorrect = question.correct_option?.id === option.id;

          let optionClass = "border-gray-200 bg-white";

          if (isCorrect) {
            optionClass = "border-green-300 bg-green-50";
          } else if (isSelected) {
            optionClass = "border-red-300 bg-red-50";
          }

          return (
            <div
              key={option.id}
              className={`flex items-center justify-between rounded-xl border p-3 ${optionClass}`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                  {String.fromCharCode(64 + option.option_order)}
                </span>

                <span className="text-sm text-gray-800">
                  {option.option_text}
                </span>
              </div>

              <div className="flex shrink-0 gap-2">
                {isSelected && (
                  <span className="text-xs font-medium text-red-600">
                    Your Answer
                  </span>
                )}

                {isCorrect && (
                  <span className="text-xs font-semibold text-green-600">
                    Correct
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SCORE */}

      <div className="mt-4 flex flex-wrap gap-4 border-t border-gray-200 pt-3 text-xs">
        <span className="text-gray-500">
          Marks: <strong className="text-gray-700">{question.marks}</strong>
        </span>

        <span
          className={
            question.marks_awarded >= 0 ? "text-green-600" : "text-red-600"
          }
        >
          Awarded: <strong>{question.marks_awarded}</strong>
        </span>

        {question.negative_marks > 0 && (
          <span className="text-gray-500">
            Negative:{" "}
            <strong className="text-gray-700">{question.negative_marks}</strong>
          </span>
        )}
      </div>

      {/* EXPLANATION */}

      {question.explanation && (
        <div className="mt-4 rounded-xl bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Explanation
          </p>

          <p className="mt-1 text-sm leading-6 text-gray-700">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
