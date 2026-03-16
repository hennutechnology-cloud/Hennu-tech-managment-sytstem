// ============================================================
// SubcontractorCard.tsx
// ============================================================
import { Phone, Mail, MapPin, Briefcase } from "lucide-react";
import GlassCard from "../../core/shared/components/GlassCard";
import { tSub } from "../../core/i18n/subcontractor.i18n";
import type { SubcontractorCardProps } from "../../core/models/subcontractor.types";
import { useLang } from "../../core/context/LangContext";

export default function SubcontractorCard({ subcontractor, stats, onDetails }: SubcontractorCardProps) {
  const { lang } = useLang();

  return (
    <GlassCard hover>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-white">{subcontractor.name}</h3>
          <p className="text-xs text-gray-400">{subcontractor.specialty}</p>
        </div>
      </div>

      <div className="space-y-2 mt-4 text-gray-300 text-sm">
        <div className="flex gap-2 items-center">
          <Briefcase size={14} />
          {subcontractor.contactPerson}
        </div>
        <div className="flex gap-2 items-center">
          <Phone size={14} />
          {subcontractor.phone}
        </div>
        <div className="flex gap-2 items-center">
          <Mail size={14} />
          {subcontractor.email}
        </div>
        <div className="flex gap-2 items-center">
          <MapPin size={14} />
          {subcontractor.address}
        </div>
      </div>

      <div className="mt-4 border-t border-white/10 pt-3 text-sm">
        <div className="flex justify-between">
          <span>{tSub(lang, "contracts")}</span>
          <b>{stats.contracts}</b>
        </div>
        <div className="flex justify-between">
          <span>{tSub(lang, "contractValue")}</span>
          <b>{stats.totalContractValue.toLocaleString()}</b>
        </div>
        <div className="flex justify-between text-green-400">
          <span>{tSub(lang, "paid")}</span>
          <b>{stats.totalPaid.toLocaleString()}</b>
        </div>
        <div className="flex justify-between text-orange-400">
          <span>{tSub(lang, "remaining")}</span>
          <b>{(stats.totalContractValue - stats.totalPaid).toLocaleString()}</b>
        </div>
      </div>

      <button
        onClick={onDetails}
        className="mt-4 w-full border border-white/20 rounded-lg py-2 text-white hover:bg-white/5 transition-colors"
      >
        {tSub(lang, "details")}
      </button>

    </GlassCard>
  );
}
