interface EmptyReportStateProps {
  message: string;
}

export default function EmptyReportState({ message }: EmptyReportStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
