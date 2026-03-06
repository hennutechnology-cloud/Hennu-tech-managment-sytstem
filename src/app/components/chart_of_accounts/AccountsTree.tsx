// ============================================================
// AccountsTree.tsx
// account.name and account.code are plain API strings — rendered directly.
// Type badge labels, column headers, and legend labels go through tCOA().
// Full RTL support: layout, connectors, chevrons, and spacing all flip for AR.
// ============================================================
import { useState } from "react";
import { ChevronDown, ChevronRight, ChevronLeft, Edit, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import GlassCard from "../../core/shared/components/GlassCard";
import { tCOA, resolveTypeBadge, formatNum } from "../../core/i18n/chartOfAccounts.i18n";
import type { Account, AccountsTreeProps } from "../../core/models/ChartOfAccounts.types";
import type { Lang } from "../../core/models/Settings.types";

// ── RTL helpers ────────────────────────────────────────────────────────────
const isRTL = (lang: Lang) => lang === "ar";

/** Returns "rtl" | "ltr" for the dir attribute */
const dir = (lang: Lang) => (isRTL(lang) ? "rtl" : "ltr") as "rtl" | "ltr";

/** Picks ltrClass in LTR, rtlClass in RTL */
const flip = (lang: Lang, ltrClass: string, rtlClass: string) =>
  isRTL(lang) ? rtlClass : ltrClass;

// Legend "Branch" label (not in the shared i18n file — kept local)
const LEGEND_BRANCH: Record<Lang, string> = { en: "Branch", ar: "فرع" };

// ── AccountRow ─────────────────────────────────────────────────────────────
interface AccountRowProps {
  account: Account;
  level?: number;
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
  lang: Lang;
  isLast?: boolean;
  /** Which ancestor levels still have siblings below (drives connector lines) */
  parentLines?: boolean[];
}

function AccountRow({
  account,
  level = 0,
  onEdit,
  onDelete,
  lang,
  isLast = false,
  parentLines = [],
}: AccountRowProps) {
  const [expanded, setExpanded] = useState(level === 0);
  const hasChildren = !!account.children?.length;
  const isRoot = level === 0;
  const rtl = isRTL(lang);
  const badge = resolveTypeBadge(lang, account.type);

  // Collapsed chevron flips in RTL (points toward children)
  const CollapsedChevron = rtl ? ChevronLeft : ChevronRight;

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`border-b border-white/5 transition-colors group ${
          isRoot ? "hover:bg-white/8 bg-white/[0.03]" : "hover:bg-white/5"
        }`}
      >
        {/* ── CODE CELL — tree lines + indentation ── */}
        <td className="py-3 px-4 whitespace-nowrap">
          <div className="flex items-center gap-2">

            {level > 0 && (
              <div
                className="flex items-stretch shrink-0"
                style={{ width: `${level * 20}px` }}
              >
                {/* Vertical continuation lines for each ancestor */}
                {parentLines.map((hasLine, i) => (
                  <div key={i} className="w-5 shrink-0 flex justify-center">
                    {hasLine && <div className="w-px h-full bg-white/15" />}
                  </div>
                ))}

                {/* Elbow / T connector for this node */}
                <div className="w-5 shrink-0 relative flex justify-center">
                  {/* Vertical segment */}
                  <div
                    className="w-px bg-white/15 absolute top-0"
                    style={{ height: isLast ? "50%" : "100%" }}
                  />
                  {/* Horizontal arm — flips in RTL */}
                  <div
                    className="h-px bg-white/15 absolute"
                    style={{
                      width: "10px",
                      [rtl ? "left" : "right"]: 0,
                      top: "50%",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Root dot or child dot */}
            {isRoot ? (
              <div className="w-2 h-2 rounded-full bg-blue-400/80 ring-2 ring-blue-400/20 shrink-0" />
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-white/25 shrink-0" />
            )}

            {/* Expand / collapse */}
            {hasChildren ? (
              <button
                onClick={() => setExpanded((p) => !p)}
                className={`p-1 rounded-md transition-all shrink-0 ${
                  isRoot
                    ? "hover:bg-white/15 text-blue-400"
                    : "hover:bg-white/10 text-gray-400"
                }`}
              >
                {expanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <CollapsedChevron className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <div className="w-5 shrink-0" /> // leaf spacer
            )}

            {/* Account code — always LTR (numeric codes never reverse) */}
            <span
              dir="ltr"
              className={`font-mono text-sm ${
                isRoot ? "text-blue-300/90" : "text-gray-400"
              }`}
            >
              {account.code}
            </span>
          </div>
        </td>

        {/* ── NAME CELL ── */}
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            {isRoot && (
              <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-400/70 bg-blue-400/10 px-1.5 py-0.5 rounded shrink-0">
                {tCOA(lang, "typeMain")}
              </span>
            )}
            <span
              className={`font-medium ${
                isRoot ? "text-white text-[15px]" : "text-gray-300 text-sm"
              }`}
            >
              {account.name}
            </span>
            {hasChildren && (
              <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded-full shrink-0">
                {account.children!.length} {tCOA(lang, "typeSub")}
              </span>
            )}
          </div>
        </td>

        {/* ── TYPE BADGE ── */}
        <td className="py-3 px-4 text-center">
          <span className={`px-3 py-1 rounded-lg border text-sm ${badge.className}`}>
            {badge.label}
          </span>
        </td>

        {/* ── BALANCE — alignment follows reading direction ── */}
        <td
          className={`py-3 px-4 font-medium ${flip(lang, "text-left", "text-right")}`}
        >
          <span className={isRoot ? "text-white" : "text-gray-300 text-sm"}>
            {formatNum(account.balance, lang)}
          </span>
          <span className={`text-gray-500 text-xs ${flip(lang, "ml-1", "mr-1")}`}>
            {tCOA(lang, "currency")}
          </span>
        </td>

        {/* ── ACTIONS — always at the visual trailing edge ── */}
        <td className="py-3 px-4">
          <div
            className={`flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${
              flip(lang, "justify-end", "justify-start")
            }`}
          >
            <button
              onClick={() => onEdit(account)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4 text-blue-400" />
            </button>
            <button
              onClick={() => onDelete(account)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </td>
      </motion.tr>

      {/* Children */}
      <AnimatePresence>
        {expanded &&
          hasChildren &&
          account.children!.map((child, idx) => {
            const childIsLast = idx === account.children!.length - 1;
            const childParentLines = [...parentLines, !isLast];
            return (
              <AccountRow
                key={child.code}
                account={child}
                level={level + 1}
                onEdit={onEdit}
                onDelete={onDelete}
                lang={lang}
                isLast={childIsLast}
                parentLines={childParentLines}
              />
            );
          })}
      </AnimatePresence>
    </>
  );
}

// ── Table ──────────────────────────────────────────────────────────────────
export default function AccountsTree({
  accounts = [],
  onEdit,
  onDelete,
  lang,
}: AccountsTreeProps) {
  return (
    <GlassCard>
      {/* Legend */}
      <div
        dir={dir(lang)}
        className="flex items-center gap-6 px-4 pt-3 pb-2 border-b border-white/5"
      >
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-2 h-2 rounded-full bg-blue-400/80 ring-2 ring-blue-400/20 shrink-0" />
          <span>{tCOA(lang, "typeMain")}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-1.5 h-1.5 rounded-full bg-white/25 shrink-0" />
          <span>{tCOA(lang, "typeSub")}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-3 h-px bg-white/20 shrink-0" />
          <span>{LEGEND_BRANCH[lang]}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        {/*
          dir="rtl" on <table> drives:
            • visual column order reversal
            • default cell text alignment
            • RTL text shaping inside cells
        */}
        <table className="w-full" dir={dir(lang)}>
          <thead>
            <tr className="border-b border-white/10">
              <th className={`py-4 px-4 text-gray-400 font-medium ${flip(lang, "text-left", "text-right")}`}>
                {tCOA(lang, "colCode")}
              </th>
              <th className={`py-4 px-4 text-gray-400 font-medium ${flip(lang, "text-left", "text-right")}`}>
                {tCOA(lang, "colName")}
              </th>
              <th className="py-4 px-4 text-center text-gray-400 font-medium">
                {tCOA(lang, "colType")}
              </th>
              <th className={`py-4 px-4 text-gray-400 font-medium ${flip(lang, "text-left", "text-right")}`}>
                {tCOA(lang, "colBalance")}
              </th>
              <th className={`py-4 px-4 text-gray-400 font-medium ${flip(lang, "text-right", "text-left")}`}>
                {tCOA(lang, "colActions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(accounts) ? accounts : []).map((account, idx) => (
              <AccountRow
                key={account.code}
                account={account}
                onEdit={onEdit}
                onDelete={onDelete}
                lang={lang}
                isLast={idx === accounts.length - 1}
                parentLines={[]}
              />
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
