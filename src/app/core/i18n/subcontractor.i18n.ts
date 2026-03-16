// ============================================================
// subcontractor.i18n.ts
// ============================================================
import type { Lang } from "../models/Settings.types";

const STRINGS = {
  // page / header
  title:             { ar: "مقاولو الباطن",                   en: "Subcontractors" },
  subtitle:          { ar: "إدارة المقاولين",                  en: "Manage subcontractors" },
  newSub:            { ar: "مقاول جديد",                      en: "New subcontractor" },
  editSub:           { ar: "تعديل المقاول",                   en: "Edit subcontractor" },
  detailsSub:        { ar: "تفاصيل المقاول",                  en: "Subcontractor details" },

  // card button
  details:           { ar: "عرض التفاصيل",                    en: "Show details" },

  // pagination
  next:              { ar: "التالي",                           en: "Next" },
  prev:              { ar: "السابق",                          en: "Prev" },

  // stats
  statsTitle:        { ar: "الإحصائيات",                      en: "Statistics" },
  contracts:         { ar: "عدد العقود",                      en: "Contracts" },
  contractValue:     { ar: "قيمة العقود",                     en: "Contract Value" },
  paid:              { ar: "المدفوع",                         en: "Paid" },
  remaining:         { ar: "المتبقي",                         en: "Remaining" },

  // form field labels
  fieldName:         { ar: "اسم الشركة",                      en: "Company name" },
  fieldSpecialty:    { ar: "التخصص",                          en: "Specialty" },
  fieldContact:      { ar: "المسؤول",                         en: "Contact person" },
  fieldPhone:        { ar: "الهاتف",                          en: "Phone" },
  fieldEmail:        { ar: "البريد الإلكتروني",                en: "Email" },
  fieldAddress:      { ar: "العنوان",                         en: "Address" },

  // actions
  edit:              { ar: "تعديل",                           en: "Edit" },
  save:              { ar: "حفظ",                             en: "Save" },
  cancel:            { ar: "إلغاء",                           en: "Cancel" },
  delete:            { ar: "حذف",                             en: "Delete" },
  confirmDelete:     { ar: "تأكيد الحذف",                     en: "Confirm delete" },

  // delete confirmation dialog
  deleteConfirm:     { ar: "هل تريد حذف المقاول؟",            en: "Delete subcontractor?" },
  deleteConfirmDesc: { ar: "لن تتمكن من التراجع عن هذا الإجراء.", en: "This action cannot be undone." },

  // validation
  errorRequired:     { ar: "هذا الحقل مطلوب",                 en: "This field is required" },
};

export type SubKey = keyof typeof STRINGS;

export function tSub(lang: Lang, key: SubKey): string {
  return STRINGS[key][lang];
}
