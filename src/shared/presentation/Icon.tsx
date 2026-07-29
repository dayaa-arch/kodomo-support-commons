import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "alert"
  | "arrow-left"
  | "arrow-right"
  | "backpack"
  | "calendar"
  | "chat"
  | "check"
  | "chevron-down"
  | "cloud-rain"
  | "coins"
  | "dots"
  | "external-link"
  | "family"
  | "hand-heart"
  | "heart"
  | "help-circle"
  | "home"
  | "map-pin"
  | "menu"
  | "phone"
  | "reset"
  | "school"
  | "search"
  | "shield-check"
  | "user"
  | "users";

interface IconProps extends SVGProps<SVGSVGElement> {
  readonly name: IconName;
}

const iconPaths: Record<IconName, ReactNode> = {
    alert: (
      <>
        <path d="M10.3 3.7 2.8 16.6A2 2 0 0 0 4.5 19h15a2 2 0 0 0 1.7-2.4L13.7 3.7a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),
    "arrow-left": <path d="m15 18-6-6 6-6" />,
    "arrow-right": <path d="m9 18 6-6-6-6" />,
    backpack: (
      <>
        <path d="M5 21V10a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1Z" />
        <path d="M9 5V4a3 3 0 0 1 6 0v1" />
        <path d="M9 14h6v5H9z" />
      </>
    ),
    calendar: (
      <>
        <path d="M8 2v4M16 2v4M3 10h18" />
        <rect x="3" y="4" width="18" height="18" rx="2" />
      </>
    ),
    chat: (
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
        <path d="M8 9h8M8 13h5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    "chevron-down": <path d="m6 9 6 6 6-6" />,
    "cloud-rain": (
      <>
        <path d="M17.5 15a4.5 4.5 0 0 0-.6-8.96 6 6 0 0 0-11.4 2.2A3.9 3.9 0 0 0 6 15" />
        <path d="M8 18.5v2M12 19v2.5M16 18.5v2" />
      </>
    ),
    coins: (
      <>
        <circle cx="9" cy="9" r="6" />
        <path d="M15.5 4.2a6 6 0 0 1 0 15.6" />
        <path d="M9 6.5v5M7.2 8.2h3.2M7.6 10.4h3" />
      </>
    ),
    dots: (
      <>
        <circle cx="5.5" cy="12" r="1.4" />
        <circle cx="12" cy="12" r="1.4" />
        <circle cx="18.5" cy="12" r="1.4" />
      </>
    ),
    "external-link": (
      <>
        <path d="M15 3h6v6M10 14 21 3" />
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      </>
    ),
    family: (
      <>
        <circle cx="8" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M2.5 20a5.5 5.5 0 0 1 11 0M13 20a4 4 0 0 1 8 0" />
      </>
    ),
    "hand-heart": (
      <>
        <path d="M15.6 5.3a2.6 2.6 0 0 0-3.6 0l-.5.5-.5-.5a2.6 2.6 0 0 0-3.6 3.6l4.1 4 4.1-4a2.6 2.6 0 0 0 0-3.6Z" />
        <path d="M3 15.5 6 14l4.5 2.5h3a1.5 1.5 0 0 1 0 3H10" />
        <path d="m9 19.5 6.5-.5 5-2.5a1.6 1.6 0 0 0-1.6-2.7L14 15.5" />
      </>
    ),
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    "help-circle": (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.4 9.2a2.7 2.7 0 0 1 5.2.9c0 1.8-2.6 2.4-2.6 4" />
        <path d="M12 17.5h.01" />
      </>
    ),
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v11h14V10M9 21v-7h6v7" />
      </>
    ),
    "map-pin": (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 1.9Z" />,
    reset: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
      </>
    ),
    school: (
      <>
        <path d="m3 10 9-5 9 5-9 5Z" />
        <path d="M7 13v5l5 3 5-3v-5M21 10v6" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    "shield-check": (
      <>
        <path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 22a8 8 0 0 1 16 0" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M2 21a7 7 0 0 1 14 0M16 4.5a4 4 0 0 1 0 7.5M17 15a6 6 0 0 1 5 6" />
      </>
    ),
};

export function Icon({ name, className = "size-5", ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {iconPaths[name]}
    </svg>
  );
}
