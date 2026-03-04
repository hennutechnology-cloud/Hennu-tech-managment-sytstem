// ============================================================
// Settings.service.ts
// Static in-memory data — swap each function for a fetch() call
// ============================================================
import type { SettingsData, ChangePasswordPayload } from "../models/Settings.types";

const STATIC: SettingsData = {
  company: {
    name: "هينو تك", nameEn: "Hennu Tech",
    taxNumber: "300123456700003", commercialRegister: "1010123456",
    phone: "+966 11 234 5678", email: "info@hennutech.com",
    address: "الرياض، حي العليا، شارع الملك فهد",
    website: "https://www.hennutech.com", logo: "",
  },
  user: {
    fullName: "محمد عبدالله الأحمدي", email: "m.ahmadi@hennutech.com",
    phone: "+966 50 123 4567", jobTitle: "مدير مالي",
    department: "الإدارة المالية", avatar: "", language: "ar",
  },
  notifications: {
    emailAlerts: true, smsAlerts: false, pushAlerts: true,
    reportReady: true, budgetWarning: true, invoiceDue: true, systemUpdates: false,
  },
  security: {
    twoFactorEnabled: false, sessionTimeout: 30,
    loginNotification: true, ipWhitelist: "",
  },
  preferences: {
    currency: "SAR", dateFormat: "DD/MM/YYYY",
    numberFormat: "1,234.56", fiscalYearStart: "01-01",
    theme: "dark", sidebarCollapsed: false,
  },
  system: {
    backupFrequency: "daily", backupRetention: 30,
    maintenanceMode: false, debugMode: false, apiRateLimit: 1000,
  },
};

function delay(ms: number) { return new Promise<void>((r) => setTimeout(r, ms)); }

// TODO (API): GET /api/settings
export async function fetchSettings(): Promise<SettingsData> {
  await delay(250);
  return JSON.parse(JSON.stringify(STATIC)) as SettingsData;
}

// TODO (API): PUT /api/settings
export async function saveSettings(data: SettingsData): Promise<void> {
  await delay(700);
  Object.assign(STATIC, JSON.parse(JSON.stringify(data)));
}

// TODO (API): POST /api/settings/password
export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await delay(800);
  if (!payload.currentPassword) throw new Error("wrong_password");
}

// TODO (API): POST /api/settings/2fa/setup
export async function setupTwoFactor(code: string): Promise<void> {
  await delay(600);
  if (code.length !== 6) throw new Error("invalid_code");
  STATIC.security.twoFactorEnabled = true;
}

// TODO (API): POST /api/settings/backup
export async function triggerBackup(): Promise<void> { await delay(2000); }

// TODO (API): DELETE /api/settings/data
export async function resetAllData(): Promise<void> { await delay(1500); }
