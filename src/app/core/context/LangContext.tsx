// ============================================================
// LangContext.tsx — shared language state across the whole app
// ============================================================
import { createContext, useContext, useState, useCallback } from "react";
import type { Lang } from "../models/Settings.types";

const LANG_STORAGE_KEY = "app_ui_language";

function getStoredLang(): Lang {
  try {
    return (localStorage.getItem(LANG_STORAGE_KEY) as Lang) ?? "ar";
  } catch {
    return "ar";
  }
}

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getStoredLang);

  const setLang = useCallback((newLang: Lang) => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch { /* storage unavailable */ }
    setLangState(newLang);
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}
