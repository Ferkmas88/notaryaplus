"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { lang, setLang } = useLang();

  const links = [
    { href: "/", label: t("nav.inicio", lang) },
    { href: "/taxes", label: t("nav.taxes", lang) },
    { href: "/notaria", label: t("nav.notaria", lang) },
    { href: "/inmigracion", label: t("nav.inmigracion", lang) },
    { href: "/negocios", label: t("nav.negocios", lang) },
    { href: "/traducciones", label: t("nav.traducciones", lang) },
    { href: "/contabilidad", label: t("nav.contabilidad", lang) },
    { href: "/contacto", label: t("nav.contacto", lang) },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Contact bar - hidden on mobile */}
      <div className="hidden md:block bg-navy-dark text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <a href="tel:5026547076" className="flex items-center gap-1 hover:text-gold transition-colors">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              (502) 654-7076
            </a>
            <a href="tel:5026441312" className="flex items-center gap-1 hover:text-gold transition-colors">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              (502) 644-1312
            </a>
            <a href="mailto:notaryaplus26@gmail.com" className="flex items-center gap-1 hover:text-gold transition-colors">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              notaryaplus26@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gold font-medium">
              {t("nav.horario", lang)}
            </span>
            {/* Language toggle desktop */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLang("es")}
                className={`text-xs px-2 py-0.5 rounded font-semibold transition-colors ${lang === "es" ? "text-gold border border-gold" : "text-gray-400 hover:text-white"}`}
              >
                ES
              </button>
              <button
                onClick={() => setLang("en")}
                className={`text-xs px-2 py-0.5 rounded font-semibold transition-colors ${lang === "en" ? "text-gold border border-gold" : "text-gray-400 hover:text-white"}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="bg-navy shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-gold flex items-center justify-center bg-white">
              <svg viewBox="0 0 40 40" className="w-9 h-9">
                <circle cx="20" cy="20" r="18" fill="none" stroke="#C8A214" strokeWidth="2.5"/>
                <path d="M10 20 L17 27 L30 13" stroke="#1B3356" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                3-1 NOTARY A PLUS
              </div>
              <div className="text-gold text-xs leading-tight">Business & Tax Services</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === l.href
                    ? "text-gold"
                    : "text-gray-200 hover:text-white hover:bg-navy-light"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/citas"
              className="ml-3 bg-gold text-white font-semibold px-5 py-2 rounded-full text-sm hover:bg-gold-light transition-colors shadow-md"
            >
              {t("nav.agendar", lang)}
            </Link>
          </div>

          {/* Mobile: language toggle + hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Language toggle always visible on mobile */}
            <div className="flex items-center gap-1 mr-1">
              <button
                onClick={() => setLang("es")}
                className={`text-xs px-2.5 py-1 rounded font-bold transition-colors ${lang === "es" ? "bg-gold text-white" : "text-gray-400 border border-gray-500"}`}
              >
                ES
              </button>
              <button
                onClick={() => setLang("en")}
                className={`text-xs px-2.5 py-1 rounded font-bold transition-colors ${lang === "en" ? "bg-gold text-white" : "text-gray-400 border border-gray-500"}`}
              >
                EN
              </button>
            </div>
            {/* Hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="text-white p-2"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden bg-navy-dark border-t border-navy-light px-4 pb-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block py-3 text-sm font-medium border-b border-navy-light ${
                  pathname === l.href ? "text-gold" : "text-gray-200"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/citas"
              onClick={() => setOpen(false)}
              className="mt-4 block text-center bg-gold text-white font-semibold px-5 py-3 rounded-full text-sm"
            >
              {t("nav.agendar", lang)}
            </Link>
            {/* Contact info on mobile menu */}
            <div className="mt-4 pt-4 border-t border-navy-light space-y-2 text-center">
              <a href="tel:5026547076" className="block text-sm text-gray-300 hover:text-gold transition-colors">
                (502) 654-7076
              </a>
              <a href="tel:5026441312" className="block text-sm text-gray-300 hover:text-gold transition-colors">
                (502) 644-1312
              </a>
              <a href="mailto:notaryaplus26@gmail.com" className="block text-sm text-gray-300 hover:text-gold transition-colors">
                notaryaplus26@gmail.com
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
