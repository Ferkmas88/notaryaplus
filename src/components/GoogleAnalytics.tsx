"use client";

import Script from "next/script";
import { useConsent } from "@/components/ConsentProvider";

/**
 * GoogleAnalytics (GA4) con consent-gating.
 *
 * Reglas:
 * - Solo se monta si `NEXT_PUBLIC_GA_ID` existe (en build time — static export).
 * - Solo se renderiza si el usuario dio consent de analytics.
 * - Cuando el usuario acepta DESPUÉS de cargar la página, el componente
 *   re-renderiza (via ConsentProvider) e inyecta los scripts en ese momento.
 * - anonymize_ip=true por GDPR-lite.
 *
 * Nota sobre static export: NEXT_PUBLIC_* se inlinean en build. Hay que pasar
 * `NEXT_PUBLIC_GA_ID` como env al paso `npm run build` del GitHub Action.
 * Ver DEPLOY_NOTES.md.
 */
export default function GoogleAnalytics() {
  const { isEnabled, hydrated } = useConsent();

  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!gaId) return null;
  if (!hydrated) return null;
  if (!isEnabled("analytics")) return null;

  return (
    <>
      <Script
        id="ga4-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            anonymize_ip: true,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
