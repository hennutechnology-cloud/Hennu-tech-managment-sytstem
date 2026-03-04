// ============================================================
// SettingsHeader.tsx
// ============================================================
import { Settings, Save } from "lucide-react";
import { t } from "../../core/i18n/settings.i18n";
import type { SettingsHeaderProps } from "../../core/models/Settings.types";

export default function SettingsHeader({ onSave, saving, isDirty, lang }: SettingsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-[#F97316]" />
          {t(lang, "pageTitle")}
        </h1>
        <p className="text-gray-400">{t(lang, "pageSubtitle")}</p>
      </div>
      <button
        onClick={onSave} disabled={saving || !isDirty}
        className="px-6 py-3 bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white rounded-xl
                   hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving
          ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <Save className="w-5 h-5" />}
        {saving ? t(lang, "saving") : isDirty ? t(lang, "saveChanges") : t(lang, "saved")}
      </button>
    </div>
  );
}
