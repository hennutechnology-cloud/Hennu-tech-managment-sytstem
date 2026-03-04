// ============================================================
// settings.i18n.ts — All UI strings for the Settings page
// Add a key here once; use it everywhere via t(lang, "key")
// ============================================================

export type Lang = "ar" | "en";

const STRINGS = {
  // ── Page ──────────────────────────────────────────────────
  pageTitle:        { ar: "الإعدادات",                           en: "Settings"                          },
  pageSubtitle:     { ar: "إدارة إعدادات النظام والحساب",         en: "Manage system and account settings" },
  saveChanges:      { ar: "حفظ التغييرات",                       en: "Save Changes"                      },
  saving:           { ar: "جارٍ الحفظ…",                         en: "Saving…"                           },
  saved:            { ar: "محفوظ",                               en: "Saved"                             },
  saveSuccess:      { ar: "تم حفظ الإعدادات بنجاح",              en: "Settings saved successfully"        },
  allChangesSaved:  { ar: "كل التغييرات محفوظة",                  en: "All changes saved"                  },
  loading:          { ar: "جارٍ تحميل الإعدادات…",               en: "Loading settings…"                  },

  // ── Left panel nav ────────────────────────────────────────
  navCompany:       { ar: "معلومات الشركة",    en: "Company Info"    },
  navProfile:       { ar: "الملف الشخصي",      en: "User Profile"    },
  navNotifications: { ar: "الإشعارات",          en: "Notifications"   },
  navSecurity:      { ar: "الأمان",             en: "Security"        },
  navPreferences:   { ar: "التفضيلات",           en: "Preferences"     },
  navSystem:        { ar: "النظام",             en: "System"          },

  // ── Company ───────────────────────────────────────────────
  companyTitle:     { ar: "معلومات الشركة",                       en: "Company Information"               },
  companySub:       { ar: "بيانات الشركة الظاهرة في التقارير",    en: "Company data shown in reports"     },
  companyNameAr:    { ar: "اسم الشركة (عربي)",                    en: "Company Name (Arabic)"             },
  companyNameEn:    { ar: "اسم الشركة (إنجليزي)",                 en: "Company Name (English)"            },
  taxNumber:        { ar: "الرقم الضريبي",                        en: "Tax Number"                        },
  commercialReg:    { ar: "السجل التجاري",                         en: "Commercial Register"               },
  phone:            { ar: "رقم الهاتف",                           en: "Phone Number"                      },
  email:            { ar: "البريد الإلكتروني",                     en: "Email Address"                     },
  website:          { ar: "الموقع الإلكتروني",                     en: "Website"                           },
  address:          { ar: "العنوان",                              en: "Address"                           },
  logoTitle:        { ar: "شعار الشركة",                          en: "Company Logo"                      },
  logoHint:         { ar: "PNG أو JPG — 512×512 بكسل على الأقل", en: "PNG or JPG — min 512×512 px"       },
  uploadLogo:       { ar: "تحميل شعار",                           en: "Upload Logo"                       },

  // ── Profile ───────────────────────────────────────────────
  profileTitle:     { ar: "الملف الشخصي",                        en: "User Profile"                      },
  profileSub:       { ar: "معلومات المستخدم الحالي",              en: "Current user information"           },
  fullName:         { ar: "الاسم الكامل",                         en: "Full Name"                         },
  mobilePhone:      { ar: "رقم الجوال",                           en: "Mobile Phone"                      },
  jobTitle:         { ar: "المسمى الوظيفي",                       en: "Job Title"                         },
  department:       { ar: "القسم",                                en: "Department"                        },
  emailHint:        { ar: "يُستخدم للدخول وتلقي الإشعارات",       en: "Used for login and notifications"  },
  interfaceLang:    { ar: "لغة الواجهة",                          en: "Interface Language"                 },
  langAr:           { ar: "العربية",                              en: "Arabic"                            },
  langEn:           { ar: "الإنجليزية",                           en: "English"                           },
  changePassword:   { ar: "تغيير كلمة المرور",                    en: "Change Password"                   },
  passwordDesc:     { ar: "تغيير كلمة المرور الحالية",             en: "Update your current password"      },

  // ── Notifications ─────────────────────────────────────────
  notifTitle:       { ar: "الإشعارات",                            en: "Notifications"                     },
  notifSub:         { ar: "تحكم في طريقة تلقي الإشعارات",         en: "Control how you receive alerts"    },
  channelsLabel:    { ar: "قنوات الإشعار",                        en: "Notification Channels"             },
  emailAlerts:      { ar: "إشعارات البريد الإلكتروني",             en: "Email Alerts"                      },
  emailAlertDesc:   { ar: "تلقي إشعارات عبر البريد",              en: "Receive alerts via email"           },
  smsAlerts:        { ar: "إشعارات الرسائل النصية",                en: "SMS Alerts"                        },
  smsAlertDesc:     { ar: "تلقي رسائل SMS",                       en: "Receive SMS messages"              },
  pushAlerts:       { ar: "إشعارات فورية (Push)",                  en: "Push Notifications"                },
  pushAlertDesc:    { ar: "تنبيهات داخل التطبيق",                  en: "In-app notifications"              },
  typesLabel:       { ar: "أنواع الإشعارات",                       en: "Notification Types"                },
  reportReady:      { ar: "جاهزية التقارير",                       en: "Report Ready"                      },
  reportReadyDesc:  { ar: "عند اكتمال أي تقرير",                  en: "When any report is complete"       },
  budgetWarning:    { ar: "تحذير الميزانية",                       en: "Budget Warning"                    },
  budgetWarnDesc:   { ar: "عند الاقتراب من الحد",                  en: "When approaching budget limit"     },
  invoiceDue:       { ar: "استحقاق الفاتورة",                      en: "Invoice Due"                       },
  invoiceDueDesc:   { ar: "قبل موعد السداد بـ 3 أيام",             en: "3 days before payment due"         },
  systemUpdates:    { ar: "تحديثات النظام",                        en: "System Updates"                    },
  systemUpdDesc:    { ar: "إشعارات الصيانة والتحديثات",             en: "Maintenance and update notices"    },

  // ── Security ──────────────────────────────────────────────
  securityTitle:    { ar: "الأمان",                               en: "Security"                          },
  securitySub:      { ar: "إعدادات حماية الحساب والجلسات",        en: "Account protection and session settings" },
  twoFactorOn:      { ar: "المصادقة الثنائية مفعّلة",             en: "Two-Factor Auth Enabled"           },
  twoFactorOff:     { ar: "المصادقة الثنائية غير مفعّلة",         en: "Two-Factor Auth Disabled"          },
  twoFactorOnDesc:  { ar: "حسابك محمي بطبقة أمان إضافية",         en: "Your account has an extra security layer" },
  twoFactorOffDesc: { ar: "يُنصح بتفعيلها لحماية أعلى",           en: "Recommended for higher security"   },
  manage:           { ar: "إدارة",                                en: "Manage"                            },
  activate:         { ar: "تفعيل",                                en: "Enable"                            },
  lastChanged:      { ar: "آخر تغيير: منذ 90 يوماً",              en: "Last changed: 90 days ago"         },
  loginNotif:       { ar: "إشعار تسجيل الدخول",                   en: "Login Notification"                },
  loginNotifDesc:   { ar: "تنبيه عند تسجيل دخول من جهاز جديد",    en: "Alert when signing in from new device" },
  sessionTimeout:   { ar: "مهلة انتهاء الجلسة (دقيقة)",           en: "Session Timeout (minutes)"         },
  ipWhitelist:      { ar: "قائمة IP المسموح بها (اختياري)",        en: "IP Whitelist (optional)"           },
  ipHint:           { ar: "فصل بين العناوين بفاصلة",              en: "Separate addresses with a comma"   },

  // ── Preferences ───────────────────────────────────────────
  prefTitle:        { ar: "التفضيلات",                             en: "Preferences"                       },
  prefSub:          { ar: "تخصيص تجربة الاستخدام",                en: "Customize your experience"         },
  currency:         { ar: "العملة الافتراضية",                     en: "Default Currency"                  },
  dateFormat:       { ar: "تنسيق التاريخ",                         en: "Date Format"                       },
  numberFormat:     { ar: "تنسيق الأرقام",                         en: "Number Format"                     },
  fiscalYearStart:  { ar: "بداية السنة المالية",                   en: "Fiscal Year Start"                 },
  sidebarCollapsed: { ar: "الشريط الجانبي مطوي افتراضياً",         en: "Sidebar Collapsed by Default"      },
  sidebarCollDesc:  { ar: "يبدأ الشريط مطوياً عند كل تسجيل دخول", en: "Sidebar starts collapsed on login"  },

  // ── System ────────────────────────────────────────────────
  systemTitle:      { ar: "النظام",                               en: "System"                            },
  systemSub:        { ar: "إعدادات النسخ الاحتياطي والصيانة",     en: "Backup and maintenance settings"   },
  backupFreq:       { ar: "تكرار النسخ الاحتياطي",                 en: "Backup Frequency"                  },
  backupRetention:  { ar: "مدة الاحتفاظ بالنسخ (يوم)",            en: "Backup Retention (days)"           },
  backupNow:        { ar: "نسخة احتياطية فورية",                   en: "Instant Backup"                    },
  backupNowDesc:    { ar: "إنشاء نسخة احتياطية الآن",              en: "Create a backup right now"         },
  backupNowBtn:     { ar: "نسخ الآن",                              en: "Backup Now"                        },
  maintenanceMode:  { ar: "وضع الصيانة",                          en: "Maintenance Mode"                  },
  maintenanceDesc:  { ar: "تعطيل الوصول مؤقتاً لجميع المستخدمين", en: "Temporarily disable access for all users" },
  debugMode:        { ar: "وضع التصحيح",                          en: "Debug Mode"                        },
  debugDesc:        { ar: "تسجيل معلومات تفصيلية للمطورين",        en: "Log detailed info for developers"  },
  dangerZone:       { ar: "منطقة الخطر",                          en: "Danger Zone"                       },
  resetData:        { ar: "إعادة تعيين جميع البيانات",             en: "Reset All Data"                    },
  resetDataDesc:    { ar: "حذف جميع بيانات النظام بشكل نهائي",    en: "Permanently delete all system data" },
  resetBtn:         { ar: "إعادة تعيين",                          en: "Reset"                             },

  // ── Modals ────────────────────────────────────────────────
  changePwdTitle:   { ar: "تغيير كلمة المرور",                    en: "Change Password"                   },
  changePwdDesc:    { ar: "اختر كلمة مرور قوية تحتوي على أحرف وأرقام ورموز", en: "Choose a strong password with letters, numbers and symbols" },
  currentPwd:       { ar: "كلمة المرور الحالية",                   en: "Current Password"                  },
  newPwd:           { ar: "كلمة المرور الجديدة",                   en: "New Password"                      },
  confirmPwd:       { ar: "تأكيد كلمة المرور",                     en: "Confirm Password"                  },
  cancel:           { ar: "إلغاء",                                en: "Cancel"                            },
  confirm:          { ar: "تأكيد",                                en: "Confirm"                           },
  close:            { ar: "إغلاق",                                en: "Close"                             },
  changingPwd:      { ar: "جارٍ التغيير…",                        en: "Changing…"                         },
  errCurrentPwd:    { ar: "أدخل كلمة المرور الحالية",              en: "Enter your current password"       },
  errPwdLength:     { ar: "يجب أن تكون كلمة المرور 8 أحرف على الأقل", en: "Password must be at least 8 characters" },
  errPwdMatch:      { ar: "كلمتا المرور غير متطابقتين",             en: "Passwords do not match"            },

  twoFactorTitle:   { ar: "تفعيل المصادقة الثنائية",               en: "Enable Two-Factor Auth"            },
  twoFactorMgTitle: { ar: "إدارة المصادقة الثنائية",               en: "Manage Two-Factor Auth"            },
  scanQr:           { ar: "امسح رمز QR باستخدام",                  en: "Scan the QR code using"            },
  scanQrApp:        { ar: "Google Authenticator أو Authy",         en: "Google Authenticator or Authy"     },
  enterCode:        { ar: "أدخل الرمز الظاهر في التطبيق للتحقق",  en: "Enter the code shown in the app"   },
  verifying:        { ar: "جارٍ التحقق…",                          en: "Verifying…"                        },
  enable:           { ar: "تفعيل",                                en: "Enable"                            },
  errCodeLen:       { ar: "أدخل رمز التحقق المكون من 6 أرقام",     en: "Enter the 6-digit verification code" },
  twoFactorMgDesc:  { ar: "المصادقة الثنائية مفعّلة. يمكنك إدارة إعداداتها أدناه.", en: "Two-factor auth is enabled. Manage settings below." },

  resetModalTitle:  { ar: "إعادة تعيين جميع البيانات",             en: "Reset All Data"                    },
  resetWarning:     { ar: "هذا الإجراء لا يمكن التراجع عنه",       en: "This action cannot be undone"      },
  resetWarningDesc: { ar: "سيتم حذف جميع البيانات بشكل نهائي",     en: "All data will be permanently deleted" },
  resetConfirmHint: { ar: "للتأكيد، اكتب:",                        en: "To confirm, type:"                 },
  resetConfirmWord: { ar: "احذف جميع البيانات",                    en: "delete all data"                   },
  deletingData:     { ar: "جارٍ الحذف…",                           en: "Deleting…"                         },

  backupTitle:      { ar: "إنشاء نسخة احتياطية",                   en: "Creating Backup"                   },
  backupProgress:   { ar: "جارٍ إنشاء النسخة الاحتياطية…",         en: "Creating backup…"                  },
  backupDontClose:  { ar: "يرجى عدم إغلاق هذه النافذة",            en: "Please do not close this window"   },
  backupDone:       { ar: "اكتملت النسخة الاحتياطية",               en: "Backup Complete"                   },
  backupDoneDesc:   { ar: "تم حفظ النسخة بنجاح في التخزين السحابي", en: "Backup saved to cloud storage"     },

  // ── Shared ────────────────────────────────────────────────
  uploading:        { ar: "جارٍ التحميل…",                         en: "Uploading…"                        },
  freqDaily:        { ar: "يومياً",                                en: "Daily"                             },
  freqWeekly:       { ar: "أسبوعياً",                              en: "Weekly"                            },
  freqMonthly:      { ar: "شهرياً",                                en: "Monthly"                           },
  janLabel:         { ar: "يناير (01/01)",                         en: "January (01/01)"                   },
  aprLabel:         { ar: "أبريل (01/04)",                         en: "April (01/04)"                     },
  julLabel:         { ar: "يوليو (01/07)",                         en: "July (01/07)"                      },
  octLabel:         { ar: "أكتوبر (01/10)",                        en: "October (01/10)"                   },
} as const;

