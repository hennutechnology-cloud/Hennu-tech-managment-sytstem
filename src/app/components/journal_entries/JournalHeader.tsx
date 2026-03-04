import type { JournalHeaderProps } from "../../core/models/JournalEntries.types";

export default function JournalHeader({
  title = "قيود اليومية",
  subtitle = "إضافة وإدارة القيود المحاسبية",
}: JournalHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
      <p className="text-gray-400">{subtitle}</p>
    </div>
  );
}
