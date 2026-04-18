"use client";

// Official-style "IRS Certified" stamp for the hero. Drops in with a
// spring curve on mount and then breathes with a subtle scale pulse —
// the goal is a visual cue of "this is real / official", not decoration.

export default function IRSStamp({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative pointer-events-none select-none ${className}`}
      aria-hidden
    >
      <div className="animate-stamp-drop">
        <div className="animate-stamp-pulse">
          <svg
            viewBox="0 0 140 140"
            className="w-28 h-28 md:w-36 md:h-36 drop-shadow-[0_8px_16px_rgba(200,162,20,0.35)]"
          >
            <defs>
              <path id="stamp-top" d="M 70 70 m -52 0 a 52 52 0 0 1 104 0" />
              <path id="stamp-bottom" d="M 70 70 m -52 0 a 52 52 0 0 0 104 0" />
            </defs>
            <circle
              cx="70"
              cy="70"
              r="66"
              fill="none"
              stroke="#C8A214"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
            <circle
              cx="70"
              cy="70"
              r="56"
              fill="none"
              stroke="#C8A214"
              strokeWidth="3"
            />
            <circle
              cx="70"
              cy="70"
              r="50"
              fill="none"
              stroke="#C8A214"
              strokeOpacity="0.5"
              strokeWidth="1"
            />
            <text fill="#C8A214" fontSize="11" fontWeight="700" letterSpacing="2">
              <textPath href="#stamp-top" startOffset="50%" textAnchor="middle">
                IRS CERTIFIED AGENT
              </textPath>
            </text>
            <text fill="#C8A214" fontSize="10" fontWeight="600" letterSpacing="3">
              <textPath href="#stamp-bottom" startOffset="50%" textAnchor="middle">
                · 15+ YEARS · LOUISVILLE KY ·
              </textPath>
            </text>
            <g transform="translate(70,70)">
              <text
                textAnchor="middle"
                y="-8"
                fill="#C8A214"
                fontSize="20"
                fontWeight="900"
                fontFamily="'Playfair Display', serif"
              >
                VERIFIED
              </text>
              <text
                textAnchor="middle"
                y="16"
                fill="#C8A214"
                fontSize="12"
                fontWeight="700"
                letterSpacing="1"
              >
                3-1 NOTARY
              </text>
              <line x1="-22" y1="24" x2="22" y2="24" stroke="#C8A214" strokeWidth="1" />
              <text
                textAnchor="middle"
                y="36"
                fill="#C8A214"
                fontSize="8"
                opacity="0.75"
                letterSpacing="2"
              >
                A PLUS
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
