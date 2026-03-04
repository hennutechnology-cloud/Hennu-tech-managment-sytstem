// ============================================================
// SettingsField.tsx — Form primitives
// ============================================================
import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

// ── Text input ────────────────────────────────────────────────
interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  colSpan?: "1" | "2";
}
export function Field({ label, hint, error, colSpan, className = "", ...props }: FieldProps) {
  return (
    <div className={colSpan === "2" ? "md:col-span-2" : ""}>
      <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
      <input
        {...props}
        className={`w-full bg-white/5 border ${error ? "border-red-500/60" : "border-white/10"}
                    rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600
                    focus:outline-none focus:border-[#F97316] transition-colors ${className}`}
      />
      {hint  && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}
export function SelectField({ label, options, className = "", ...props }: SelectProps) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
      <select
        {...props}
        className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5
                    text-white text-sm focus:outline-none focus:border-[#F97316]
                    transition-colors cursor-pointer ${className}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0f1117]">{o.label}</option>
        ))}
      </select>
    </div>
  );
}

// ── Toggle — direction-safe ───────────────────────────────────
// The pill knob always moves LEFT→RIGHT when ON (physically correct).
// We achieve this by wrapping only the <button> in dir="ltr",
// while the label text stays in the natural page direction.
interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  accent?: string; // tailwind bg class e.g. "bg-[#F97316]"
}
export function Toggle({ label, description, checked, onChange, accent = "bg-[#F97316]" }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 gap-4">
      {/* Text — inherits page direction (RTL or LTR) naturally */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white">{label}</div>
        {description && <div className="text-xs text-gray-500 mt-0.5">{description}</div>}
      </div>

      {/* Pill wrapper — forced LTR so knob always slides left→right */}
      <div dir="ltr" className="flex-shrink-0">
        <button
          onClick={() => onChange(!checked)}
          role="switch"
          aria-checked={checked}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]/50
                      ${checked ? accent : "bg-white/15"}`}
        >
          <span
            style={{
              position: "absolute",
              top: "2px",
              left: checked ? "calc(100% - 22px)" : "2px",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "white",
              boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
              transition: "left 0.2s ease",
            }}
          />
        </button>
      </div>
    </div>
  );
}

// ── Action row ────────────────────────────────────────────────
interface ActionRowProps {
  label: string;
  description?: string;
  buttonLabel: string;
  onClick: () => void;
  variant?: "orange" | "red" | "slate";
  disabled?: boolean;
}
const BTN: Record<string, string> = {
  orange: "bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white hover:shadow-orange-500/30",
  red:    "bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400",
  slate:  "bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300",
};
export function ActionRow({ label, description, buttonLabel, onClick, variant = "slate", disabled }: ActionRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 gap-4">
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        {description && <div className="text-xs text-gray-500 mt-0.5">{description}</div>}
      </div>
      <button
        onClick={onClick} disabled={disabled}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0
                    hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${BTN[variant]}`}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
