// ============================================================
// SettingsNav.tsx — Left-panel sticky navigation
// ============================================================
import {
  Building2, User, Bell, Shield,
  SlidersHorizontal, Server,
} from "lucide-react";
import { t } from "../../core/i18n/settings.i18n";
import type { Lang } from "../../core/models/Settings.types";

export type SectionId =
  | "company" | "profile" | "notifications"
  | "security" | "preferences" | "system";

const NAV_ITEMS: { id: SectionId; icon: React.ElementType; key: Parameters<typeof t>[1] }[] = [
  { id: "company",       icon: Building2,         key: "navCompany"       },
  { id: "profile",       icon: User,              key: "navProfile"       },
  { id: "notifications", icon: Bell,              key: "navNotifications" },
  { id: "security",      icon: Shield,            key: "navSecurity"      },
  { id: "preferences",   icon: SlidersHorizontal, key: "navPreferences"   },
  { id: "system",        icon: Server,            key: "navSystem"        },
];

interface SettingsNavProps {
  active: SectionId;
  onSelect: (id: SectionId) => void;
  lang: Lang;
}

export default function SettingsNav({ active, onSelect, lang }: SettingsNavProps) {
  const dir = lang === "ar" ? "rtl" : "ltr";
  // Active indicator: in RTL the "start" side is the right; in LTR it is the left
  const activeBorder = lang === "ar" ? "border-r-2" : "border-l-2";

  return (
    <nav dir={dir} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden sticky top-4">
      <div className="px-4 py-3 border-b border-white/10">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">
          {lang === "ar" ? "الأقسام" : "Sections"}
        </p>
      </div>
      <ul className="py-2">
        {NAV_ITEMS.map(({ id, icon: Icon, key }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <button
                onClick={() => onSelect(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all
                            hover:bg-white/5 group
                            ${isActive
                              ? `bg-[#F97316]/10 text-[#F97316] font-semibold ${activeBorder} border-[#F97316]`
                              : "text-gray-400 hover:text-white"}`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#F97316]" : "text-gray-500 group-hover:text-white"}`} />
                {t(lang, key)}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
