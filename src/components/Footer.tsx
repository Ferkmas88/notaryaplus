"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

export default function Footer() {
  const { lang } = useLang();

  return (
    <footer className="bg-navy-dark text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full border-2 border-gold flex items-center justify-center bg-white">
                <svg viewBox="0 0 40 40" className="w-7 h-7">
                  <circle cx="20" cy="20" r="18" fill="none" stroke="#C8A214" strokeWidth="2.5"/>
                  <path d="M10 20 L17 27 L30 13" stroke="#1B3356" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <div>
                <div className="text-white font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
                  3-1 NOTARY A PLUS
                </div>
                <div className="text-gold text-xs">Business & Tax Services</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              {t("footer.brand.desc", lang)}
            </p>
            {/* Social */}
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/groups/828107437233604"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-navy rounded-full flex items-center justify-center hover:bg-gold transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/myrna.chacon.1/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-navy rounded-full flex items-center justify-center hover:bg-gold transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="17.5" cy="6.5" r="1.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t("footer.services", lang)}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/taxes" className="hover:text-gold transition-colors">{t("footer.services.taxes", lang)}</Link></li>
              <li><Link href="/notaria" className="hover:text-gold transition-colors">{t("footer.services.notaria", lang)}</Link></li>
              <li><Link href="/inmigracion" className="hover:text-gold transition-colors">{t("footer.services.inmigracion", lang)}</Link></li>
              <li><Link href="/negocios" className="hover:text-gold transition-colors">{t("footer.services.negocios", lang)}</Link></li>
              <li><Link href="/traducciones" className="hover:text-gold transition-colors">{t("footer.services.traducciones", lang)}</Link></li>
              <li><Link href="/taxes" className="hover:text-gold transition-colors">{t("footer.services.camioneros", lang)}</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t("footer.info", lang)}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-gold transition-colors">{t("footer.info.inicio", lang)}</Link></li>
              <li><Link href="/contacto" className="hover:text-gold transition-colors">{t("footer.info.contacto", lang)}</Link></li>
              <li><Link href="/citas" className="hover:text-gold transition-colors">{t("footer.info.citas", lang)}</Link></li>
            </ul>
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">{t("footer.horario", lang)}</h4>
              <div className="text-sm space-y-1">
                <p>{t("footer.horario.lv", lang)} <span className="text-gold">10:00 AM – 6:00 PM</span></p>
                <p>{t("footer.horario.sab", lang)} <span className="text-gold">10:00 AM – 5:00 PM</span></p>
                <p>{t("footer.horario.dom", lang)}: <span className="text-gray-500">{t("footer.horario.cerrado", lang)}</span></p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t("footer.contacto", lang)}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-gold mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>8514 Preston Hwy<br />Louisville, KY 40219</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gold shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <div>
                  <a href="tel:5026547076" className="hover:text-gold block">(502) 654-7076 {t("footer.oficina", lang)}</a>
                  <a href="tel:5026441312" className="hover:text-gold block">(502) 644-1312 {t("footer.cell", lang)}</a>
                  <a href="tel:5028904772" className="hover:text-gold block">(502) 890-4772</a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gold shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <a href="mailto:notaryaplus31@gmail.com" className="hover:text-gold break-all">
                  notaryaplus31@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-navy mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} 3-1 Notary A Plus. {t("footer.rights", lang)}</p>
          <p>{t("footer.agent", lang)}</p>
        </div>
      </div>
    </footer>
  );
}
