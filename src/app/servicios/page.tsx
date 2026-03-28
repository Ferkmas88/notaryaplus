"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

export default function ServiciosPage() {
  const { lang } = useLang();

  const allServices = [
    {
      href: "/taxes",
      color: "bg-blue-50 border-blue-200",
      titleKey: "servicios.taxes.title",
      items: [
        t("servicios.taxes.i1", lang), t("servicios.taxes.i2", lang), t("servicios.taxes.i3", lang),
        t("servicios.taxes.i4", lang), t("servicios.taxes.i5", lang), t("servicios.taxes.i6", lang),
      ],
    },
    {
      href: "/notaria",
      color: "bg-purple-50 border-purple-200",
      titleKey: "servicios.notaria.title",
      items: [
        t("servicios.notaria.i1", lang), t("servicios.notaria.i2", lang), t("servicios.notaria.i3", lang),
        t("servicios.notaria.i4", lang), t("servicios.notaria.i5", lang),
      ],
    },
    {
      href: "/inmigracion",
      color: "bg-green-50 border-green-200",
      titleKey: "servicios.inmigracion.title",
      items: [
        t("servicios.inmigracion.i1", lang), t("servicios.inmigracion.i2", lang), t("servicios.inmigracion.i3", lang),
        t("servicios.inmigracion.i4", lang), t("servicios.inmigracion.i5", lang), t("servicios.inmigracion.i6", lang),
      ],
    },
    {
      href: "/negocios",
      color: "bg-orange-50 border-orange-200",
      titleKey: "servicios.negocios.title",
      items: [
        t("servicios.negocios.i1", lang), t("servicios.negocios.i2", lang), t("servicios.negocios.i3", lang),
        t("servicios.negocios.i4", lang), t("servicios.negocios.i5", lang),
      ],
    },
    {
      href: "/traducciones",
      color: "bg-teal-50 border-teal-200",
      titleKey: "servicios.traducciones.title",
      items: [
        t("servicios.traducciones.i1", lang), t("servicios.traducciones.i2", lang), t("servicios.traducciones.i3", lang),
        t("servicios.traducciones.i4", lang), t("servicios.traducciones.i5", lang),
      ],
    },
  ];

  return (
    <>
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t("servicios.hero.title", lang)}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {t("servicios.hero.desc", lang)}
          </p>
        </div>
      </section>

      <section className="bg-mint-light py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allServices.map((s) => (
              <Link key={s.titleKey} href={s.href} className="group">
                <div className={`card border ${s.color} h-full group-hover:-translate-y-1 transition-transform`}>
                  <h3 className="text-xl font-bold text-navy mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t(s.titleKey, lang)}
                  </h3>
                  <ul className="space-y-2">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-gold shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-gold font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t("servicios.detail", lang)}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t("servicios.cta.title", lang)}
          </h2>
          <p className="text-gray-300 mb-8">
            {t("servicios.cta.desc", lang)}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/citas" className="btn-gold">{t("servicios.cta.btn1", lang)}</Link>
            <Link href="/contacto" className="btn-outline-white">{t("servicios.cta.btn2", lang)}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
