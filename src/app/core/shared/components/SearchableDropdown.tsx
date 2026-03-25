// ============================================================
// SearchableDropdown.tsx
// Supports two modes:
//
//   STATIC  — pass `options[]`  → filters in memory (< ~200 items)
//   ASYNC   — pass `onSearch`   → calls your service on each keystroke
//             with debounce, loading skeleton, and paginated results
//
// Usage examples at the bottom of this file.
// ============================================================
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence }                   from "motion/react";
import { Search, ChevronDown, Check, AlertCircle, Loader2 } from "lucide-react";

// ── Public types ──────────────────────────────────────────────

export interface DropdownOption {
  id:    string;
  label: string;   // primary text
  sub?:  string;   // secondary / subtitle text
  icon?: React.ReactNode;
}

/** Shared props for both modes */
interface BaseProps {
  value:              string;
  onChange:           (id: string, label: string) => void;
  placeholder?:       string;
  searchPlaceholder?: string;
  emptyText?:         string;
  error?:             string;
  lang:               string;
  disabled?:          boolean;
  accentColor?:       "orange" | "blue" | "violet" | "emerald";
}

/** Static mode — you own the full list */
interface StaticProps extends BaseProps {
  options:   DropdownOption[];
  onSearch?: never;
}

/**
 * Async mode — component calls `onSearch(query)` after debounce.
 * Your service should return the first N (e.g. 10-20) matches.
 * The component renders exactly what the service returns — no
 * extra client-side filtering is applied.
 */
interface AsyncProps extends BaseProps {
  options?:    never;
  /**
   * Called with the current search string (empty string on first open).
   * Should return a ranked/limited slice from your service.
   * Example: `(q) => subcontractorService.search(q, { limit: 15 })`
   */
  onSearch:    (query: string) => Promise<DropdownOption[]>;
  /** Debounce delay in ms — default 300 */
  debounceMs?: number;
}

type SearchableDropdownProps = StaticProps | AsyncProps;

// ── Accent colour map ─────────────────────────────────────────

const ACCENT = {
  orange:  { border: "border-orange-500/60",  selBg: "bg-orange-500/10",  selText: "text-orange-300",  check: "text-orange-400",  icon: "text-orange-400"  },
  blue:    { border: "border-blue-500/60",    selBg: "bg-blue-500/10",    selText: "text-blue-300",    check: "text-blue-400",    icon: "text-blue-400"    },
  violet:  { border: "border-violet-500/60",  selBg: "bg-violet-500/10",  selText: "text-violet-300",  check: "text-violet-400",  icon: "text-violet-400"  },
  emerald: { border: "border-emerald-500/60", selBg: "bg-emerald-500/10", selText: "text-emerald-300", check: "text-emerald-400", icon: "text-emerald-400" },
} as const;

// ── Component ─────────────────────────────────────────────────

