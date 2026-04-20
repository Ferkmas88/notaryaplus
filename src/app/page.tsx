"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";
import IRSStamp from "@/components/IRSStamp";

export default function Home() {
  const { lang } = useLang();

  const services = [
    {
      href: "/taxes",
      icon: (
        <svg className="w-7 h-7 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: t("home.service.taxes.title", lang),
      desc: t("home.service.taxes.desc", lang),
    },
    {
      href: "/notaria",
      icon: (
        <svg className="w-7 h-7 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: t("home.service.notaria.title", lang),
      desc: t("home.service.notaria.desc", lang),
    },
    {
      href: "/inmigracion",
      icon: (
        <svg className="w-7 h-7 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t("home.service.inmigracion.title", lang),
      desc: t("home.service.inmigracion.desc", lang),
    },
    {
      href: "/negocios",
      icon: (
        <svg className="w-7 h-7 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: t("home.service.negocios.title", lang),
      desc: t("home.service.negocios.desc", lang),
    },
    {
      href: "/traducciones",
      icon: (
        <svg className="w-7 h-7 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      ),
      title: t("home.service.traducciones.title", lang),
      desc: t("home.service.traducciones.desc", lang),
    },
    {
      href: "/taxes",
      icon: (
        <svg className="w-7 h-7 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      title: t("home.service.camioneros.title", lang),
      desc: t("home.service.camioneros.desc", lang),
    },
  ];

  const stats = [
    { value: "15+", label: t("home.stats.years", lang) },
    { value: "IRS", label: t("home.stats.irs", lang) },
    { value: "100%", label: t("home.stats.bilingual", lang) },
    { value: "24h", label: t("home.stats.response", lang) },
  ];

  const bullets = [
    t("home.about.bullet1", lang),
    t("home.about.bullet2", lang),
    t("home.about.bullet3", lang),
    t("home.about.bullet4", lang),
    t("home.about.bullet5", lang),
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 800 600" className="w-full h-full">
            <circle cx="700" cy="100" r="300" fill="#C8A214" />
            <circle cx="100" cy="500" r="200" fill="#C5E8D5" />
          </svg>
        </div>
        {/* Floating official stamp — visual cue of "this is real / official" */}
        <div className="hidden lg:block absolute top-16 right-16 z-10">
          <IRSStamp />
        </div>

        {/* Floating document — hero visual */}
        <div className="hidden xl:block absolute bottom-28 right-24 z-0 opacity-90 pointer-events-none">
          <div className="animate-doc-float">
            <svg viewBox="0 0 200 240" className="w-48 h-60 drop-shadow-2xl">
              <rect x="15" y="10" width="170" height="220" rx="6" fill="white" />
              <rect x="15" y="10" width="170" height="30" rx="6" fill="#1B3356" />
              <rect x="15" y="34" width="170" height="6" fill="#1B3356" />
              <line x1="30" y1="60" x2="160" y2="60" stroke="#1B3356" strokeOpacity="0.2" strokeWidth="1" />
              <line x1="30" y1="75" x2="130" y2="75" stroke="#1B3356" strokeOpacity="0.2" strokeWidth="1" />
              <line x1="30" y1="90" x2="150" y2="90" stroke="#1B3356" strokeOpacity="0.2" strokeWidth="1" />
              <line x1="30" y1="105" x2="100" y2="105" stroke="#1B3356" strokeOpacity="0.2" strokeWidth="1" />
              <line x1="30" y1="125" x2="160" y2="125" stroke="#1B3356" strokeOpacity="0.2" strokeWidth="1" />
              <line x1="30" y1="140" x2="140" y2="140" stroke="#1B3356" strokeOpacity="0.2" strokeWidth="1" />
              <line x1="30" y1="155" x2="120" y2="155" stroke="#1B3356" strokeOpacity="0.2" strokeWidth="1" />
              <rect x="30" y="180" width="60" height="24" rx="3" fill="#C8A214" fillOpacity="0.15" stroke="#C8A214" strokeWidth="1" />
              <text x="60" y="196" textAnchor="middle" fontSize="10" fontWeight="700" fill="#C8A214">FIRMA</text>
            </svg>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-5 pb-20 md:pt-9 md:pb-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 rounded-full px-4 py-1.5 mb-5">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
              <span className="text-gold text-sm font-medium">{t("home.badge", lang)}</span>
            </div>
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-3 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t("home.hero.title", lang)}
              <span className="block text-gold mt-1">{t("home.hero.subtitle", lang)}</span>
            </h1>
            {/* Owner signature line */}
            <div className="flex items-center gap-4 mb-6">
              <span className="h-px w-10 bg-gold/60"></span>
              <p
                className="text-lg md:text-xl text-gray-200 font-light italic"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t("home.hero.owner", lang)}{" "}
                <span className="not-italic font-semibold text-white tracking-wide">
                  Myrna Rodríguez
                </span>
              </p>
            </div>
            <p className="text-xl text-gray-300 mb-4 leading-relaxed">
              <span className="text-gold font-semibold">{t("home.hero.years", lang)}</span>{t("home.hero.desc", lang)}
            </p>
            <p className="text-gray-400 mb-8 flex items-center gap-2">
              <svg className="w-4 h-4 text-gold shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              {t("home.hero.address", lang)}
            </p>
            {/* Phone number buttons — compact, elegant, clickable */}
            <div className="mb-8">
              <p className="text-gold/90 text-xs uppercase tracking-[0.2em] font-semibold mb-3">
                {t("home.hero.callus", lang)}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:5026547076"
                  className="group inline-flex items-center gap-2.5 bg-white/5 hover:bg-gold border border-white/15 hover:border-gold rounded-full px-5 py-2.5 backdrop-blur-sm transition-all duration-200"
                >
                  <svg className="w-4 h-4 text-gold group-hover:text-navy transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.02l-2.2 2.19z"/>
                  </svg>
                  <span className="text-white group-hover:text-navy font-semibold text-base tracking-wide transition-colors">
                    (502) 654-7076
                  </span>
                </a>
                <a
                  href="tel:5026441312"
                  className="group inline-flex items-center gap-2.5 bg-white/5 hover:bg-gold border border-white/15 hover:border-gold rounded-full px-5 py-2.5 backdrop-blur-sm transition-all duration-200"
                >
                  <svg className="w-4 h-4 text-gold group-hover:text-navy transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.02l-2.2 2.19z"/>
                  </svg>
                  <span className="text-white group-hover:text-navy font-semibold text-base tracking-wide transition-colors">
                    (502) 644-1312
                  </span>
                </a>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-6">
              <Link href="/citas" className="btn-gold text-base">
                {t("home.hero.cta1", lang)}
              </Link>
              <Link href="/servicios" className="btn-outline-white text-base">
                {t("home.hero.cta2", lang)}
              </Link>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 80Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center group">
                <div
                  className="text-5xl md:text-7xl font-bold text-gold mb-2 leading-none group-hover:scale-105 transition-transform duration-300"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {s.value}
                </div>
                <div className="w-10 h-0.5 bg-gold/40 mx-auto mb-3"></div>
                <div className="text-sm md:text-base text-gray-600 font-medium uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-mint-light py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="section-title">{t("home.services.title", lang)}</h2>
            <p className="section-subtitle">
              {t("home.services.subtitle", lang)}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <Link key={s.title} href={s.href} className="group">
                <div className="card h-full group-hover:-translate-y-1 transition-transform duration-300">
                  <div className="service-icon">{s.icon}</div>
                  <h3 className="text-xl font-bold text-navy mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {s.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <span className="text-gold font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    {t("home.services.more", lang)}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Myrna */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-gold/10 text-gold font-semibold text-sm px-4 py-1.5 rounded-full mb-4">
                {t("home.about.tag", lang)}
              </div>
              <h2 className="section-title">{t("home.about.title", lang)}</h2>
              <p className="text-gray-700 mb-4 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t("home.about.p1", lang) }}
              />
              <p className="text-gray-700 mb-6 leading-relaxed">
                {t("home.about.p2", lang)}
              </p>
              <ul className="space-y-3 mb-8">
                {bullets.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-gold" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/citas" className="btn-gold inline-block">
                {t("home.about.cta", lang)}
              </Link>
            </div>
            <div className="relative">
              <div className="bg-mint rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-navy/10 rounded-full translate-y-6 -translate-x-6"></div>
                <div className="relative text-center">
                  <div
                    className="w-32 h-32 bg-navy rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl"
                  >
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3
                    className="text-2xl font-bold text-navy mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {t("home.about.title", lang)}
                  </h3>
                  <p className="text-gold font-semibold mb-1">{t("home.about.role", lang)}</p>
                  <p className="text-gray-600 text-sm mb-6">{t("home.about.role2", lang)}</p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-2xl font-bold text-navy" style={{ fontFamily: "'Playfair Display', serif" }}>15+</div>
                      <div className="text-xs text-gray-500">{t("home.about.exp", lang)}</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="text-2xl font-bold text-gold" style={{ fontFamily: "'Playfair Display', serif" }}>IRS</div>
                      <div className="text-xs text-gray-500">{t("home.about.cert", lang)}</div>
                    </div>
                  </div>
                  <div className="mt-4 bg-white rounded-xl p-4 shadow-sm">
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold text-navy">Horario:</span> {t("home.about.schedule", lang)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <section className="bg-mint-light py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-4">
            <h2 className="section-title">{t("reviews.title", lang)}</h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-gold text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>4.2</span>
              <div className="flex gap-0.5">
                {[1,2,3,4].map((i) => (
                  <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
                <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" opacity="0.4"/>
                </svg>
              </div>
              <span className="text-gray-600 text-sm font-medium">· {t("reviews.subtitle", lang)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {/* Review 1 */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm shrink-0">MG</div>
                <div>
                  <p className="font-semibold text-navy text-sm">María G.</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {[1,2,3,4,5].map((i) => (
                      <svg key={i} className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {lang === "es"
                  ? "Myrna es excelente. Hizo mis taxes por 5 años y siempre me ha dado el mejor servicio. Muy profesional y honesta."
                  : "Myrna is excellent. She has done my taxes for 5 years and always gives the best service. Very professional and honest."}
              </p>
            </div>

            {/* Review 2 */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm shrink-0">CR</div>
                <div>
                  <p className="font-semibold text-navy text-sm">Carlos R.</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {[1,2,3,4,5].map((i) => (
                      <svg key={i} className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {lang === "es"
                  ? "Gracias a Myrna pude obtener mi ITIN y registrar mi negocio sin complicaciones. Habla español y entiende perfectamente las necesidades de la comunidad."
                  : "Thanks to Myrna I was able to get my ITIN and register my business without complications. She speaks Spanish and perfectly understands community needs."}
              </p>
            </div>

            {/* Review 3 */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm shrink-0">AL</div>
                <div>
                  <p className="font-semibold text-navy text-sm">Ana L.</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {[1,2,3,4,5].map((i) => (
                      <svg key={i} className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {lang === "es"
                  ? "Llevé mis documentos de inmigración y los llenó perfectamente. Muy atenta, explica todo paso a paso. La recomiendo 100%."
                  : "I brought my immigration documents and she filled them out perfectly. Very attentive, explains everything step by step. 100% recommend."}
              </p>
            </div>

            {/* Review 4 */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm shrink-0">RM</div>
                <div>
                  <p className="font-semibold text-navy text-sm">Roberto M.</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {[1,2,3,4,5].map((i) => (
                      <svg key={i} className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {lang === "es"
                  ? "El mejor servicio de taxes en Louisville. Rápido, confiable y bilingüe. Llevo 8 años siendo cliente."
                  : "The best tax service in Louisville. Fast, reliable and bilingual. I've been a client for 8 years."}
              </p>
            </div>

            {/* Review 5 */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm shrink-0">YP</div>
                <div>
                  <p className="font-semibold text-navy text-sm">Yolanda P.</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {[1,2,3,4].map((i) => (
                      <svg key={i} className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                    <svg className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" opacity="0.4"/>
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {lang === "es"
                  ? "Muy buen servicio de traducción de documentos. Precios justos y entrega rápida. Definitivamente vuelvo."
                  : "Very good document translation service. Fair prices and quick delivery. Definitely coming back."}
              </p>
            </div>

            {/* CTA card */}
            <div className="bg-navy rounded-2xl shadow-md p-6 flex flex-col items-center justify-center gap-4 text-center">
              <svg className="w-10 h-10 text-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <p className="text-white font-semibold text-base leading-snug">
                {lang === "es"
                  ? "¿Quedaste satisfecho con nuestro servicio? ¡Tu opinión nos ayuda a crecer!"
                  : "Happy with our service? Your review helps us grow!"}
              </p>
              <a
                href="https://g.page/r/CUOfHKzZzu4UEBM/review"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-sm px-6 py-3 w-full text-center"
              >
                {t("reviews.cta", lang)}
              </a>
              <a
                href="https://g.page/r/CUOfHKzZzu4UEBM/review"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/80 text-xs underline hover:text-gold transition-colors"
              >
                {t("reviews.viewall", lang)}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-navy py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t("home.cta.title", lang)}
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            {t("home.cta.desc", lang)}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/citas" className="btn-gold text-base px-8 py-4">
              {t("home.cta.btn1", lang)}
            </Link>
            <a href="tel:5026547076" className="btn-outline-white text-base px-8 py-4">
              {t("home.cta.btn2", lang)}
            </a>
          </div>
        </div>
      </section>

      {/* Map strip */}
      <section className="h-64">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3144.4!2d-85.6521!3d38.1542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s8514+Preston+Hwy+Louisville+KY+40219!5e0!3m2!1ses!2sus!4v1"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={t("home.map.title", lang)}
        ></iframe>
      </section>
    </>
  );
}
