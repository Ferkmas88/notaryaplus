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

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (paused) v.pause();
    else v.play().catch(() => {});
  }, [paused, ready]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {!ready && (
        <img
          src="/mascot/don-buho.png"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover object-top scale-125"
        />
      )}
      <video
        ref={videoRef}
        src="/mascot/don-buho-video-pp.webm"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload noplaybackrate nofullscreen nopictureinpicture"
        onCanPlay={() => setReady(true)}
        onContextMenu={(e) => e.preventDefault()}
        translate="no"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
    </div>
  );
}
