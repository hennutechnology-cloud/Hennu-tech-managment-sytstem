// ============================================================
// SettingsSection.tsx — Section card wrapper
// ============================================================
import type { ReactNode, ElementType } from "react";
import type { Lang } from "../../core/models/Settings.types";

interface SettingsSectionProps {
  title: string;
  subtitle?: string;
  icon: ElementType;
  iconColor?: string;
  lang: Lang;
  children: ReactNode;
}

export default function SettingsSection({
  title, subtitle, icon: Icon,
  iconColor = "text-[#F97316]", lang, children,
}: SettingsSectionProps) {
  const dir = lang === "ar" ? "rtl" : "ltr";
  return (
    <div dir={dir} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden h-full">
      <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">{title}</h2>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
