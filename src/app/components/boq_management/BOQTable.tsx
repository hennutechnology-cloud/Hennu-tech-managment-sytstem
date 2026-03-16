// ============================================================
// BOQTable.tsx — Responsive (updated with progress support)
// Mobile  (<md):  card-per-item layout stacked vertically
// Tablet  (md):   condensed table
// Desktop (lg+):  full table with all columns
// ============================================================
import { motion, AnimatePresence }    from "motion/react";
import {
  ChevronDown, ChevronRight, ChevronLeft,
  Edit, Trash2, TrendingUp, TrendingDown, BarChart2,
} from "lucide-react";
import GlassCard from "../../core/shared/components/GlassCard";
import {
  tBOQMgt, formatCurrency, formatNum,
  resolveUnit, resolveMonth,
  varianceBgClass, progressColor, progressTextColor,
} from "../../core/i18n/boqManagement.i18n";
import type { BOQTableProps, BOQItem, BOQSection, BOQItemProgress } from "../../core/models/BOQManagement.types";
import type { Lang } from "../../core/models/Settings.types";

// ── helpers ───────────────────────────────────────────────────
const flip = (lang: Lang, ltr: string, rtl: string) => lang === "ar" ? rtl : ltr;

// ── Mini progress bar (used inside cards and table rows) ──────
function MiniProgressBar({ progress, lang }: { progress?: BOQItemProgress; lang: Lang }) {
  const pct = progress?.percentComplete ?? 0;
  return (
    <div className="space-y-1">
      <div className={`flex items-center justify-between text-[10px] ${flip(lang, "", "flex-row-reverse")}`}>
        <span className="text-gray-500">{tBOQMgt(lang, "colProgress")}</span>
        <span className={`font-semibold ${progressTextColor(pct)}`}>{pct.toFixed(0)}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${progressColor(pct)}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// ── Mobile Item Card ──────────────────────────────────────────
function ItemCard({
  item, showComparison, progress, onEdit, onDelete, onProgress, lang,
}: {
  item:           BOQItem;
  showComparison: boolean;
  progress?:      BOQItemProgress;
  onEdit:         (item: BOQItem) => void;
  onDelete:       (item: BOQItem) => void;
  onProgress:     (item: BOQItem) => void;
  lang:           Lang;
}) {
  const isRtl = lang === "ar";

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15 }}
      className="rounded-xl bg-white/[0.04] border border-white/10 p-4 flex flex-col gap-3"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header: code + actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white/30 shrink-0" />
          <span dir="ltr" className="font-mono text-xs text-gray-400">{item.code}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onProgress(item)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            title={tBOQMgt(lang, "progressBtn")}
          >
            <BarChart2 className="w-3.5 h-3.5 text-orange-400" />
          </button>
          <button onClick={() => onEdit(item)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <Edit className="w-3.5 h-3.5 text-blue-400" />
          </button>
          <button onClick={() => onDelete(item)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className={`text-sm text-white font-medium leading-snug ${flip(lang, "text-left", "text-right")}`}>
        {item.description}
      </p>

      {/* Progress bar */}
      <MiniProgressBar progress={progress} lang={lang} />

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/[0.04] rounded-lg px-3 py-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">{tBOQMgt(lang, "colUnit")}</p>
          <p className="text-xs text-gray-300 font-medium">{resolveUnit(lang, item.unit)}</p>
        </div>
        <div className="bg-white/[0.04] rounded-lg px-3 py-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">{tBOQMgt(lang, "colQuantity")}</p>
          <p className="text-xs text-white font-medium">{formatNum(item.quantity, lang)}</p>
        </div>
        <div className="bg-white/[0.04] rounded-lg px-3 py-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">{tBOQMgt(lang, "colUnitPrice")}</p>
          <p className="text-xs text-white font-medium">
            {formatNum(item.unitPrice, lang)}
            <span className="text-gray-500 text-[10px] ml-1">{tBOQMgt(lang, "currency")}</span>
          </p>
        </div>
        <div className="bg-white/[0.04] rounded-lg px-3 py-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">{tBOQMgt(lang, "colMonth")}</p>
          <p className="text-xs text-gray-300 font-medium">{resolveMonth(lang, item.month)}</p>
        </div>
      </div>

      {/* Estimated total */}
      <div className={`flex items-center justify-between border-t border-white/8 pt-3`}>
        <span className="text-xs text-gray-500">{tBOQMgt(lang, "colEstimated")}</span>
        <span className="text-sm font-semibold text-white">{formatCurrency(item.totalCost, lang)}</span>
      </div>

      {/* Comparison row */}
      {showComparison && (
        <div className="flex items-center justify-between border-t border-white/8 pt-2 gap-3">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">{tBOQMgt(lang, "colActual")}</p>
            <p className="text-sm font-semibold text-white">{formatCurrency(item.actualCost, lang)}</p>
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${varianceBgClass(item.variance)}`}>
            {item.variance > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {item.variance > 0 ? "+" : ""}{item.variance.toFixed(2)}%
          </span>
        </div>
      )}

      {/* Progress button */}
      <button
        onClick={() => onProgress(item)}
        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl
                     border border-orange-500/25 bg-orange-500/8 text-orange-400 text-xs font-medium
                     hover:bg-orange-500/15 transition-colors
                     ${isRtl ? "flex-row-reverse" : ""}`}
      >
        <BarChart2 className="w-3.5 h-3.5" />
        {tBOQMgt(lang, "progressBtn")}
      </button>
    </motion.div>
  );
}

// ── Mobile Section Block ──────────────────────────────────────
function SectionBlock({
  section, expanded, onToggle, showComparison, progressMap, onEdit, onDelete, onProgress, lang,
}: {
  section:     BOQSection;
  expanded:    boolean;
  onToggle:    () => void;
  showComparison: boolean;
  progressMap: Record<string, BOQItemProgress>;
  onEdit:      (item: BOQItem) => void;
  onDelete:    (item: BOQItem) => void;
  onProgress:  (item: BOQItem) => void;
  lang:        Lang;
}) {
  const isRtl = lang === "ar";
  const CollapsedChevron = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 w-full bg-white/[0.06] hover:bg-white/[0.09] transition-colors rounded-xl px-4 py-3 ${isRtl ? "flex-row-reverse" : ""}`}
      >
        <span className="text-sky-400 shrink-0">
          {expanded ? <ChevronDown className="w-4 h-4" /> : <CollapsedChevron className="w-4 h-4" />}
        </span>
        <div className="w-2 h-2 rounded-full bg-sky-400/80 ring-2 ring-sky-400/20 shrink-0" />
        <span className="font-mono text-sm text-sky-300/90 shrink-0">{section.code}</span>
        <span className={`font-semibold text-white text-sm flex-1 ${flip(lang, "text-left", "text-right")}`}>
          {section.name}
        </span>
        <span className="text-xs text-gray-500 bg-white/5 px-1.5 py-0.5 rounded-full shrink-0">
          {section.items.length}
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={`flex flex-col gap-2 ${isRtl ? "pr-4" : "pl-4"}`}
          >
            {section.items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                showComparison={showComparison}
                progress={progressMap[item.id]}
                onEdit={onEdit}
                onDelete={onDelete}
                onProgress={onProgress}
                lang={lang}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Table Section Row (md+) ───────────────────────────────────
function SectionRow({
  section, expanded, onToggle, colSpan, lang,
}: {
  section: BOQSection; expanded: boolean; onToggle: () => void; colSpan: number; lang: Lang;
}) {
  const isRtl = lang === "ar";
  const CollapsedChevron = isRtl ? ChevronLeft : ChevronRight;
  return (
    <motion.tr
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onToggle}
      className="bg-white/[0.04] hover:bg-white/[0.07] cursor-pointer transition-colors border-b border-white/10 group"
    >
      <td className="py-3 px-4 whitespace-nowrap">
        <div className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
          <button className="p-1 rounded-md hover:bg-white/10 text-sky-400 transition-colors shrink-0">
            {expanded ? <ChevronDown className="w-4 h-4" /> : <CollapsedChevron className="w-4 h-4" />}
          </button>
          <div className="w-2 h-2 rounded-full bg-sky-400/80 ring-2 ring-sky-400/20 shrink-0" />
          <span className="font-mono text-sm text-sky-300/90">{section.code}</span>
        </div>
      </td>
      <td colSpan={colSpan} className={`py-3 px-4 font-semibold text-white text-[15px] ${flip(lang, "text-left", "text-right")}`}>
        <div className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
          {section.name}
          <span className="text-xs text-gray-500 bg-white/5 px-1.5 py-0.5 rounded-full font-normal">
            {section.items.length} {tBOQMgt(lang, "colDescription")}
          </span>
        </div>
      </td>
    </motion.tr>
  );
}

// ── Table Item Row (md+) ──────────────────────────────────────
function ItemRow({
  item, isLast, showComparison, progress, onEdit, onDelete, onProgress, lang,
}: {
  item:           BOQItem;
  isLast:         boolean;
  showComparison: boolean;
  progress?:      BOQItemProgress;
  onEdit:         (item: BOQItem) => void;
  onDelete:       (item: BOQItem) => void;
  onProgress:     (item: BOQItem) => void;
  lang:           Lang;
}) {
  const isRtl = lang === "ar";
  const pct = progress?.percentComplete ?? 0;

  return (
    <motion.tr
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
    >
      {/* Code */}
      <td className="py-3 px-4 whitespace-nowrap">
        <div className={`flex items-center ${isRtl ? "flex-row-reverse" : ""}`}>
          <div className="w-5 shrink-0 flex justify-center relative" style={{ marginInlineStart: "20px" }}>
            <div className="w-px bg-white/15 absolute top-0" style={{ height: isLast ? "50%" : "100%" }} />
            <div className="h-px bg-white/15 absolute" style={{ width: "10px", [isRtl ? "left" : "right"]: 0, top: "50%" }} />
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/25 shrink-0 mx-2" />
          <span dir="ltr" className="font-mono text-sm text-gray-400">{item.code}</span>
        </div>
      </td>

      {/* Description */}
      <td className={`py-3 px-4 text-sm text-gray-300 ${flip(lang, "text-left", "text-right")}`}>
        {item.description}
      </td>

      {/* Unit — desktop only */}
      <td className="hidden lg:table-cell py-3 px-4 text-sm text-gray-400 text-center whitespace-nowrap">
        {resolveUnit(lang, item.unit)}
      </td>

      {/* Quantity */}
      <td className={`py-3 px-4 text-sm text-white ${flip(lang, "text-right", "text-left")}`}>
        {formatNum(item.quantity, lang)}
      </td>

      {/* Unit price — desktop only */}
      <td className={`hidden lg:table-cell py-3 px-4 text-sm text-white whitespace-nowrap ${flip(lang, "text-right", "text-left")}`}>
        {formatNum(item.unitPrice, lang)}
        <span className={`text-gray-500 text-xs ${flip(lang, "ml-1", "mr-1")}`}>{tBOQMgt(lang, "currency")}</span>
      </td>

      {/* Estimated total */}
      <td className={`py-3 px-4 text-sm font-semibold text-white whitespace-nowrap ${flip(lang, "text-right", "text-left")}`}>
        {formatCurrency(item.totalCost, lang)}
      </td>

      {/* Month — desktop only */}
      <td className="hidden lg:table-cell py-3 px-4 text-sm text-gray-400 text-center whitespace-nowrap">
        {resolveMonth(lang, item.month)}
      </td>

      {/* Progress mini bar */}
      <td className="py-3 px-4 min-w-[100px]">
        <div className="space-y-1">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden w-full">
            <motion.div
              className={`h-full rounded-full ${progressColor(pct)}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(pct, 100)}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <p className={`text-[10px] font-semibold ${progressTextColor(pct)}`}>{pct.toFixed(0)}%</p>
        </div>
      </td>

      {/* Actual + variance */}
      {showComparison && (
        <>
          <td className={`py-3 px-4 text-sm font-semibold text-white whitespace-nowrap ${flip(lang, "text-right", "text-left")}`}>
            {formatCurrency(item.actualCost, lang)}
          </td>
          <td className="py-3 px-4 text-center">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${varianceBgClass(item.variance)}`}>
              {item.variance > 0 ? "+" : ""}{item.variance.toFixed(2)}%
            </span>
          </td>
        </>
      )}

      {/* Actions */}
      <td className="py-3 px-4">
        <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${flip(lang, "justify-end", "justify-start")}`}>
          <button
            onClick={() => onProgress(item)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title={tBOQMgt(lang, "progressBtn")}
          >
            <BarChart2 className="w-4 h-4 text-orange-400" />
          </button>
          <button onClick={() => onEdit(item)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Edit className="w-4 h-4 text-blue-400" />
          </button>
          <button onClick={() => onDelete(item)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

// ── Exported table ────────────────────────────────────────────
export default function BOQTable({
  sections, viewMode, expandedSections,
  onToggleSection, onEdit, onDelete, onProgress, progressMap, lang,
}: BOQTableProps) {
  const isRtl          = lang === "ar";
  const showComparison = viewMode === "comparison";
  const thAlign        = flip(lang, "text-left", "text-right");

  const allItems       = sections.flatMap((s) => s.items);
  const grandEstimated = allItems.reduce((a, i) => a + i.totalCost, 0);
  const grandActual    = allItems.reduce((a, i) => a + i.actualCost, 0);

  const extraColSpan      = showComparison ? 2 : 0;
  const lgSectionNameSpan = 7 + extraColSpan; // +1 for progress col

  return (
    <GlassCard className="overflow-hidden">
      {/* ── MOBILE CARD VIEW (< md) ── */}
      <div className="md:hidden p-3 flex flex-col gap-3" dir={isRtl ? "rtl" : "ltr"}>
        {sections.map((section) => (
          <SectionBlock
            key={section.code}
            section={section}
            expanded={expandedSections.has(section.code)}
            onToggle={() => onToggleSection(section.code)}
            showComparison={showComparison}
            progressMap={progressMap}
            onEdit={onEdit}
            onDelete={onDelete}
            onProgress={onProgress}
            lang={lang}
          />
        ))}

        {/* Mobile Grand Total */}
        <div className={`flex items-center justify-between bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 mt-1 ${isRtl ? "flex-row-reverse" : ""}`}>
          <span className="text-sm font-bold text-white">{tBOQMgt(lang, "tableTotal")}</span>
          <div className={`flex flex-col items-end gap-1 ${isRtl ? "items-start" : ""}`}>
            <span className="text-sm font-bold text-white">{formatCurrency(grandEstimated, lang)}</span>
            {showComparison && (() => {
              const v = ((grandActual / grandEstimated) - 1) * 100;
              return (
                <div className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <span className="text-xs text-gray-400">{formatCurrency(grandActual, lang)}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${varianceBgClass(v)}`}>
                    {v > 0 ? "+" : ""}{v.toFixed(2)}%
                  </span>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ── TABLE VIEW (md+) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full" dir={isRtl ? "rtl" : "ltr"}>
          <thead>
            <tr className="border-b border-white/10">
              <th className={`py-4 px-4 text-xs font-semibold text-gray-400 whitespace-nowrap ${thAlign}`}>{tBOQMgt(lang, "colCode")}</th>
              <th className={`py-4 px-4 text-xs font-semibold text-gray-400 whitespace-nowrap ${thAlign}`}>{tBOQMgt(lang, "colDescription")}</th>
              <th className="hidden lg:table-cell py-4 px-4 text-xs font-semibold text-gray-400 text-center whitespace-nowrap">{tBOQMgt(lang, "colUnit")}</th>
              <th className={`py-4 px-4 text-xs font-semibold text-gray-400 whitespace-nowrap ${flip(lang, "text-right", "text-left")}`}>{tBOQMgt(lang, "colQuantity")}</th>
              <th className={`hidden lg:table-cell py-4 px-4 text-xs font-semibold text-gray-400 whitespace-nowrap ${flip(lang, "text-right", "text-left")}`}>{tBOQMgt(lang, "colUnitPrice")}</th>
              <th className={`py-4 px-4 text-xs font-semibold text-gray-400 whitespace-nowrap ${flip(lang, "text-right", "text-left")}`}>{tBOQMgt(lang, "colEstimated")}</th>
              <th className="hidden lg:table-cell py-4 px-4 text-xs font-semibold text-gray-400 text-center whitespace-nowrap">{tBOQMgt(lang, "colMonth")}</th>
              <th className={`py-4 px-4 text-xs font-semibold text-gray-400 whitespace-nowrap ${thAlign}`}>{tBOQMgt(lang, "colProgress")}</th>
              {showComparison && (
                <>
                  <th className={`py-4 px-4 text-xs font-semibold text-gray-400 whitespace-nowrap ${flip(lang, "text-right", "text-left")}`}>{tBOQMgt(lang, "colActual")}</th>
                  <th className="py-4 px-4 text-xs font-semibold text-gray-400 text-center whitespace-nowrap">{tBOQMgt(lang, "colVariance")}</th>
                </>
              )}
              <th className={`py-4 px-4 text-xs font-semibold text-gray-400 whitespace-nowrap ${flip(lang, "text-right", "text-left")}`}>{tBOQMgt(lang, "colActions")}</th>
            </tr>
          </thead>

          <tbody>
            {sections.map((section) => {
              const isExpanded = expandedSections.has(section.code);
              return (
                <AnimatePresence key={section.code}>
                  <SectionRow
                    section={section}
                    expanded={isExpanded}
                    onToggle={() => onToggleSection(section.code)}
                    colSpan={lgSectionNameSpan}
                    lang={lang}
                  />
                  {isExpanded && section.items.map((item, idx) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      isLast={idx === section.items.length - 1}
                      showComparison={showComparison}
                      progress={progressMap[item.id]}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onProgress={onProgress}
                      lang={lang}
                    />
                  ))}
                </AnimatePresence>
              );
            })}
          </tbody>

          <tfoot className="border-t-2 border-white/20 bg-white/[0.03]">
            <tr>
              <td colSpan={4} className={`px-4 py-4 font-bold text-white text-sm ${flip(lang, "text-right", "text-left")}`}>
                {tBOQMgt(lang, "tableTotal")}
              </td>
              <td className="hidden lg:table-cell" />
              <td className="hidden lg:table-cell" />
              <td className="hidden lg:table-cell" />
              <td /> {/* progress col */}
              {showComparison && (
                <>
                  <td className={`px-4 py-4 font-bold text-white text-sm whitespace-nowrap ${flip(lang, "text-right", "text-left")}`}>
                    {formatCurrency(grandActual, lang)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {(() => {
                      const v = ((grandActual / grandEstimated) - 1) * 100;
                      return (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${varianceBgClass(v)}`}>
                          {v > 0 ? "+" : ""}{v.toFixed(2)}%
                        </span>
                      );
                    })()}
                  </td>
                </>
              )}
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </GlassCard>
  );
}
