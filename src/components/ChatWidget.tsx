"use client";

// Floating chat widget — global, visible on every page.
//
// UX: a single FAB bottom-right. Click it → opens an in-page chat panel
// that talks to the bot running on Railway (POST /chat).
//
// Session id is kept in localStorage so the conversation survives reloads
// and lets the bot keep in-memory history per visitor.

import { useEffect, useRef, useState } from "react";
import VideoBuho from "./VideoBuho";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

const BOT_URL = "https://web-production-c32f8.up.railway.app/chat";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  const KEY = "notaryaplus_chat_session";
  let sid = window.localStorage.getItem(KEY);
  if (!sid) {
    sid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(KEY, sid);
  }
  return sid;
}

// Renders a bot message into React nodes, turning plain-text URLs into
// clickable anchors and **bold** markdown into <strong>. User messages are
// rendered as plain text — visitors do not usually type urls and we want
// to avoid any surprise injection of html.
function renderBotText(text: string): React.ReactNode {
  const urlRegex = /(https?:\/\/[^\s<>)]+)/g;
  const out: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      out.push(renderBold(text.slice(lastIndex, match.index), `t${key++}`));
    }
    // Strip trailing punctuation that was probably not part of the URL.
    let url = match[0];
    while (url.length && '.,!?;:)"\''.includes(url[url.length - 1])) {
      url = url.slice(0, -1);
    }
    out.push(
      <a
        key={`u${key++}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block underline underline-offset-2 decoration-gold/70 hover:decoration-gold font-semibold text-navy hover:text-gold break-all transition-colors"
      >
        {url}
      </a>
    );
    lastIndex = match.index + url.length;
  }
  if (lastIndex < text.length) {
    out.push(renderBold(text.slice(lastIndex), `t${key++}`));
  }
  return <>{out}</>;
}

function renderBold(text: string, keyBase: string): React.ReactNode {
  const boldRegex = /\*\*([^*]+?)\*\*/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={`${keyBase}-b${i++}`} className="font-bold text-navy">
        {match[1]}
      </strong>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? <span key={keyBase}>{parts}</span> : text;
}

export default function ChatWidget() {
  const { lang } = useLang();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [wiggleKey, setWiggleKey] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintVariant, setHintVariant] = useState<"simple" | "full">("simple");
  const [hintDismissed, setHintDismissed] = useState(false);
  const [attentionActive, setAttentionActive] = useState(false);
  const [headTilt, setHeadTilt] = useState({ x: 0, y: 0 });
  const [hoveringFab, setHoveringFab] = useState(false);
  // Hide the owl FAB for the rest of this browser tab session.
  // Persisted in sessionStorage so it resets on next visit — intencional
  // para que quien busque ayuda vuelva a ver el botón mañana.
  const [widgetHidden, setWidgetHidden] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("np_widget_hidden") === "1") {
      setWidgetHidden(true);
    }
  }, []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const hasInteractedRef = useRef(false);

  // Greeting appears the first time the chat panel opens.
  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      setMessages([
        {
          role: "bot",
          text:
            "¡Hola, vecino! 🦉 Soy Ciro, el asistente de la oficina de Myrna. " +
            "Dime en qué te puedo ayudar — taxes, notaría, inmigración, negocios, traducciones, camioneros… " +
            "Aquí estamos para servirte.",
        },
      ]);
    }
  }, [chatOpen, messages.length]);

  // Auto-scroll to the latest message.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending]);

  // Focus input when the chat panel opens.
  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      hasInteractedRef.current = true;
      setShowHint(false);
      setAttentionActive(false);
    }
  }, [chatOpen]);

  // Refocus el input cuando `sending` vuelve a false. El input tiene
  // disabled={sending}; al deshabilitarlo el browser pierde el focus y no
  // lo restituye. Con useEffect corremos después del commit de React, así
  // el input ya está enabled cuando llamamos focus().
  useEffect(() => {
    if (!sending && chatOpen) {
      inputRef.current?.focus();
    }
  }, [sending, chatOpen]);

  // Mount flag — used so the FAB plays its bounce-in only on first render.
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Hint bubble — two variants that alternate:
  //   simple  → quick greeting ("Hola, soy Ciro. ¿Quieres agendar…?")
  //   full    → 3 quick-action buttons (Agendar / Notarizar / Pregunta)
  // First appearance at 4s = simple. Every 60s after, swap to the
  // other variant. Dismissing with × or opening the chat stops the loop.
  useEffect(() => {
    if (hintDismissed) return;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    // Initial: simple variant at 4s, visible 10s.
    timeouts.push(
      setTimeout(() => {
        if (hintDismissed || hasInteractedRef.current) return;
        setHintVariant("simple");
        setShowHint(true);
        timeouts.push(setTimeout(() => setShowHint(false), 10000));
      }, 4000)
    );

    // Loop: every 60s, toggle variant and re-show for 10s.
    const loop = setInterval(() => {
      if (hintDismissed || hasInteractedRef.current) return;
      setHintVariant((v) => (v === "simple" ? "full" : "simple"));
      setShowHint(true);
      setTimeout(() => setShowHint(false), 10000);
    }, 60000);
    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(loop);
    };
  }, [hintDismissed]);

  // Attention pulse kicks in after 25s of chat-closed idle, repeats every
  // 40s to nudge users back without being annoying. Stops on first open.
  useEffect(() => {
    if (chatOpen || hasInteractedRef.current) return;
    const firstBurst = setTimeout(() => setAttentionActive(true), 25000);
    const clearFirst = setTimeout(() => setAttentionActive(false), 32000);
    const loop = setInterval(() => {
      setAttentionActive(true);
      setTimeout(() => setAttentionActive(false), 7000);
    }, 40000);
    return () => {
      clearTimeout(firstBurst);
      clearTimeout(clearFirst);
      clearInterval(loop);
    };
  }, [chatOpen]);

  // Head-tracking on the FAB: while the mouse hovers the FAB, rotate the
  // owl a few degrees toward the cursor. Subtle but alive.
  useEffect(() => {
    if (!hoveringFab || !fabRef.current) {
      setHeadTilt({ x: 0, y: 0 });
      return;
    }
    const el = fabRef.current;
    const handle = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      setHeadTilt({
        x: Math.max(-1, Math.min(1, dx)) * 8,
        y: Math.max(-1, Math.min(1, dy)) * 6,
      });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [hoveringFab]);

  async function sendText(rawText: string) {
    const text = rawText.trim();
    if (!text || sending) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setSending(true);
    try {
      const res = await fetch(BOT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: getOrCreateSessionId(),
          message: text,
        }),
      });
      const data = await res.json();
      const reply = (data?.reply || "").trim();
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text:
            reply ||
            "Perdón, no pude procesar eso. Intenta de nuevo o escríbenos por WhatsApp.",
        },
      ]);
      setWiggleKey((k) => k + 1);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text:
            "Hubo un problema de conexión. Intenta de nuevo o escríbenos por WhatsApp.",
        },
      ]);
      setWiggleKey((k) => k + 1);
    } finally {
      setSending(false);
      // Ver useEffect([sending, chatOpen]) abajo para re-focus del input.
    }
  }

  function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    sendText(input);
  }

  // Called by quick-action buttons in the hint bubble — opens the chat
  // panel and auto-sends a pre-written intent message as if the user
  // typed it, so the bot replies immediately with a specific flow.
  function openChatWithPrompt(text: string) {
    hasInteractedRef.current = true;
    setHintDismissed(true);
    setShowHint(false);
    setChatOpen(true);
    // Wait a tick for chatOpen effect to run (greeting + focus) before sending.
    setTimeout(() => sendText(text), 250);
  }

  return (
    <>
      {/* Chat panel */}
      {chatOpen && (
        <div
          className="fixed z-[60] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden
                     bottom-24 right-5 w-[calc(100vw-2.5rem)] max-w-[380px] h-[540px] max-h-[calc(100vh-7rem)]
                     animate-slide-up-fade origin-bottom-right"
          role="dialog"
          aria-label="Chat con 3-1 Notary A Plus"
        >
          {/* Header */}
          <div className="bg-navy px-4 py-3 flex items-center gap-3">
            <div className="relative">
              <div
                key={`header-wiggle-${wiggleKey}`}
                className="w-11 h-11 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center overflow-hidden animate-wiggle"
              >
                <VideoBuho />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-navy rounded-full animate-status-blink" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-white font-bold text-sm leading-tight truncate"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Ciro
              </p>
              <p className="text-mint text-xs truncate">Asistente de Myrna · En línea</p>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              aria-label="Cerrar chat"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* LLM notice */}
          <div className="bg-mint-light/80 border-b border-mint px-4 py-2 text-[11px] text-navy/80 leading-snug">
            {t("chat.llmNotice", lang)}
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-mint-light/40"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/40 overflow-hidden shrink-0">
                    <VideoBuho />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-gold text-navy font-medium rounded-br-sm"
                      : "bg-white text-gray-800 shadow-sm rounded-bl-sm border border-gray-100"
                  }`}
                >
                  {m.role === "bot" ? renderBotText(m.text) : m.text}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/40 overflow-hidden shrink-0 animate-thinking-tilt">
                  <VideoBuho />
                </div>
                <div className="bg-white text-gray-500 shadow-sm rounded-2xl rounded-bl-sm border border-gray-100 px-4 py-2.5 text-sm">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="border-t border-gray-200 bg-white px-3 py-3 flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje…"
              disabled={sending}
              className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Enviar"
              className="w-10 h-10 shrink-0 rounded-full bg-gold hover:bg-gold/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition"
            >
              <svg className="w-5 h-5 text-navy" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Main FAB */}
      {!chatOpen && !widgetHidden && (
        <div className="fixed bottom-5 right-5 z-[60] flex items-end gap-3">
          {/* Hint bubble — simple or full variant */}
          {showHint && hintVariant === "simple" && (
            <button
              type="button"
              onClick={() => {
                hasInteractedRef.current = true;
                setHintDismissed(true);
                setShowHint(false);
                setChatOpen(true);
              }}
              className="mb-3 max-w-[240px] bg-white text-navy rounded-2xl rounded-br-sm shadow-xl border border-gold/30
                         px-4 py-2.5 text-sm font-medium animate-hint-slide-in relative text-left hover:bg-gold/5 transition-colors"
            >
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHint(false);
                  setHintDismissed(true);
                }}
                role="button"
                aria-label="Cerrar aviso"
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-navy text-white text-xs flex items-center justify-center hover:bg-navy-dark"
              >
                ×
              </span>
              Hola, soy Ciro. ¿Quieres agendar o tienes una pregunta?
              <span className="absolute bottom-0 -right-1.5 w-3 h-3 bg-white border-r border-b border-gold/30 rotate-45 translate-y-1" />
            </button>
          )}

          {showHint && hintVariant === "full" && (
            <div
              className="mb-3 w-[260px] bg-white text-navy rounded-2xl rounded-br-sm shadow-xl border border-gold/30
                         p-3 animate-hint-slide-in relative"
            >
              <button
                onClick={() => {
                  setShowHint(false);
                  setHintDismissed(true);
                }}
                aria-label="Cerrar aviso"
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-navy text-white text-xs flex items-center justify-center hover:bg-navy-dark z-10"
              >
                ×
              </button>
              <p className="text-sm font-semibold mb-2.5 leading-snug">
                ¿En qué te puedo ayudar?
              </p>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => openChatWithPrompt("Quiero agendar una cita. ¿Qué horarios tienen disponibles?")}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gold text-navy font-semibold text-sm hover:bg-gold-light transition-colors text-left"
                >
                  <span>📅</span>
                  <span>Agendar cita ahora</span>
                </button>
                <button
                  type="button"
                  onClick={() => openChatWithPrompt("Necesito notarizar un documento. ¿Qué necesito llevar y cuánto cuesta?")}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-mint text-navy font-medium text-sm hover:bg-mint-dark transition-colors text-left"
                >
                  <span>📄</span>
                  <span>Notarizar documento</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    hasInteractedRef.current = true;
                    setHintDismissed(true);
                    setShowHint(false);
                    setChatOpen(true);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-navy font-medium text-sm hover:bg-gray-200 transition-colors text-left"
                >
                  <span>❓</span>
                  <span>Solo tengo una pregunta</span>
                </button>
              </div>
              <span className="absolute bottom-0 -right-1.5 w-3 h-3 bg-white border-r border-b border-gold/30 rotate-45 translate-y-1" />
            </div>
          )}

          {/* FAB wrapper — holds bounce-in + float, inner button rotates toward cursor */}
          <div
            className={`relative ${mounted ? "animate-float" : "animate-fab-bounce-in"}`}
          >
            {/* Attention rings — two expanding pulses when attentionActive */}
            {attentionActive && (
              <>
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-gold animate-attention-ring pointer-events-none"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-gold animate-attention-ring pointer-events-none"
                  style={{ animationDelay: "0.9s" }}
                />
              </>
            )}

            <div className="relative">
              <button
                ref={fabRef}
                onClick={() => setChatOpen(true)}
                onMouseEnter={() => setHoveringFab(true)}
                onMouseLeave={() => setHoveringFab(false)}
                aria-label="Abrir chat con Ciro"
                className={`group relative w-16 h-16 rounded-full shadow-xl hover:shadow-2xl
                            bg-gold overflow-hidden ring-2 ring-white/40
                            ${attentionActive ? "animate-attention-pulse" : ""}
                            transition-transform duration-200 ease-out`}
                style={{
                  transform: hoveringFab
                    ? `scale(1.1) rotate(${-headTilt.x * 0.6}deg)`
                    : undefined,
                }}
              >
                <div
                  className="absolute inset-0 transition-transform duration-150 ease-out"
                  style={{
                    transform: hoveringFab
                      ? `translate(${headTilt.x * 0.4}px, ${headTilt.y * 0.3}px)`
                      : undefined,
                  }}
                >
                  <VideoBuho />
                </div>
              </button>
              {/* Hide widget for this session. Aparece siempre al lado del FAB. */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (typeof window !== "undefined") {
                    sessionStorage.setItem("np_widget_hidden", "1");
                  }
                  setWidgetHidden(true);
                  setShowHint(false);
                }}
                aria-label="Ocultar asistente por esta sesión"
                title="Ocultar (puedes volver a verlo recargando la página)"
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-navy text-white text-xs
                           flex items-center justify-center shadow-md hover:bg-navy-dark
                           transition-colors ring-2 ring-white/80"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
