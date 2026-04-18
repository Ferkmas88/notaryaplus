"use client";

import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

type Variant = "banner" | "compact";

export default function UplDisclaimer({ variant = "banner" }: { variant?: Variant }) {
  const { lang } = useLang();

  if (variant === "compact") {
    return (
      <div className="flex items-start gap-2 bg-mint-light border border-gold/60 rounded-lg px-3 py-2 text-xs text-navy">
        <svg className="w-4 h-4 text-gold shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
        <p className="leading-snug">
          <strong>{t("legal.upl.shortTitle", lang)}:</strong> {t("legal.upl.short", lang)}
        </p>
      </div>
    );
  }

  return (
    <section className="bg-mint-light border-y-2 border-gold">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-gold shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          <div>
            <p className="text-sm md:text-base font-semibold text-navy mb-1">
              {t("legal.upl.title", lang)}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {t("legal.upl.body", lang)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
