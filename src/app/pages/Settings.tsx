// ============================================================
// Settings.tsx  (page)
// ============================================================
import { useEffect, useState, useCallback, useRef } from "react";

import SettingsHeader       from "../components/settings/SettingsHeader";
import SettingsNav          from "../components/settings/SettingsNav";
import type { SectionId }   from "../components/settings/SettingsNav";
import CompanyInfoSection   from "../components/settings/CompanyInfoSection";
import UserProfileSection   from "../components/settings/UserProfileSection";
import NotificationsSection from "../components/settings/NotificationsSection";
import SecuritySection      from "../components/settings/SecuritySection";
import PreferencesSection   from "../components/settings/PreferencesSection";
import SystemSection        from "../components/settings/SystemSection";

import ChangePasswordModal  from "../components/settings/ChangePasswordModal";
import TwoFactorModal       from "../components/settings/TwoFactorModal";
import ResetDataModal       from "../components/settings/ResetDataModal";
import BackupModal          from "../components/settings/BackupModal";
import SaveSuccessToast     from "../components/settings/SaveSuccessToast";

import {
  fetchSettings, saveSettings, changePassword,
  setupTwoFactor, triggerBackup, resetAllData,
} from "../core/services/Settings.service";
import type { SettingsData, ChangePasswordPayload, Lang }
  from "../core/models/Settings.types";
import { t } from "../core/i18n/settings.i18n";
import { useLang } from "../core/context/LangContext";

type ModalKey = "changePassword" | "twoFactor" | "resetData" | "backup" | null;

// Maps SectionId → the ref used to scroll to that section
type SectionRefs = Record<SectionId, React.RefObject<HTMLDivElement | null>>;

const LANG_STORAGE_KEY = "app_ui_language";

// Read the persisted language synchronously — no API call needed.
// Falls back to "ar" if nothing is stored yet.
function getStoredLang(): Lang {
  try {
    return (localStorage.getItem(LANG_STORAGE_KEY) as Lang) ?? "ar";
  } catch {
    return "ar";
  }
}

