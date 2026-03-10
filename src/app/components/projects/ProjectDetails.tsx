// ============================================================
// ProjectDetails.tsx
// Full detail panel for the selected project.
// Includes financial summary, cost breakdown, budget-vs-actual,
// AND the full ProjectContractsWidget embedded at the bottom.
// ============================================================
import { DollarSign, TrendingUp, BarChart3, AlertTriangle } from "lucide-react";
import { motion }                     from "motion/react";
import GlassCard                      from "../../core/shared/components/GlassCard";
import ProjectContractsWidget         from "../Contracts/ProjectContractsWidget";
import { tProj, dirAttr, resolveRiskBadge, formatNum } from "../../core/i18n/projects.i18n";
import type { ProjectDetailsProps }   from "../../core/models/projects.types";

// ── Small info row ────────────────────────────────────────────
function InfoRow({ label, value, valueClass = "text-white" }: {
  label: string; value: React.ReactNode; valueClass?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-white/5 last:border-0">
      <span className="text-gray-400 text-sm shrink-0">{label}</span>
      <span className={`text-sm font-medium text-right ${valueClass}`}>{value}</span>
    </div>
  );
}

// ── Stat tile ─────────────────────────────────────────────────
function StatTile({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string; sub?: string; color: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-start gap-3">
      <div className={`p-2 rounded-lg bg-current/10 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 leading-snug">{label}</p>
        <p className={`text-base sm:text-lg font-bold mt-0.5 ${color}`}>{value}</p>
        {sub && <p className="text-[10px] text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Simple bar chart (pure CSS, no recharts needed) ───────────
function BudgetBar({ phase, budget, actual, maxVal, lang }: {
  phase: string; budget: number; actual: number; maxVal: number; lang: "ar" | "en";
}) {
  const fmt = (n: number) => formatNum(n, lang);
  const bPct = maxVal > 0 ? (budget / maxVal) * 100 : 0;
  const aPct = maxVal > 0 ? (actual / maxVal) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <p className="text-xs text-gray-400">{phase}</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#F97316]/70 rounded-full" style={{ width: `${bPct}%` }} />
        </div>
        <span className="text-[10px] text-gray-500 w-20 text-end">{fmt(budget)}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#10B981]/70 rounded-full" style={{ width: `${aPct}%` }} />
        </div>
        <span className="text-[10px] text-gray-500 w-20 text-end">{fmt(actual)}</span>
      </div>
    </div>
  );
}

// ── Donut slice helper (CSS conic-gradient) ───────────────────
function CostDonut({ items, total }: { items: { name: string; value: number; color: string }[]; total: number }) {
  let angle = 0;
  const stops = items.map((item) => {
    const deg = (item.value / total) * 360;
    const stop = `${item.color} ${angle}deg ${angle + deg}deg`;
    angle += deg;
    return stop;
  });
  return (
    <div className="flex items-center justify-center">
      <div
        className="w-32 h-32 rounded-full"
        style={{ background: `conic-gradient(${stops.join(", ")})` }}
      >
        <div className="w-full h-full rounded-full flex items-center justify-center"
          style={{ background: "radial-gradient(circle, #0f1117 55%, transparent 55%)" }}>
          <span className="text-[10px] text-gray-400">100%</span>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetails({
  project, costBreakdown, budgetActual, lang,
}: ProjectDetailsProps) {
  const t    = (k: any) => tProj(lang, k);
  const dir  = dirAttr(lang);
  const fmt  = (n: number) => formatNum(n, lang);
  const cur  = t("currency");
  const risk = resolveRiskBadge(lang, project.riskLevel);

  const variance = project.budget - project.actualCost;
  const maxVal   = Math.max(...budgetActual.map((b) => Math.max(b.budget, b.actual)), 1);
  const totalCost = costBreakdown.reduce((s, i) => s + i.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      dir={dir}
      className="space-y-5 sm:space-y-6"
    >
      {/* ── Project name + risk ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-white">{project.name}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{t("detailTitle")}</p>
        </div>
        <span className={`self-start sm:self-auto px-3 py-1.5 rounded-xl border text-xs font-medium ${risk.className}`}>
          {risk.label}
        </span>
      </div>

      {/* ── 4 stat tiles ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatTile icon={DollarSign}   label={t("labelBudget")}       value={`${fmt(project.budget)} ${cur}`}      color="text-orange-400" />
        <StatTile icon={DollarSign}   label={t("labelActualCost")}   value={`${fmt(project.actualCost)} ${cur}`}  color="text-blue-400"   />
        <StatTile icon={TrendingUp}   label={t("labelProfitMargin")} value={`${project.profitMargin}%`}           color="text-emerald-400"/>
        <StatTile icon={BarChart3}    label={t("labelVariance")}     value={`${fmt(Math.abs(variance))} ${cur}`}  color={variance >= 0 ? "text-emerald-400" : "text-red-400"} />
      </div>

      {/* ── Progress + financial rows ── */}
      <GlassCard>
        <h3 className="text-sm sm:text-base font-bold text-white mb-4">{t("financialSummary")}</h3>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">{t("labelProgress")}</span>
            <span className="text-xs font-bold text-white">{project.progress}%</span>
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#F97316] to-[#10B981] rounded-full transition-all duration-700"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
        <InfoRow label={t("labelBudget")}       value={`${fmt(project.budget)} ${cur}`}      />
        <InfoRow label={t("labelActualCost")}   value={`${fmt(project.actualCost)} ${cur}`}   valueClass="text-blue-400" />
        <InfoRow label={t("labelVariance")}     value={`${fmt(Math.abs(variance))} ${cur}`}   valueClass={variance >= 0 ? "text-emerald-400" : "text-red-400"} />
        <InfoRow label={t("labelProfitMargin")} value={`${project.profitMargin}%`}             valueClass="text-emerald-400" />
        <InfoRow label={t("labelRisk")}         value={
          <span className={`px-2 py-0.5 rounded-md border text-[10px] ${risk.className}`}>{risk.label}</span>
        } />
        {project.riskLevel === "high" && (
          <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-xs text-red-400">{t("statsDelayed")}</p>
          </div>
        )}
      </GlassCard>

      {/* ── Cost breakdown + Budget vs Actual ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Cost donut */}
        <GlassCard>
          <h3 className="text-sm sm:text-base font-bold text-white mb-4">{t("costBreakdown")}</h3>
          {totalCost > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <CostDonut items={costBreakdown} total={totalCost} />
              <div className="flex-1 space-y-2 w-full">
                {costBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-gray-300 truncate">{item.name}</span>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">
                      {fmt(item.value)} {cur}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-6">—</p>
          )}
        </GlassCard>

        {/* Budget vs actual bars */}
        <GlassCard>
          <h3 className="text-sm sm:text-base font-bold text-white mb-4">{t("budgetVsActual")}</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm bg-[#F97316]/70" />
              <span className="text-xs text-gray-400">{t("budget")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm bg-[#10B981]/70" />
              <span className="text-xs text-gray-400">{t("actual")}</span>
            </div>
          </div>
          <div className="space-y-4">
            {budgetActual.map((b) => (
              <BudgetBar key={b.phase} phase={b.phase} budget={b.budget} actual={b.actual} maxVal={maxVal} lang={lang} />
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ── Contracts widget ─────────────────────────────────
          This is the key integration: the full contracts feature
          is embedded here, scoped to the selected project.
          Users add contracts here; they edit details in
          the Contracts standalone page.
      ─────────────────────────────────────────────────────── */}
      <div className="border-t border-white/10 pt-5 sm:pt-6">
        <ProjectContractsWidget projectId={project.id} lang={lang} />
      </div>
    </motion.div>
  );
}
