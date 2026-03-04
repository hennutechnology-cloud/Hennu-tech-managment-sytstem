// ============================================================
// UserProfileSection.tsx
// ============================================================
import { User, Camera } from "lucide-react";
import { useRef } from "react";
import SettingsSection from "./SettingsSection";
import { Field, SelectField, ActionRow } from "./SettingsField";
import { t } from "../../core/i18n/settings.i18n";
import type { UserProfileSectionProps, Lang } from "../../core/models/Settings.types";
import { useLang } from "../../core/context/LangContext";

export default function UserProfileSection({
  data, onChange, onChangePassword, onChangeAvatar, lang,
}: UserProfileSectionProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof typeof data>(key: K, value: typeof data[K]) {
    onChange({ ...data, [key]: value });
  }

  const { setLang } = useLang();

  const handleLanguageChange = (newLang: Lang) => {
    setLang(newLang);   // updates context + localStorage in one call
    set("language", newLang);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChangeAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <SettingsSection title={t(lang, "profileTitle")} subtitle={t(lang, "profileSub")}
                     icon={User} iconColor="text-blue-400" lang={lang}>
      {/* Avatar */}
      <div className="flex items-center gap-5 mb-6 pb-6 border-b border-white/10">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/10
                          border-2 border-blue-500/30 flex items-center justify-center overflow-hidden">
            {data.avatar
              ? <img src={data.avatar} alt="avatar" className="w-full h-full object-cover" />
              : <span className="text-2xl font-bold text-blue-400">{data.fullName.charAt(0)}</span>}
          </div>
          <button onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-[#F97316]
                             flex items-center justify-center shadow-lg hover:bg-[#EA580C] transition-colors">
            <Camera className="w-3.5 h-3.5 text-white" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </div>
        <div>
          <p className="text-white font-semibold">{data.fullName}</p>
          <p className="text-sm text-gray-400">{data.jobTitle}</p>
          <p className="text-xs text-gray-500 mt-0.5">{data.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Field label={t(lang, "fullName")}  value={data.fullName}   onChange={(e) => set("fullName", e.target.value)} />
        <Field label={t(lang, "mobilePhone")} value={data.phone}    onChange={(e) => set("phone", e.target.value)} type="tel" />
        <Field label={t(lang, "jobTitle")}  value={data.jobTitle}   onChange={(e) => set("jobTitle", e.target.value)} />
        <Field label={t(lang, "department")} value={data.department} onChange={(e) => set("department", e.target.value)} />
        <Field label={t(lang, "email")} value={data.email}
               onChange={(e) => set("email", e.target.value)}
               type="email" colSpan="2" hint={t(lang, "emailHint")} />
        <SelectField
          label={t(lang, "interfaceLang")}
          value={data.language}
          onChange={(e) => handleLanguageChange(e.target.value as Lang)}
          options={[
            { value: "ar", label: t(lang, "langAr") },
            { value: "en", label: t(lang, "langEn") },
          ]}
        />
      </div>

      <div className="border-t border-white/10 pt-4">
        <ActionRow
          label={t(lang, "changePassword")}
          description={t(lang, "passwordDesc")}
          buttonLabel={t(lang, "changePassword")}
          onClick={onChangePassword}
          variant="orange"
        />
      </div>
    </SettingsSection>
  );
}
