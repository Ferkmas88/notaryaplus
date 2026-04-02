"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type Lang = "es" | "en";

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  ready: boolean;
}

const LangContext = createContext<LangContextType>({
  lang: "es",
  setLang: () => {},
  ready: false,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored === "es" || stored === "en") {
      setLangState(stored);
    }
    setReady(true);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("lang", l);
  }

  return (
    <LangContext.Provider value={{ lang, setLang, ready }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
