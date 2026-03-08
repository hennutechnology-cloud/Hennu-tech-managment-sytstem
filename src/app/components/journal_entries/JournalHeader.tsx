// ============================================================
// JournalHeader.tsx — Responsive
// ============================================================
import type { JournalHeaderProps } from "../../core/models/JournalEntries.types";
import { tJE } from "../../core/i18n/journalEntries.i18n";

export default function JournalHeader({ lang }: JournalHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
        {tJE(lang, "pageTitle")}
      </h1>
      <p className="text-sm sm:text-base text-gray-400">{tJE(lang, "pageSubtitle")}</p>
    </div>
  );
}
