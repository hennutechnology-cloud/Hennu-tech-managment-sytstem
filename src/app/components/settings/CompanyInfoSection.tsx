// ============================================================
// CompanyInfoSection.tsx
// ============================================================
import { Building2, Upload } from "lucide-react";
import { useRef } from "react";
import SettingsSection from "./SettingsSection";
import { Field } from "./SettingsField";
import { t } from "../../core/i18n/settings.i18n";
import type { CompanyInfoSectionProps } from "../../core/models/Settings.types";

export default function CompanyInfoSection({ data, onChange, lang }: CompanyInfoSectionProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  function set<K extends keyof typeof data>(key: K, value: typeof data[K]) {
    onChange({ ...data, [key]: value });
  }
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("logo", reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <SettingsSection title={t(lang, "companyTitle")} subtitle={t(lang, "companySub")}
                     icon={Building2} lang={lang}>
      {/* Logo row */}
      <div className="flex items-center gap-5 mb-6 pb-6 border-b border-white/10">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F97316]/20 to-[#EA580C]/10
                        border border-[#F97316]/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {data.logo
            ? <img src={data.logo} alt="logo" className="w-full h-full object-cover" />
            : <span className="text-2xl font-bold text-[#F97316]">{data.nameEn.slice(0,2).toUpperCase()}</span>}
        </div>
        <div>
          <p className="text-sm text-white font-medium mb-1">{t(lang, "logoTitle")}</p>
          <p className="text-xs text-gray-400 mb-3">{t(lang, "logoHint")}</p>
          <button onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10
                             border border-white/10 rounded-xl text-sm text-gray-300 transition-all">
            <Upload className="w-4 h-4" />
            {t(lang, "uploadLogo")}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label={t(lang, "companyNameAr")}  value={data.name}               onChange={(e) => set("name", e.target.value)}               placeholder="هينو تك" />
        <Field label={t(lang, "companyNameEn")}  value={data.nameEn}             onChange={(e) => set("nameEn", e.target.value)}             placeholder="Hennu Tech" />
        <Field label={t(lang, "taxNumber")}       value={data.taxNumber}          onChange={(e) => set("taxNumber", e.target.value)} />
        <Field label={t(lang, "commercialReg")}   value={data.commercialRegister} onChange={(e) => set("commercialRegister", e.target.value)} />
        <Field label={t(lang, "phone")}           value={data.phone}              onChange={(e) => set("phone", e.target.value)} type="tel" />
        <Field label={t(lang, "email")}           value={data.email}              onChange={(e) => set("email", e.target.value)} type="email" />
        <Field label={t(lang, "website")}         value={data.website}            onChange={(e) => set("website", e.target.value)} colSpan="2" />
        <Field label={t(lang, "address")}         value={data.address}            onChange={(e) => set("address", e.target.value)} colSpan="2" />
      </div>
    </SettingsSection>
  );
}
