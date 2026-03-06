// ============================================================
// DatePicker.tsx  — Arabic date picker with month/year grid selection
// Value format: "YYYY-MM-DD"
// ============================================================
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

interface DatePickerProps {
  value: string;
  onChange: (v: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
}

const MONTHS_AR = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
];
const DAYS_AR = ["أح","إث","ثل","أر","خم","جم","سب"];

const DROPDOWN_HEIGHT = 360;

type View = "days" | "months" | "years";

function parseDate(v: string): Date | null {
  if (!v) return null;
  const [y, m, d] = v.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function toStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDisplay(v: string): string {
  const d = parseDate(v);
  if (!d) return "";
  return `${d.getDate()} ${MONTHS_AR[d.getMonth()]} ${d.getFullYear()}`;
}

// Generate a range of years centered around a given year
function getYearRange(center: number): number[] {
  const start = Math.floor((center - 1) / 12) * 12 + 1;
  return Array.from({ length: 12 }, (_, i) => start + i);
}

export default function DatePicker({
  value, onChange, error, label, placeholder = "اختر التاريخ",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("days");
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0, openUpward: false });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropRef    = useRef<HTMLDivElement>(null);

  const initial = parseDate(value) ?? new Date();
  const [cursor, setCursor] = useState<Date>(
    new Date(initial.getFullYear(), initial.getMonth(), 1),
  );
  const [yearRangeStart, setYearRangeStart] = useState<number>(
    Math.floor((initial.getFullYear() - 1) / 12) * 12 + 1,
  );

  useEffect(() => {
    const d = parseDate(value);
    if (d) {
      setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
      setYearRangeStart(Math.floor((d.getFullYear() - 1) / 12) * 12 + 1);
    }
  }, [value]);

  // Reset to days view when closing
  useEffect(() => {
    if (!open) {
      setTimeout(() => setView("days"), 200);
    }
  }, [open]);

  const recalcPos = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUpward = spaceBelow < DROPDOWN_HEIGHT && spaceAbove > spaceBelow;
    setDropPos({
      top:       openUpward ? rect.top - DROPDOWN_HEIGHT - 6 : rect.bottom + 6,
      left:      rect.left,
      width:     rect.width,
      openUpward,
    });
  }, []);

  useEffect(() => {
    if (open) recalcPos();
  }, [open, recalcPos]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        dropRef.current?.contains(e.target as Node)
      ) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const selected  = parseDate(value);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const year  = cursor.getFullYear();
  const month = cursor.getMonth();

  // ── Days view helpers ──────────────────────────────────────
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const pick = (day: number) => {
    onChange(toStr(new Date(year, month, day)));
    setOpen(false);
  };

  const goToday = () => {
    const t = new Date();
    onChange(toStr(t));
    setCursor(new Date(t.getFullYear(), t.getMonth(), 1));
    setOpen(false);
  };

  // ── Month select ───────────────────────────────────────────
  const pickMonth = (m: number) => {
    setCursor(new Date(year, m, 1));
    setView("days");
  };

  // ── Year select ────────────────────────────────────────────
  const years = Array.from({ length: 12 }, (_, i) => yearRangeStart + i);

  const pickYear = (y: number) => {
    setCursor(new Date(y, month, 1));
    setYearRangeStart(Math.floor((y - 1) / 12) * 12 + 1);
    setView("months");
  };

  // ── Header label & click behaviour ────────────────────────
  const headerLabel =
    view === "years"
      ? `${years[0]} — ${years[years.length - 1]}`
      : view === "months"
      ? `${year}`
      : `${MONTHS_AR[month]} ${year}`;

  const handleHeaderClick = () => {
    if (view === "days")   setView("months");
    else if (view === "months") setView("years");
    // years → nothing (already deepest)
  };

  const handleBack = () => {
    if (view === "months") setView("days");
    else if (view === "years") setView("months");
  };

  // ── Prev / Next for each view ──────────────────────────────
  const handlePrev = () => {
    if (view === "days")   setCursor(new Date(year, month - 1, 1));
    else if (view === "months") setCursor(new Date(year - 1, month, 1));
    else setYearRangeStart((s) => s - 12);
  };

  const handleNext = () => {
    if (view === "days")   setCursor(new Date(year, month + 1, 1));
    else if (view === "months") setCursor(new Date(year + 1, month, 1));
    else setYearRangeStart((s) => s + 12);
  };

  const dropdown = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dropRef}
          key="dp-dropdown"
          initial={{ opacity: 0, y: dropPos.openUpward ? 6 : -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{   opacity: 0, y: dropPos.openUpward ? 6 : -6, scale: 0.97 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "fixed",
            top:      dropPos.top,
            left:     dropPos.left,
            width:    Math.max(dropPos.width, 280),
            zIndex:   99999,
          }}
          className="bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl shadow-black/70 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            {/* Left: next (RTL) */}
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Center: clickable label */}
            <button
              type="button"
              onClick={handleHeaderClick}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-150
                text-sm font-semibold
                ${view === "years"
                  ? "text-gray-400 cursor-default"
                  : "text-white hover:bg-white/10 hover:text-orange-300"
                }`}
            >
              {headerLabel}
              {view !== "years" && (
                <ChevronUp
                  className={`w-3.5 h-3.5 text-orange-400 transition-transform duration-200
                    ${view === "months" ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {/* Right: prev (RTL) */}
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* ── Back breadcrumb (months / years view) ── */}
          <AnimatePresence>
            {view !== "days" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="border-b border-white/10"
              >
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <ChevronLeft className="w-3 h-3" />
                  {view === "months" ? "اختر الشهر" : "اختر السنة"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Body ── */}
          <AnimatePresence mode="wait">

            {/* DAYS */}
            {view === "days" && (
              <motion.div
                key="days"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
              >
                {/* Day headers */}
                <div className="grid grid-cols-7 px-3 pt-3 pb-1">
                  {DAYS_AR.map((d) => (
                    <div key={d} className="text-center text-xs text-gray-500 font-medium py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 px-3 pb-3 gap-y-1">
                  {cells.map((day, i) => {
                    if (!day) return <div key={`e-${i}`} />;
                    const thisDate = new Date(year, month, day);
                    thisDate.setHours(0, 0, 0, 0);
                    const isSel   = selected && toStr(selected) === toStr(thisDate);
                    const isToday = toStr(todayDate) === toStr(thisDate);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => pick(day)}
                        className={`
                          flex items-center justify-center h-8 w-full rounded-lg text-sm
                          transition-all duration-150 font-medium
                          ${isSel
                            ? "bg-gradient-to-b from-[#F97316] to-[#EA580C] text-white shadow-lg shadow-orange-500/30"
                            : isToday
                              ? "bg-white/10 text-orange-400 ring-1 ring-orange-500/40"
                              : "text-gray-300 hover:bg-white/10 hover:text-white"
                          }
                        `}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* Today shortcut */}
                <div className="border-t border-white/10 px-4 py-2.5">
                  <button
                    type="button"
                    onClick={goToday}
                    className="w-full text-center text-xs text-orange-400 hover:text-orange-300 transition-colors font-medium py-1"
                  >
                    اليوم — {formatDisplay(toStr(todayDate))}
                  </button>
                </div>
              </motion.div>
            )}

            {/* MONTHS */}
            {view === "months" && (
              <motion.div
                key="months"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-3 gap-2 p-4"
              >
                {MONTHS_AR.map((name, i) => {
                  const isCurrent = selected
                    ? selected.getFullYear() === year && selected.getMonth() === i
                    : false;
                  const isThisMonth =
                    todayDate.getFullYear() === year && todayDate.getMonth() === i;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => pickMonth(i)}
                      className={`
                        py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                        ${isCurrent
                          ? "bg-gradient-to-b from-[#F97316] to-[#EA580C] text-white shadow-lg shadow-orange-500/30"
                          : isThisMonth
                            ? "bg-white/10 text-orange-400 ring-1 ring-orange-500/40"
                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                        }
                      `}
                    >
                      {name}
                    </button>
                  );
                })}
              </motion.div>
            )}

            {/* YEARS */}
            {view === "years" && (
              <motion.div
                key="years"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-3 gap-2 p-4"
              >
                {years.map((y) => {
                  const isCurrent = selected ? selected.getFullYear() === y : false;
                  const isThisYear = todayDate.getFullYear() === y;
                  return (
                    <button
                      key={y}
                      type="button"
                      onClick={() => pickYear(y)}
                      className={`
                        py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                        ${isCurrent
                          ? "bg-gradient-to-b from-[#F97316] to-[#EA580C] text-white shadow-lg shadow-orange-500/30"
                          : isThisYear
                            ? "bg-white/10 text-orange-400 ring-1 ring-orange-500/40"
                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                        }
                      `}
                    >
                      {y}
                    </button>
                  );
                })}
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative">
      {label && <label className="block text-gray-400 text-sm mb-2">{label}</label>}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-3 bg-white/5 border ${
          error ? "border-red-500/60" : open ? "border-orange-500/60" : "border-white/10"
        } rounded-xl px-4 py-3 transition-all duration-200 hover:border-white/20
          focus:outline-none focus:border-orange-500/60`}
      >
        <Calendar className={`w-4 h-4 shrink-0 ${value ? "text-orange-400" : "text-gray-500"}`} />
        <span className={`flex-1 text-sm text-left ${value ? "text-white" : "text-gray-500"}`}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 text-gray-400 shrink-0"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}

      {typeof document !== "undefined" && createPortal(dropdown, document.body)}
    </div>
  );
}
