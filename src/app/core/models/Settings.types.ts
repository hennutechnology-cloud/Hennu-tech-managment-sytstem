// ============================================================
// Settings.types.ts
// ============================================================
import type { Lang } from "../i18n/settings.i18n";
export type { Lang };

// ── Data models ───────────────────────────────────────────────

export interface CompanyInfo {
  name: string;
  nameEn: string;
  taxNumber: string;
  commercialRegister: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  logo: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  avatar: string;
  language: Lang;
}

export interface NotificationSettings {
  emailAlerts: boolean;
  smsAlerts: boolean;
  pushAlerts: boolean;
  reportReady: boolean;
  budgetWarning: boolean;
  invoiceDue: boolean;
  systemUpdates: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  loginNotification: boolean;
  ipWhitelist: string;
}

export interface PreferencesSettings {
  currency: string;
  dateFormat: string;
  numberFormat: string;
  fiscalYearStart: string;
  theme: "dark" | "light";
  sidebarCollapsed: boolean;
}

export interface SystemSettings {
  backupFrequency: "daily" | "weekly" | "monthly";
  backupRetention: number;
  maintenanceMode: boolean;
  debugMode: boolean;
  apiRateLimit: number;
}

export interface SettingsData {
  company: CompanyInfo;
  user: UserProfile;
  notifications: NotificationSettings;
  security: SecuritySettings;
  preferences: PreferencesSettings;
  system: SystemSettings;
}

// ── Modal payloads ────────────────────────────────────────────

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ── Component Props (all receive lang) ───────────────────────

export interface SettingsHeaderProps {
  onSave: () => void;
  saving: boolean;
  isDirty: boolean;
  lang: Lang;
}

export interface CompanyInfoSectionProps {
  data: CompanyInfo;
  onChange: (d: CompanyInfo) => void;
  lang: Lang;
}

export interface UserProfileSectionProps {
  data: UserProfile;
  onChange: (d: UserProfile) => void;
  onChangePassword: () => void;
  onChangeAvatar: (base64: string) => void;
  lang: Lang;
}

export interface NotificationsSectionProps {
  data: NotificationSettings;
  onChange: (d: NotificationSettings) => void;
  lang: Lang;
}

export interface SecuritySectionProps {
  data: SecuritySettings;
  onChange: (d: SecuritySettings) => void;
  onChangePassword: () => void;
  onSetupTwoFactor: () => void;
  lang: Lang;
}

export interface PreferencesSectionProps {
  data: PreferencesSettings;
  onChange: (d: PreferencesSettings) => void;
  lang: Lang;
}

export interface SystemSectionProps {
  data: SystemSettings;
  onChange: (d: SystemSettings) => void;
  onBackupNow: () => void;
  onResetData: () => void;
  lang: Lang;
}

export interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: ChangePasswordPayload) => Promise<void>;
  lang: Lang;
}

export interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnable: (code: string) => Promise<void>;
  isEnabled: boolean;
  lang: Lang;
}

export interface ResetDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  lang: Lang;
}

export interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
}

export interface SaveSuccessToastProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
}
