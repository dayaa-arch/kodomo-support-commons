import type { FacilityImageVariant } from "@/src/modules/facility";

export function SupportIllustration({
  variant = "community",
  className = "",
}: {
  readonly variant?: FacilityImageVariant;
  readonly className?: string;
}) {
  const accent = {
    conversation: "#f2b36c",
    community: "#77b97c",
    learning: "#8c7cc8",
  }[variant];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 520 270"
      className={className}
    >
      <defs>
        <linearGradient id={`sky-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eef8fd" />
          <stop offset="1" stopColor="#fffaf0" />
        </linearGradient>
      </defs>
      <rect width="520" height="270" rx="32" fill={`url(#sky-${variant})`} />
      <circle cx="434" cy="56" r="22" fill="#f7d476" opacity=".75" />
      <path d="M0 218c72-48 143-41 205-2 75-51 155-52 238 3 26-13 52-15 77-7v58H0Z" fill="#dcefd7" />
      <path d="M0 235c83-29 165-24 245 6 94-35 186-32 275 0v29H0Z" fill="#b9ddc5" />
      <g opacity=".78">
        <rect x="50" y="118" width="44" height="94" rx="5" fill="#b5d7e8" />
        <rect x="101" y="88" width="54" height="124" rx="5" fill="#9cc9df" />
        <rect x="164" y="132" width="36" height="80" rx="5" fill="#c6deea" />
        {[65, 118, 180].map((x) => (
          <g key={x} fill="#f8fdff">
            <rect x={x} y="145" width="8" height="9" rx="1" />
            <rect x={x} y="164" width="8" height="9" rx="1" />
            <rect x={x} y="183" width="8" height="9" rx="1" />
          </g>
        ))}
      </g>
      <g transform="translate(235 68)">
        <ellipse cx="54" cy="54" rx="27" ry="31" fill="#f3c6a5" />
        <path d="M27 54c0-34 49-43 57-11 2 8 0 15-3 22-3-15-13-25-28-27-8 8-16 13-26 16Z" fill="#4f6680" />
        <path d="M16 160c4-51 24-77 39-77s36 26 40 77Z" fill={accent} />
        <path d="M37 104 15 137M74 104l24 32" stroke="#f3c6a5" strokeWidth="12" strokeLinecap="round" />
        <circle cx="48" cy="56" r="2" fill="#3f4e5c" />
        <circle cx="65" cy="56" r="2" fill="#3f4e5c" />
        <path d="M50 68c5 4 10 4 15 0" fill="none" stroke="#b26c63" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g transform="translate(340 94)">
        <ellipse cx="52" cy="43" rx="23" ry="26" fill="#edbd98" />
        <path d="M30 43c-2-27 39-37 48-13 3 8 2 17-1 23-5-13-15-20-29-21-5 5-11 9-18 11Z" fill="#7b5948" />
        <path d="M15 143c4-43 20-67 38-67 17 0 34 24 38 67Z" fill="#3f8fc3" />
        <path d="M36 95 16 122M69 95l20 27" stroke="#edbd98" strokeWidth="10" strokeLinecap="round" />
        <circle cx="45" cy="46" r="2" fill="#3f4e5c" />
        <circle cx="59" cy="46" r="2" fill="#3f4e5c" />
        <path d="M47 57c4 3 8 3 12 0" fill="none" stroke="#a95f57" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g transform="translate(277 176)" fill="none" stroke="#2d769e" strokeWidth="5" strokeLinecap="round">
        <path d="M0 15c18-20 39-20 57 0" />
        <path d="M57 15c18-20 39-20 57 0" />
      </g>
    </svg>
  );
}
