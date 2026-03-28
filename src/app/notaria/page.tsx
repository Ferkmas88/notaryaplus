"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

export default function NotariaPage() {
  const { lang } = useLang();

  const notaryServices = [
    {
      titleKey: "notaria.s1.title",
      descKey: "notaria.s1.desc",
      items: [
        t("notaria.s1.i1", lang), t("notaria.s1.i2", lang), t("notaria.s1.i3", lang),
        t("notaria.s1.i4", lang), t("notaria.s1.i5", lang), t("notaria.s1.i6", lang),
      ],
    },
    {
      titleKey: "notaria.s2.title",
      descKey: "notaria.s2.desc",
      items: [
        t("notaria.s2.i1", lang), t("notaria.s2.i2", lang), t("notaria.s2.i3", lang),
        t("notaria.s2.i4", lang), t("notaria.s2.i5", lang),
      ],
    },
    {
      titleKey: "notaria.s3.title",
      descKey: "notaria.s3.desc",
      items: [
        t("notaria.s3.i1", lang), t("notaria.s3.i2", lang), t("notaria.s3.i3", lang),
        t("notaria.s3.i4", lang), t("notaria.s3.i5", lang),
      ],
    },
  ];

  const bringItems = [
    t("notaria.bring.i1", lang),
    t("notaria.bring.i2", lang),
    t("notaria.bring.i3", lang),
    t("notaria.bring.i4", lang),
  ];

  return (
    <>
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">{t("notaria.breadcrumb", lang)}</Link>
            <span className="text-gray-600">/</span>
            <span className="text-gold text-sm">{t("notaria.breadcrumb.current", lang)}</span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("notaria.hero.title", lang)}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              {t("notaria.hero.desc", lang)}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-mint-light py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-mint mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t("notaria.info.title", lang)}
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {t("notaria.info.desc", lang)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {notaryServices.map((service, i) => (
              <div key={service.titleKey} className="card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gold text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-navy" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t(service.titleKey, lang)}
                  </h3>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">{t(service.descKey, lang)}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-gold shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gold/10 border border-gold/30 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-navy mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("notaria.bring.title", lang)}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {bringItems.map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-gold shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t("notaria.cta.title", lang)}
          </h2>
          <p className="text-gray-300 mb-8">
            {t("notaria.cta.desc", lang)}
          </p>
          <Link href="/citas" className="btn-gold text-base px-8 py-4">
            {t("notaria.cta.btn", lang)}
          </Link>
        </div>
      </section>
    </>
  );
}
