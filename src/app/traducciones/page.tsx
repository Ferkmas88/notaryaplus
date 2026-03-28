"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

export default function TraduccionesPage() {
  const { lang } = useLang();

  const translationServices = [
    {
      titleKey: "traducciones.s1.title",
      descKey: "traducciones.s1.desc",
      items: [
        t("traducciones.s1.i1", lang), t("traducciones.s1.i2", lang), t("traducciones.s1.i3", lang),
        t("traducciones.s1.i4", lang), t("traducciones.s1.i5", lang), t("traducciones.s1.i6", lang),
      ],
    },
    {
      titleKey: "traducciones.s2.title",
      descKey: "traducciones.s2.desc",
      items: [
        t("traducciones.s2.i1", lang), t("traducciones.s2.i2", lang), t("traducciones.s2.i3", lang),
        t("traducciones.s2.i4", lang), t("traducciones.s2.i5", lang),
      ],
    },
    {
      titleKey: "traducciones.s3.title",
      descKey: "traducciones.s3.desc",
      items: [
        t("traducciones.s3.i1", lang), t("traducciones.s3.i2", lang), t("traducciones.s3.i3", lang),
        t("traducciones.s3.i4", lang), t("traducciones.s3.i5", lang),
      ],
    },
    {
      titleKey: "traducciones.s4.title",
      descKey: "traducciones.s4.desc",
      items: [
        t("traducciones.s4.i1", lang), t("traducciones.s4.i2", lang), t("traducciones.s4.i3", lang),
        t("traducciones.s4.i4", lang), t("traducciones.s4.i5", lang),
      ],
    },
  ];

  const features = [
    { icon: "🎯", titleKey: "traducciones.feat1.title", descKey: "traducciones.feat1.desc" },
    { icon: "⚡", titleKey: "traducciones.feat2.title", descKey: "traducciones.feat2.desc" },
    { icon: "✅", titleKey: "traducciones.feat3.title", descKey: "traducciones.feat3.desc" },
  ];

  const processSteps = [
    { step: "1", textKey: "traducciones.process.s1" },
    { step: "2", textKey: "traducciones.process.s2" },
    { step: "3", textKey: "traducciones.process.s3" },
    { step: "4", textKey: "traducciones.process.s4" },
  ];

  return (
    <>
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">{t("traducciones.breadcrumb", lang)}</Link>
            <span className="text-gray-600">/</span>
            <span className="text-gold text-sm">{t("traducciones.breadcrumb.current", lang)}</span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("traducciones.hero.title", lang)}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              {t("traducciones.hero.desc", lang)}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-mint-light py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {features.map((item) => (
              <div key={item.titleKey} className="card text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-navy mb-2">{t(item.titleKey, lang)}</h3>
                <p className="text-sm text-gray-600">{t(item.descKey, lang)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {translationServices.map((service, i) => (
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

          <div className="mt-8 bg-white border border-mint rounded-2xl p-6">
            <h3 className="text-lg font-bold text-navy mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("traducciones.process.title", lang)}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {processSteps.map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-navy text-gold rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    {item.step}
                  </div>
                  <p className="text-sm text-gray-700 pt-1">{t(item.textKey, lang)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t("traducciones.cta.title", lang)}
          </h2>
          <p className="text-gray-300 mb-8">
            {t("traducciones.cta.desc", lang)}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/citas" className="btn-gold text-base px-8 py-4">
              {t("traducciones.cta.btn1", lang)}
            </Link>
            <a href="tel:5026547076" className="btn-outline-white text-base px-8 py-4">
              {t("traducciones.cta.btn2", lang)}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