export default function SearchableDropdown(props: SearchableDropdownProps) {
  const {
    value,
    onChange,
    placeholder       = "Select…",
    searchPlaceholder,
    emptyText         = "No results",
    error,
    lang,
    disabled          = false,
    accentColor       = "orange",
  } = props;

  const isRtl   = lang === "ar";
  const accent  = ACCENT[accentColor];
  const isAsync = "onSearch" in props && typeof props.onSearch === "function";
  const debMs   = isAsync ? ((props as AsyncProps).debounceMs ?? 300) : 0;

  // ── State ─────────────────────────────────────────────────
  const [open,     setOpen]     = useState(false);
  const [search,   setSearch]   = useState("");
  const [results,  setResults]  = useState<DropdownOption[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [selected, setSelected] = useState<DropdownOption | null>(null);

  const containerRef  = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Derive display list ───────────────────────────────────
  // Static mode : filter options in memory
  // Async mode  : use whatever the service returned
  const displayList: DropdownOption[] = isAsync
    ? results
    : ((props as StaticProps).options ?? []).filter((o) => {
        const q = search.toLowerCase();
        return (
          o.label.toLowerCase().includes(q) ||
          (o.sub ?? "").toLowerCase().includes(q)
        );
      });

  // ── Sync selected label from value prop ──────────────────
  // Static mode : derive from options array
  // Async mode  : kept in local state after each selection
  useEffect(() => {
    if (!isAsync) {
      const found = ((props as StaticProps).options ?? []).find(
        (o) => o.id === value,
      );
      setSelected(found ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isAsync, (props as StaticProps).options]);

  // ── Async: fetch when dropdown opens ─────────────────────
  const fetchAsync = useCallback(
    async (query: string) => {
      if (!isAsync) return;
      setLoading(true);
      try {
        const data = await (props as AsyncProps).onSearch(query);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAsync],
  );

  useEffect(() => {
    if (open && isAsync) {
      fetchAsync("");          // initial load — empty query = top N results
    }
    if (!open) {
      setSearch("");
      if (isAsync) setResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── Async: debounce search input ─────────────────────────
  useEffect(() => {
    if (!open || !isAsync) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchAsync(search), debMs);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // ── Close on outside click ────────────────────────────────
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── Select handler ────────────────────────────────────────
  const handleSelect = (opt: DropdownOption) => {
    if (isAsync) setSelected(opt);   // persist label display in async mode
    onChange(opt.id, opt.label);
    setOpen(false);
    setSearch("");
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative">

      {/* Trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`w-full flex items-center gap-2 bg-white/5 border
          ${error   ? "border-red-500/50"
          : open    ? accent.border
          :           "border-white/10"}
          rounded-xl px-3 py-2.5 text-sm transition-all
          ${disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-white/20 cursor-pointer"}
          focus:outline-none ${isRtl ? "flex-row-reverse" : ""}`}
      >
        {selected ? (
          <>
            {selected.icon && (
              <span className={`shrink-0 ${accent.icon}`}>{selected.icon}</span>
            )}
            <span className="flex-1 text-white truncate text-left">
              {selected.label}
            </span>
            {selected.sub && (
              <span className="text-xs text-gray-500 shrink-0 hidden sm:block truncate max-w-[120px]">
                {selected.sub}
              </span>
            )}
          </>
        ) : (
          <>
            <Search className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="flex-1 text-gray-500 text-left">{placeholder}</span>
          </>
        )}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        </motion.div>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0,  scale: 1     }}
            exit={{    opacity: 0, y: -6, scale: 0.98  }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1.5 w-full rounded-xl border border-white/10
                       bg-[#0d0f18] shadow-2xl shadow-black/60 overflow-hidden"
            dir={isRtl ? "rtl" : "ltr"}
          >
            {/* Search input row */}
            <div
              className={`flex items-center gap-2 px-3 py-2.5 border-b border-white/10
                          ${isRtl ? "flex-row-reverse" : ""}`}
            >
              {loading
                ? <Loader2 className="w-3.5 h-3.5 text-gray-500 shrink-0 animate-spin" />
                : <Search  className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              }
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder ?? placeholder}
                className="flex-1 bg-transparent text-sm text-white
                           placeholder-gray-500 outline-none min-w-0"
              />
              {/* Result count badge (async mode only) */}
              {isAsync && !loading && results.length > 0 && (
                <span className="text-[10px] text-gray-600 shrink-0 tabular-nums">
                  {results.length}
                </span>
              )}
            </div>

            {/* Result list */}
            <div className="max-h-52 overflow-y-auto">
              {loading ? (
                /* Skeleton rows while fetching */
                <div className="px-4 py-2 space-y-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 py-2 animate-pulse"
                      style={{ opacity: 1 - i * 0.25 }}
                    >
                      <div className="w-3.5 h-3.5 rounded bg-white/10 shrink-0" />
                      <div className="flex-1 h-3 rounded bg-white/10" />
                      <div className="w-16 h-3 rounded bg-white/10 shrink-0" />
                    </div>
                  ))}
                </div>
              ) : displayList.length === 0 ? (
                <p className="text-center text-xs text-gray-500 py-5">
                  {emptyText}
                </p>
              ) : (
                displayList.map((opt) => {
                  const isSel = opt.id === value;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelect(opt)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5
                                  text-sm transition-colors
                                  ${isSel
                                    ? `${accent.selBg} ${accent.selText}`
                                    : "text-gray-300 hover:bg-white/8"}
                                  ${isRtl ? "flex-row-reverse" : ""}`}
                    >
                      {opt.icon && (
                        <span className={`shrink-0 ${isSel ? accent.check : "text-gray-500"}`}>
                          {opt.icon}
                        </span>
                      )}
                      <span className="flex-1 text-left font-medium truncate">
                        {opt.label}
                      </span>
                      {opt.sub && (
                        <span className="text-xs text-gray-500 shrink-0 hidden sm:block truncate max-w-[120px]">
                          {opt.sub}
                        </span>
                      )}
                      {isSel && (
                        <Check className={`w-3.5 h-3.5 shrink-0 ${accent.check}`} />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer hint — only in async mode */}
            {isAsync && !loading && (
              <div className="px-4 py-2 border-t border-white/6">
                <p className="text-[10px] text-gray-600 text-center">
                  {lang === "ar"
                    ? "اكتب للبحث عن المزيد من النتائج"
                    : "Type to search for more results"}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-400 mt-1.5">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}


// ================================================================
// USAGE EXAMPLES
// ================================================================
//
// ── STATIC MODE (small list already in memory) ───────────────────
//
//   const projectOptions = projects.map(p => ({
//     id:    p.id,
//     label: p.name,
//     sub:   p.code,
//     icon:  <FolderOpen className="w-3.5 h-3.5" />,
//   }));
//
//   <SearchableDropdown
//     options={projectOptions}
//     value={form.projectId}
//     onChange={(id) => sf("projectId", id)}
//     placeholder="Select project"
//     lang={lang}
//     accentColor="orange"
//   />
//
//
// ── ASYNC MODE (1 000+ records — service called on every keystroke) ──
//
//   Step 1 — add a `search` method to your service:
//
//     // subcontractor.service.ts
//     async search(query: string, limit = 15): Promise<DropdownOption[]> {
//       const all = await this.getAll();              // or a real DB query
//       const q   = query.toLowerCase();
//       return all
//         .filter(s =>
//           s.name.toLowerCase().includes(q) ||
//           s.specialty.toLowerCase().includes(q)
//         )
//         .slice(0, limit)
//         .map(s => ({
//           id:    s.id,
//           label: s.name,
//           sub:   s.specialty,
//           icon:  <Building2 className="w-3.5 h-3.5" />,
//         }));
//     }
//
//   Step 2 — wire it to the dropdown:
//
//     <SearchableDropdown
//       onSearch={(q) => subcontractorService.search(q, 15)}
//       value={form.subcontractorId}
//       onChange={(id, label) => {
//         sf("subcontractorId", id);
//         sf("executorName", label);      // auto-fill a dependent field
//       }}
//       placeholder={tBOQMgt(lang, "subcontractorPH")}
//       lang={lang}
//       accentColor="violet"
//       debounceMs={300}
//     />
//
//   What happens at runtime:
//   ┌─────────────────────────────────────────────────────────┐
//   │  dropdown opens  →  onSearch("")  →  top 15 results     │
//   │  user types "ن"  →  wait 300 ms  →  onSearch("ن")       │
//   │  user types "نخ" →  wait 300 ms  →  onSearch("نخ")      │
//   │  ← spinner shown while fetching, skeleton rows shown    │
//   │  ← only 15 items ever in the DOM, never 1 000+          │
//   └─────────────────────────────────────────────────────────┘
//
// ── DISABLED STATE ────────────────────────────────────────────────
//
//   <SearchableDropdown
//     options={options}
//     value={form.partyId}
//     onChange={...}
//     disabled={!form.accountType}   // disable until a dependency is set
//     lang={lang}
//   />
//
// ================================================================