export type StringKey = keyof typeof STRINGS;

export function t(lang: Lang, key: StringKey): string {
  return STRINGS[key][lang];
}

// Currency display helper
export interface CurrencyMeta {
  symbol: string;
  symbolEn: string;
  nameAr: string;
  nameEn: string;
}

export const CURRENCIES: Record<string, CurrencyMeta> = {
  SAR: { symbol: "ر.س", symbolEn: "SAR", nameAr: "ريال سعودي (SAR)", nameEn: "Saudi Riyal (SAR)" },
  USD: { symbol: "$",   symbolEn: "USD", nameAr: "دولار أمريكي (USD)", nameEn: "US Dollar (USD)" },
  EUR: { symbol: "€",   symbolEn: "EUR", nameAr: "يورو (EUR)",          nameEn: "Euro (EUR)"      },
  AED: { symbol: "د.إ", symbolEn: "AED", nameAr: "درهم إماراتي (AED)",  nameEn: "UAE Dirham (AED)" },
  GBP: { symbol: "£",   symbolEn: "GBP", nameAr: "جنيه إسترليني (GBP)", nameEn: "British Pound (GBP)" },
};

export function currencyName(code: string, lang: Lang): string {
  const c = CURRENCIES[code];
  if (!c) return code;
  return lang === "ar" ? c.nameAr : c.nameEn;
}

export function currencySymbol(code: string): string {
  return CURRENCIES[code]?.symbol ?? code;
}
