// ============================================================
// BOQOptimisation.tsx
// Renders AI optimisation suggestions.
// Type ("saving" | "risk") drives icon + colour via i18n helper.
// Suggestion text is a plain API string rendered directly.
// ============================================================
import { CheckCircle2, Brain } from "lucide-react";
import GlassCard from "../../core/shared/components/GlassCard";
import { tBOQ, resolveSuggestionType, SUGGESTION_STYLE }
             from "../../core/i18n/boqComparison.i18n";
import type { BOQOptimisationProps, SuggestionType }
             from "../../core/models/BOQComparison.types";

const TYPE_ICON: Record<SuggestionType, React.ReactNode> = {
  saving: <CheckCircle2 className="w-4 h-4" />,
  risk:   <Brain        className="w-4 h-4" />,
};

export default function BOQOptimisation({ suggestions, lang }: BOQOptimisationProps) {
  const isRtl = lang === "ar";
  const align = isRtl ? "text-right" : "text-left";

  return (
    <GlassCard className="p-4 sm:p-6" >
      {/* Section title */}
      <div className={`flex items-center gap-2 mb-4 ${isRtl ? "flex-row-reverse" : ""}`}>
        <Brain className="w-5 h-5 text-orange-500" />
        <h3 className={`text-base sm:text-lg font-semibold text-white ${align}`}>
          {tBOQ(lang, "suggestionsTitle")}
        </h3>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {suggestions.map((s) => {
          const style    = SUGGESTION_STYLE[s.type];
          const icon     = TYPE_ICON[s.type];
          const typeLabel = resolveSuggestionType(lang, s.type);

          return (
            <div key={s.id} className={`p-4 rounded-xl ${style.card}`}>
              <div className={`flex items-center gap-2 mb-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                <span className={style.icon}>{icon}</span>
                <h4 className={`text-sm font-semibold ${style.label} ${align}`}>
                  {typeLabel}
                </h4>
              </div>
              <p className={`text-xs text-gray-400 leading-relaxed ${align}`}>
                {s.text}
              </p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
