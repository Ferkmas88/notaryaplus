"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

export default function NegociosPage() {
  const { lang } = useLang();

  const businessServices = [
    {
      titleKey: "negocios.s1.title",
      descKey: "negocios.s1.desc",
      items: [
        t("negocios.s1.i1", lang), t("negocios.s1.i2", lang), t("negocios.s1.i3", lang),
        t("negocios.s1.i4", lang), t("negocios.s1.i5", lang), t("negocios.s1.i6", lang),
      ],
      docs: [t("negocios.s1.d1", lang), t("negocios.s1.d2", lang), t("negocios.s1.d3", lang), t("negocios.s1.d4", lang)],
    },
    {
      titleKey: "negocios.s2.title",
      descKey: "negocios.s2.desc",
      items: [
        t("negocios.s2.i1", lang), t("negocios.s2.i2", lang), t("negocios.s2.i3", lang),
        t("negocios.s2.i4", lang), t("negocios.s2.i5", lang), t("negocios.s2.i6", lang),
      ],
      docs: [],
    },
    {
      titleKey: "negocios.s3.title",
      descKey: "negocios.s3.desc",
      items: [
        t("negocios.s3.i1", lang), t("negocios.s3.i2", lang), t("negocios.s3.i3", lang),
        t("negocios.s3.i4", lang), t("negocios.s3.i5", lang),
      ],
      docs: [t("negocios.s3.d1", lang), t("negocios.s3.d2", lang), t("negocios.s3.d3", lang)],
    },
    {
      titleKey: "negocios.s4.title",
      descKey: "negocios.s4.desc",
      items: [
        t("negocios.s4.i1", lang), t("negocios.s4.i2", lang), t("negocios.s4.i3", lang),
        t("negocios.s4.i4", lang), t("negocios.s4.i5", lang),
      ],
      docs: [],
    },
  ];

  return (
    <>
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">{t("negocios.breadcrumb", lang)}</Link>
            <span className="text-gray-600">/</span>
            <span className="text-gold text-sm">{t("negocios.breadcrumb.current", lang)}</span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t("negocios.hero.title", lang)}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              {t("negocios.hero.desc", lang)}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-mint-light py-10 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-6">
            {businessServices.map((service, i) => (
              <div key={service.titleKey} className="card">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
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
                  {service.docs.length > 0 && (
                    <div className="bg-mint-light rounded-xl p-4 border border-mint">
                      <h4 className="font-semibold text-navy mb-3 text-sm">{t("negocios.docs.title", lang)}</h4>
                      <ul className="space-y-2">
                        {service.docs.map((doc) => (
                          <li key={doc} className="text-sm text-gray-600 flex items-start gap-2">
                            <svg className="w-3 h-3 text-navy mt-1 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t("negocios.cta.title", lang)}
          </h2>
          <p className="text-gray-300 mb-8">
            {t("negocios.cta.desc", lang)}
          </p>
          <Link href="/citas" className="btn-gold text-base px-8 py-4">
            {t("negocios.cta.btn", lang)}
          </Link>
        </div>
      </section>
    </>
  );
}
