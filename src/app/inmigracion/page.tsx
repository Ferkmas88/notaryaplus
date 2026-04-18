"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";
import UplDisclaimer from "@/components/UplDisclaimer";

export default function InmigracionPage() {
  const { lang } = useLang();

  const immigrationServices = [
    {
      titleKey: "inmigracion.s1.title",
      descKey: "inmigracion.s1.desc",
      items: [
        t("inmigracion.s1.i1", lang), t("inmigracion.s1.i2", lang), t("inmigracion.s1.i3", lang),
        t("inmigracion.s1.i4", lang), t("inmigracion.s1.i5", lang),
      ],
      noteKey: "inmigracion.s1.note" as string | null,
    },
    {
      titleKey: "inmigracion.s2.title",
      descKey: "inmigracion.s2.desc",
      items: [
        t("inmigracion.s2.i1", lang), t("inmigracion.s2.i2", lang), t("inmigracion.s2.i3", lang),
        t("inmigracion.s2.i4", lang), t("inmigracion.s2.i5", lang),
      ],
      noteKey: null,
    },
    {
      titleKey: "inmigracion.s3.title",
      descKey: "inmigracion.s3.desc",
      items: [
        t("inmigracion.s3.i1", lang), t("inmigracion.s3.i2", lang), t("inmigracion.s3.i3", lang),
        t("inmigracion.s3.i4", lang), t("inmigracion.s3.i5", lang),
      ],
      noteKey: null,
    },
    {
      titleKey: "inmigracion.s4.title",
      descKey: "inmigracion.s4.desc",
      items: [
        t("inmigracion.s4.i1", lang), t("inmigracion.s4.i2", lang), t("inmigracion.s4.i3", lang),
        t("inmigracion.s4.i4", lang), t("inmigracion.s4.i5", lang),
      ],
      noteKey: null,
    },
    {
      titleKey: "inmigracion.s5.title",
      descKey: "inmigracion.s5.desc",
      items: [
        t("inmigracion.s5.i1", lang), t("inmigracion.s5.i2", lang), t("inmigracion.s5.i3", lang),
        t("inmigracion.s5.i4", lang), t("inmigracion.s5.i5", lang),
      ],
      noteKey: null,
    },
  ];

  return (
    <>
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">{t("inmigracion.breadcrumb", lang)}</Link>
            <span className="text-gray-600">/</span>
            <span className="text-gold text-sm">{t("inmigracion.breadcrumb.current", lang)}</span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("inmigracion.hero.title", lang)}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              {t("inmigracion.hero.desc", lang)}
            </p>
          </div>
        </div>
      </section>

      <UplDisclaimer variant="banner" />

      <section className="bg-mint-light py-10 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-6">
            {immigrationServices.map((service, i) => (
              <div key={service.titleKey} className="card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gold text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    {i + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-navy" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t(service.titleKey, lang)}
                  </h3>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">{t(service.descKey, lang)}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {service.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-gold shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>
                {service.noteKey && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
                    <strong>{t("inmigracion.note", lang)}:</strong> {t(service.noteKey, lang)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t("inmigracion.cta.title", lang)}
          </h2>
          <p className="text-gray-300 mb-8">
            {t("inmigracion.cta.desc", lang)}
          </p>
          <Link href="/citas" className="btn-gold text-base px-8 py-4">
            {t("inmigracion.cta.btn", lang)}
          </Link>
        </div>
      </section>
    </>
  );
}
