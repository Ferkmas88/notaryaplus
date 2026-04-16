"use client";

// Floating chat widget — global, visible on every page.
//
// UX: a single FAB bottom-right. Click it → opens an in-page chat panel
// that talks to the bot running on Railway (POST /chat).
//
// Session id is kept in localStorage so the conversation survives reloads
// and lets the bot keep in-memory history per visitor.

import { useEffect, useRef, useState } from "react";

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
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Greeting appears the first time the chat panel opens.
  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      setMessages([
        {
          role: "bot",
          text:
            "¡Hola! Soy el asistente virtual de 3-1 Notary A Plus. " +
            "¿En qué puedo ayudarte? Taxes, notaría, inmigración, negocios, traducciones, camioneros…",
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
    }
  }, [chatOpen]);

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
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
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text:
            "Hubo un problema de conexión. Intenta de nuevo o escríbenos por WhatsApp.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Chat panel */}
      {chatOpen && (
        <div
          className="fixed z-50 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden
                     bottom-24 right-5 w-[calc(100vw-2.5rem)] max-w-[380px] h-[540px] max-h-[calc(100vh-7rem)]"
          role="dialog"
          aria-label="Chat con 3-1 Notary A Plus"
        >
          {/* Header */}
          <div className="bg-navy px-4 py-3 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
                <svg className="w-5 h-5 text-navy" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-navy rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-white font-bold text-sm leading-tight truncate"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                3-1 Notary A Plus
              </p>
              <p className="text-mint text-xs truncate">Asistente virtual · En línea</p>
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

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-mint-light/40"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
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
              <div className="flex justify-start">
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
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          aria-label="Abrir chat"
          className="fixed bottom-5 right-5 z-50 w-16 h-16 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 bg-gold hover:scale-110"
        >
          <svg className="w-8 h-8 text-navy" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
          </svg>
        </button>
      )}
    </>
  );
}
