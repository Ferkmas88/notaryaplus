"use client";

// Exit-intent modal. Triggers once per session when the user's cursor
// leaves the top edge of the viewport — typical "closing the tab /
// switching windows" gesture. Offers a zero-friction WhatsApp handoff
// because someone about to leave won't book an appointment, but they
// might tap WhatsApp.
//
// Session-scoped dismiss stored in sessionStorage so it never fires
// twice in the same visit.

import { useEffect, useState } from "react";

const WHATSAPP_PHONE = "15026547076"; // (502) 654-7076 — Myrna
const DISMISS_KEY = "notaryaplus_exit_intent_dismissed";

export default function ExitIntent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(DISMISS_KEY)) return;

    let fired = false;
    function onMouseOut(e: MouseEvent) {
      if (fired) return;
      // Only trigger when leaving the top of the viewport and to a
      // non-document target (i.e. switching tab / closing).
      if (e.clientY > 0 || e.relatedTarget) return;
      fired = true;
      setOpen(true);
    }
    // Also show after 45s of passive presence if user hasn't interacted.
    const idleTimer = setTimeout(() => {
      if (fired) return;
      fired = true;
      setOpen(true);
    }, 45000);

    document.addEventListener("mouseout", onMouseOut);
    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      clearTimeout(idleTimer);
    };
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  const msg = encodeURIComponent(
    "Hola, estoy en notaryaplus.com y me gustaría hacer una consulta."
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50 animate-backdrop-in"
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-modal-in"
      >
        <button
          onClick={dismiss}
          aria-label="Cerrar"
          className="absolute top-3 right-3 w-8 h-8 rounded-full text-gray-400 hover:text-navy hover:bg-gray-100 flex items-center justify-center transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden border-2 border-gold bg-gold/20">
            <video
              src="/mascot/don-buho-video-pp.webm"
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              disableRemotePlayback
              controlsList="nodownload noplaybackrate nofullscreen nopictureinpicture"
              translate="no"
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>
          <div>
            <h2
              id="exit-intent-title"
              className="text-xl md:text-2xl font-bold text-navy leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Espera, no te vayas 👋
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              ¿Te ayudo por WhatsApp ahora mismo?
            </p>
          </div>
        </div>

        <p className="text-gray-700 text-sm md:text-base mb-5 leading-relaxed">
          Si tienes una duda rápida o necesitas confirmar algo antes de
          venir, escríbenos. Respondemos en minutos.
        </p>

        <a
          href={`https://wa.me/${WHATSAPP_PHONE}?text=${msg}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            sessionStorage.setItem(DISMISS_KEY, "1");
          }}
          className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold py-3.5 rounded-full transition-colors shadow-md"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.47 14.38c-.3-.15-1.76-.86-2.03-.96-.27-.1-.47-.15-.67.15s-.77.96-.94 1.16c-.17.2-.35.22-.65.08-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.91-2.2-.24-.58-.49-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.47s1.07 2.87 1.22 3.07c.15.2 2.11 3.22 5.1 4.52.71.3 1.26.48 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35zM12 2C6.48 2 2 6.48 2 12c0 1.85.51 3.58 1.38 5.06L2 22l4.95-1.3A9.92 9.92 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
          </svg>
          <span>Hablar por WhatsApp</span>
        </a>

        <button
          onClick={dismiss}
          className="mt-3 w-full text-xs text-gray-500 hover:text-gray-700 transition"
        >
          No, gracias — ya me voy
        </button>
      </div>
    </div>
  );
}