export default function Settings() {
  const [data,        setData]        = useState<SettingsData | null>(null);
  const [savedData,   setSavedData]   = useState<SettingsData | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [toast,       setToast]       = useState(false);
  const [activeModal, setActiveModal] = useState<ModalKey>(null);
  const [activeNav,   setActiveNav]   = useState<SectionId>("company");

  // Per-section scroll refs — must be declared at top level (Rules of Hooks)
  const refCompany       = useRef<HTMLDivElement>(null);
  const refProfile       = useRef<HTMLDivElement>(null);
  const refNotifications = useRef<HTMLDivElement>(null);
  const refSecurity      = useRef<HTMLDivElement>(null);
  const refPreferences   = useRef<HTMLDivElement>(null);
  const refSystem        = useRef<HTMLDivElement>(null);

  const refs: SectionRefs = {
    company:       refCompany,
    profile:       refProfile,
    notifications: refNotifications,
    security:      refSecurity,
    preferences:   refPreferences,
    system:        refSystem,
  };

  // Language comes from context — shared with Layout for instant updates
  const { lang, setLang } = useLang();

  const isDirty = data !== null && savedData !== null &&
    JSON.stringify(data) !== JSON.stringify(savedData);

  // ── Load ─────────────────────────────────────────────────
  useEffect(() => {
    fetchSettings().then((d) => {
      // localStorage is the source of truth for language.
      // Patch server data to match so the form selector shows the right value.
      if (lang !== d.user.language) {
        d.user.language = lang;
      }
      setData(d);
      setSavedData(JSON.parse(JSON.stringify(d)));
    }).finally(() => setLoading(false));
  }, []);

  // ── Save ─────────────────────────────────────────────────
  const handleSave = async () => {
    if (!data || !isDirty) return;
    setSaving(true);
    try {
      await saveSettings(data);
      setSavedData(JSON.parse(JSON.stringify(data)));
      setToast(true);
    } finally { setSaving(false); }
  };

  // ── Section updater ───────────────────────────────────────
  const update = useCallback(<K extends keyof SettingsData>(
    section: K, value: SettingsData[K],
  ) => {
    setData((prev) => prev ? { ...prev, [section]: value } : prev);
  }, []);

  // ── Nav scroll ────────────────────────────────────────────
  const handleNavSelect = (id: SectionId) => {
    setActiveNav(id);
    refs[id].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Modal handlers ────────────────────────────────────────
  const handleChangePassword = async (p: ChangePasswordPayload) => { await changePassword(p); };
  const handleSetupTwoFactor = async (code: string) => {
    await setupTwoFactor(code);
    setData((prev) => prev ? { ...prev, security: { ...prev.security, twoFactorEnabled: true } } : prev);
  };
  const handleChangeAvatar = (base64: string) =>
    setData((prev) => prev ? { ...prev, user: { ...prev.user, avatar: base64 } } : prev);

  // ── Loading ───────────────────────────────────────────────
  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <span className="w-8 h-8 border-2 border-gray-600 border-t-orange-500 rounded-full animate-spin" />
          <span>{t(lang, "loading")}</span>
        </div>
      </div>
    );
  }

  // ── Shared section props ──────────────────────────────────
  const sp = { lang };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <SettingsHeader onSave={handleSave} saving={saving} isDirty={isDirty} lang={lang} />

      {/* ── Two-column layout ──────────────────────────────────
           In RTL (Arabic): nav appears on the RIGHT, content on LEFT
           In LTR (English): nav appears on the LEFT, content on RIGHT
           flex + dir on the parent handles this automatically        */}
      <div className="flex gap-6 items-start">

        {/* Nav panel — 224px wide, sticky so it stays visible while scrolling */}
        <div className="w-56 flex-shrink-0 sticky top-6 self-start">
          <SettingsNav active={activeNav} onSelect={handleNavSelect} lang={lang} />
        </div>

        {/* Content panel — fills remaining space */}
        <div className="flex-1 min-w-0 space-y-6">

          <div ref={refs.company}>
            <CompanyInfoSection data={data.company} onChange={(v) => update("company", v)} {...sp} />
          </div>

          <div ref={refs.profile}>
            <UserProfileSection
              data={data.user} onChange={(v) => update("user", v)}
              onChangePassword={() => setActiveModal("changePassword")}
              onChangeAvatar={handleChangeAvatar}
              {...sp}
            />
          </div>

          <div ref={refs.notifications}>
            <NotificationsSection data={data.notifications} onChange={(v) => update("notifications", v)} {...sp} />
          </div>

          <div ref={refs.security}>
            <SecuritySection
              data={data.security} onChange={(v) => update("security", v)}
              onChangePassword={() => setActiveModal("changePassword")}
              onSetupTwoFactor={() => setActiveModal("twoFactor")}
              {...sp}
            />
          </div>

          <div ref={refs.preferences}>
            <PreferencesSection data={data.preferences} onChange={(v) => update("preferences", v)} {...sp} />
          </div>

          <div ref={refs.system}>
            <SystemSection
              data={data.system} onChange={(v) => update("system", v)}
              onBackupNow={() => setActiveModal("backup")}
              onResetData={() => setActiveModal("resetData")}
              {...sp}
            />
          </div>

        </div>
      </div>

      {/* ── Modals ── */}
      <ChangePasswordModal isOpen={activeModal === "changePassword"} onClose={() => setActiveModal(null)} onSubmit={handleChangePassword} lang={lang} />
      <TwoFactorModal      isOpen={activeModal === "twoFactor"}      onClose={() => setActiveModal(null)} onEnable={handleSetupTwoFactor} isEnabled={data.security.twoFactorEnabled} lang={lang} />
      <ResetDataModal      isOpen={activeModal === "resetData"}      onClose={() => setActiveModal(null)} onConfirm={async () => { await resetAllData(); }} lang={lang} />
      <BackupModal         isOpen={activeModal === "backup"}         onClose={() => setActiveModal(null)} lang={lang} />

      {/* ── Toast ── */}
      <SaveSuccessToast isOpen={toast} onClose={() => setToast(false)} lang={lang} />
    </div>
  );
}
