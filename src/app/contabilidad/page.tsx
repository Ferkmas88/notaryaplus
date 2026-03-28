"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

export default function ContabilidadPage() {
  const { lang } = useLang();

  const services = [
    {
      titleKey: "contabilidad.s1.title",
      descKey: "contabilidad.s1.desc",
      items: [
        t("contabilidad.s1.i1", lang), t("contabilidad.s1.i2", lang), t("contabilidad.s1.i3", lang),
        t("contabilidad.s1.i4", lang), t("contabilidad.s1.i5", lang), t("contabilidad.s1.i6", lang),
      ],
    },
    {
      titleKey: "contabilidad.s2.title",
      descKey: "contabilidad.s2.desc",
      items: [
        t("contabilidad.s2.i1", lang), t("contabilidad.s2.i2", lang), t("contabilidad.s2.i3", lang),
        t("contabilidad.s2.i4", lang), t("contabilidad.s2.i5", lang),
      ],
    },
    {
      titleKey: "contabilidad.s3.title",
      descKey: "contabilidad.s3.desc",
      items: [
        t("contabilidad.s3.i1", lang), t("contabilidad.s3.i2", lang), t("contabilidad.s3.i3", lang),
        t("contabilidad.s3.i4", lang), t("contabilidad.s3.i5", lang),
      ],
    },
  ];

  const features = [
    { icon: "📊", titleKey: "contabilidad.feat1.title", descKey: "contabilidad.feat1.desc" },
    { icon: "💼", titleKey: "contabilidad.feat2.title", descKey: "contabilidad.feat2.desc" },
    { icon: "🔒", titleKey: "contabilidad.feat3.title", descKey: "contabilidad.feat3.desc" },
  ];

  return (
    <>
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">{t("contabilidad.breadcrumb", lang)}</Link>
            <span className="text-gray-600">/</span>
            <span className="text-gold text-sm">{t("contabilidad.breadcrumb.current", lang)}</span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("contabilidad.hero.title", lang)}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              {t("contabilidad.hero.desc", lang)}
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
            {services.map((service, i) => (
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
        </div>
      </section>

      <section className="bg-navy py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t("contabilidad.cta.title", lang)}
          </h2>
          <p className="text-gray-300 mb-8">
            {t("contabilidad.cta.desc", lang)}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/citas" className="btn-gold text-base px-8 py-4">
              {t("contabilidad.cta.btn1", lang)}
            </Link>
            <a href="tel:5026547076" className="btn-outline-white text-base px-8 py-4">
              {t("contabilidad.cta.btn2", lang)}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
