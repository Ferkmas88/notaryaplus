"use client";

// Video-backed Don Búho — a 5s Kling 2.5 Turbo Pro loop of the real
// branded owl mascot blinking, tilting his head and waving. Falls back
// to the static PNG while the webm is fetching.
//
// The webm is 256×256 VP9 (~100KB), auto-plays muted+looped inline.

import { useEffect, useRef, useState } from "react";

type Props = {
  className?: string;
  paused?: boolean;
};

export default function VideoBuho({ className = "", paused = false }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  // Defer the 190KB webm fetch until the browser is idle so it never
  // competes with critical assets on first paint. Static PNG covers the
  // FAB until the video is mounted.
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(() => setShouldMount(true), { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => setShouldMount(true), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (paused) v.pause();
    else v.play().catch(() => {});
  }, [paused, ready, shouldMount]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <img
        src="/mascot/don-buho.png"
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 w-full h-full object-cover object-top scale-125 transition-opacity ${ready ? "opacity-0" : "opacity-100"}`}
      />
      {shouldMount && (
        <video
          ref={videoRef}
          src="/mascot/don-buho-video-pp.webm"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noplaybackrate nofullscreen nopictureinpicture"
          onCanPlay={() => setReady(true)}
          onContextMenu={(e) => e.preventDefault()}
          translate="no"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      )}
    </div>
  );
}
