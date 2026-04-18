"use client";

// Social proof counter — "X documentos notarizados este mes" with a
// live-looking tick-up. The starting number is seeded deterministically
// from (year, month, day) so every visitor sees a consistent, plausible
// value that grows through the day. Ticks up slowly while visible to
// suggest real-time activity.
//
// Not actual data — Myrna's volume is hand-tuned via BASE/PER_DAY below.
// The point is a credibility cue, not an analytics dashboard.

import { useEffect, useState } from "react";

const BASE = 85; // baseline count at start of each month
const PER_DAY = 3.2; // avg new notarizations per day

function seededCount(): number {
  const now = new Date();
  const day = now.getDate();
  const hour = now.getHours();
  // Grow roughly linearly through the month, with small hour-of-day noise.
  const grown = BASE + Math.floor(day * PER_DAY) + Math.floor(hour / 6);
  return grown;
}

export default function LiveCounter({ className = "" }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setCount(seededCount());
  }, []);

  useEffect(() => {
    if (count == null) return;
    // Every 12–40s, bump by +1 — small, irregular, like real activity.
    let cancelled = false;
    function schedule() {
      const delay = 12000 + Math.random() * 28000;
      setTimeout(() => {
        if (cancelled) return;
        setCount((c) => (c != null ? c + 1 : c));
        schedule();
      }, delay);
    }
    schedule();
    return () => {
      cancelled = true;
    };
  }, [count]);

  useEffect(() => {
    // Fade in after mount so it doesn't feel like a flash.
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  if (count == null) return null;
  return (
    <div
      className={`inline-flex items-center gap-2 bg-white/95 backdrop-blur rounded-full
                  border border-gold/30 px-3.5 py-1.5 shadow-sm
                  transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
                  ${className}`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <span className="text-xs md:text-sm text-navy font-medium">
        <span key={count} className="inline-block font-bold text-navy animate-count-up">
          +{count}
        </span>{" "}
        documentos notarizados este mes
      </span>
    </div>
  );
}
