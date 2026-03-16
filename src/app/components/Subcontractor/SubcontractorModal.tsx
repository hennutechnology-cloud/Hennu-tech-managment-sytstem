// ============================================================
// SubcontractorModal.tsx
// ============================================================
import { useState, useEffect } from "react";
import {
  X, Edit2, Trash2, Save, AlertTriangle,
  Phone, Mail, MapPin, Briefcase, User, Building2,
} from "lucide-react";
import { useLang } from "../../core/context/LangContext";
import { tSub } from "../../core/i18n/subcontractor.i18n";
import type {
  SubcontractorModalProps,
  SubcontractorFormData,
  SubcontractorFormErrors,
} from "../../core/models/subcontractor.types";

const EMPTY_FORM: SubcontractorFormData = {
  name: "",
  specialty: "",
  contactPerson: "",
  phone: "",
  email: "",
  address: "",
};

export default function SubcontractorModal({
  subcontractor,
  stats,
  mode,
  onClose,
  onSave,
  onDelete,
}: SubcontractorModalProps) {
  const { lang } = useLang();
  const isRTL = lang === "ar";

  const [isEditing, setIsEditing]                 = useState(mode === "add");
  const [form, setForm]                           = useState<SubcontractorFormData>({ ...EMPTY_FORM });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors]                       = useState<SubcontractorFormErrors>({});

  // Sync form whenever the target subcontractor or mode changes
  useEffect(() => {
    if (subcontractor) {
      const { id: _id, ...rest } = subcontractor;
      setForm(rest);
    } else {
      setForm({ ...EMPTY_FORM });
    }
    setIsEditing(mode === "add");
    setShowDeleteConfirm(false);
    setErrors({});
  }, [subcontractor, mode]);

  // ── Helpers ───────────────────────────────────────────────

  const validate = (): boolean => {
    const e: SubcontractorFormErrors = {};
    (Object.keys(EMPTY_FORM) as (keyof SubcontractorFormData)[]).forEach((key) => {
      if (!form[key].trim()) e[key] = tSub(lang, "errorRequired");
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(subcontractor ? { ...form, id: subcontractor.id } : form);
    onClose();
  };

  const handleDelete = () => {
    if (subcontractor) {
      onDelete(subcontractor.id);
      onClose();
    }
  };

  const handleCancelEdit = () => {
    if (subcontractor) {
      const { id: _id, ...rest } = subcontractor;
      setForm(rest);
    }
    setIsEditing(false);
    setErrors({});
  };

  // ── Field config ──────────────────────────────────────────

  const fields: {
    key: keyof SubcontractorFormData;
    labelKey: Parameters<typeof tSub>[1];
    icon: React.ReactNode;
    type?: string;
  }[] = [
    { key: "name",          labelKey: "fieldName",     icon: <Building2 size={16} /> },
    { key: "specialty",     labelKey: "fieldSpecialty", icon: <Briefcase size={16} /> },
    { key: "contactPerson", labelKey: "fieldContact",   icon: <User      size={16} /> },
    { key: "phone",         labelKey: "fieldPhone",     icon: <Phone     size={16} />, type: "tel" },
    { key: "email",         labelKey: "fieldEmail",     icon: <Mail      size={16} />, type: "email" },
    { key: "address",       labelKey: "fieldAddress",   icon: <MapPin    size={16} /> },
  ];

  // ── Render ────────────────────────────────────────────────

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Panel */}
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(135deg,rgba(30,30,40,0.98) 0%,rgba(20,20,30,0.98) 100%)",
          border: "1px solid rgba(249,115,22,0.25)",
        }}
      >
        {/* Orange top bar */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#F97316,#EA580C)" }} />

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">
            {mode === "add"
              ? tSub(lang, "newSub")
              : isEditing
              ? tSub(lang, "editSub")
              : tSub(lang, "detailsSub")}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {fields.map(({ key, labelKey, icon, type }) => (
            <div key={key}>
              <label className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                {icon}
                {tSub(lang, labelKey)}
              </label>

              {isEditing ? (
                <>
                  <input
                    type={type ?? "text"}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder={tSub(lang, labelKey)}
                  />
                  {errors[key] && (
                    <p className="text-xs text-red-400 mt-1">{errors[key]}</p>
                  )}
                </>
              ) : (
                <p className="text-white text-sm py-2 px-3 bg-white/5 rounded-lg border border-white/5">
                  {form[key] || "—"}
                </p>
              )}
            </div>
          ))}

          {/* Stats grid — view mode only */}
          {mode === "view" && stats && !isEditing && (
            <div className="mt-2 rounded-xl border border-white/10 overflow-hidden">
              <div className="px-4 py-2 bg-white/5 text-xs text-gray-400 font-semibold tracking-wide uppercase">
                {tSub(lang, "statsTitle")}
              </div>
              <div className="grid grid-cols-2 gap-px bg-white/10">
                {[
                  { label: tSub(lang, "contracts"),     value: stats.contracts,                                               color: "text-white" },
                  { label: tSub(lang, "contractValue"), value: stats.totalContractValue.toLocaleString(),                     color: "text-white" },
                  { label: tSub(lang, "paid"),          value: stats.totalPaid.toLocaleString(),                              color: "text-green-400" },
                  { label: tSub(lang, "remaining"),     value: (stats.totalContractValue - stats.totalPaid).toLocaleString(), color: "text-orange-400" },
                ].map((s) => (
                  <div key={s.label} className="bg-[rgba(20,20,30,0.98)] px-4 py-3">
                    <p className="text-xs text-gray-400">{s.label}</p>
                    <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Delete confirmation overlay ── */}
        {showDeleteConfirm && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 rounded-2xl"
            style={{ background: "rgba(15,15,20,0.97)" }}
          >
            <div className="flex flex-col items-center gap-3 text-center px-8">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle size={28} className="text-red-400" />
              </div>
              <h3 className="text-white font-bold text-lg">{tSub(lang, "deleteConfirm")}</h3>
              <p className="text-gray-400 text-sm">{tSub(lang, "deleteConfirmDesc")}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
              >
                {tSub(lang, "cancel")}
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
              >
                {tSub(lang, "confirmDelete")}
              </button>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between gap-3">

          {/* Delete button (view mode only) */}
          <div>
            {mode === "view" && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors border border-red-500/20"
              >
                <Trash2 size={15} />
                {tSub(lang, "delete")}
              </button>
            )}
          </div>

          {/* Edit / Save / Cancel */}
          <div className="flex gap-3">
            {!isEditing && mode === "view" ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: "linear-gradient(135deg,#F97316,#EA580C)" }}
              >
                <Edit2 size={15} />
                {tSub(lang, "edit")}
              </button>
            ) : (
              <>
                {mode === "view" && (
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
                  >
                    {tSub(lang, "cancel")}
                  </button>
                )}
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white"
                  style={{ background: "linear-gradient(135deg,#F97316,#EA580C)" }}
                >
                  <Save size={15} />
                  {tSub(lang, "save")}
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
