"use client";

import { useState } from "react";
import Link from "next/link";
import { useConsent } from "@/components/ConsentProvider";
import { useLang } from "@/contexts/LangContext";

// Textos mínimos ES/EN. Audiencia principal es latina, pero el sitio ya es bilingüe
// vía LangContext, así que respetamos el toggle actual.
const T = {
  es: {
    title: "Usamos cookies",
    message:
      "Para mejorar tu experiencia. Las necesarias son obligatorias; análisis y marketing, opcionales.",
    policy: "Ver política",
    accept: "Aceptar todas",
    reject: "Solo necesarias",
    customize: "Personalizar",
    save: "Guardar preferencias",
    back: "Volver",
    cats: {
      necessary: {
        title: "Necesarias",
        desc: "Requeridas para que el sitio funcione (idioma, formulario de citas, sesión). No se pueden desactivar.",
      },
      analytics: {
        title: "Análisis",
        desc: "Google Analytics 4. Nos ayuda a entender qué páginas funcionan y dónde mejorar.",
      },
      marketing: {
        title: "Marketing",
        desc: "Reservado para futuras campañas (Meta Pixel, Google Ads). Hoy no hay scripts cargados.",
      },
    },
  },
  en: {
    title: "We use cookies",
    message:
      "To improve your experience. Necessary cookies are required; analytics and marketing are optional.",
    policy: "View policy",
    accept: "Accept all",
    reject: "Only necessary",
    customize: "Customize",
    save: "Save preferences",
    back: "Back",
    cats: {
      necessary: {
        title: "Necessary",
        desc: "Required for the site to work (language, appointment form, session). Cannot be disabled.",
      },
      analytics: {
        title: "Analytics",
        desc: "Google Analytics 4. Helps us understand which pages work and where to improve.",
      },
      marketing: {
        title: "Marketing",
        desc: "Reserved for future campaigns (Meta Pixel, Google Ads). No scripts are loaded today.",
      },
    },
  },
} as const;

export default function CookieBanner() {
  const { hydrated, hasDecided, acceptAll, rejectAll, save, consent } = useConsent();
  const { lang } = useLang();
  const t = T[lang];

  const [showCustomize, setShowCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(consent.analytics);
  const [marketing, setMarketing] = useState(consent.marketing);

  // No renderizar hasta hidratar — evita mismatch SSR y evita parpadeo
  // del banner a usuarios que ya aceptaron.
  if (!hydrated) return null;
  if (hasDecided) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={lang === "es" ? "Aviso de cookies" : "Cookie notice"}
      className="fixed bottom-3 left-3 right-3 z-[100] sm:right-auto sm:bottom-4 sm:left-4 sm:w-[22rem] rounded-2xl border border-white/10 bg-[#1B3356] text-white shadow-2xl backdrop-blur-sm animate-slide-up-fade origin-bottom-left"
    >
      <div className="px-4 py-4 sm:px-5 sm:py-4">
        {!showCustomize ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <span className="shrink-0 text-xl leading-none mt-0.5" aria-hidden>🍪</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight mb-1">{t.title}</p>
                <p className="text-xs leading-relaxed text-white/80">
                  {t.message}{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-[#C8A214] underline underline-offset-2 hover:opacity-90"
                  >
                    {t.policy}
                  </Link>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={acceptAll}
              className="w-full rounded-lg bg-[#C8A214] px-4 py-2.5 text-sm font-bold text-[#1B3356] transition hover:brightness-110 shadow-sm"
            >
              {t.accept}
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={rejectAll}
                className="flex-1 rounded-lg border border-white/25 bg-white/5 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10"
              >
                {t.reject}
              </button>
              <button
                type="button"
                onClick={() => setShowCustomize(true)}
                className="flex-1 rounded-lg border border-white/25 bg-white/5 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10"
              >
                {t.customize}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="font-semibold text-sm">{lang === "es" ? "Tus preferencias" : "Your preferences"}</p>
            <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
              <CategoryRow
                title={t.cats.necessary.title}
                desc={t.cats.necessary.desc}
                checked
                disabled
                onChange={() => {}}
              />
              <CategoryRow
                title={t.cats.analytics.title}
                desc={t.cats.analytics.desc}
                checked={analytics}
                onChange={setAnalytics}
              />
              <CategoryRow
                title={t.cats.marketing.title}
                desc={t.cats.marketing.desc}
                checked={marketing}
                onChange={setMarketing}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link
                href="/privacy"
                className="text-xs text-[#C8A214] underline underline-offset-2"
              >
                {t.policy}
              </Link>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomize(false)}
                  className="rounded-md border border-white/40 bg-transparent px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  {t.back}
                </button>
                <button
                  type="button"
                  onClick={() => save({ analytics, marketing })}
                  className="rounded-md bg-[#C8A214] px-4 py-2 text-sm font-semibold text-[#1B3356] transition hover:brightness-110"
                >
                  {t.save}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryRow({
  title,
  desc,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-md border border-white/15 bg-white/5 p-3 text-sm transition ${
        disabled ? "opacity-70" : "hover:border-white/30 hover:bg-white/10"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#C8A214]"
      />
      <span className="flex flex-col gap-0.5">
        <span className="font-semibold">{title}</span>
        <span className="text-xs leading-snug text-white/80">{desc}</span>
      </span>
    </label>
  );
}
