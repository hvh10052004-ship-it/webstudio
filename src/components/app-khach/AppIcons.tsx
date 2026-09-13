import type { ReactNode } from "react";

type IconProps = { size?: number };

function Svg({
  size = 22,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      overflow="visible"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function IconHome(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
    </Svg>
  );
}

export function IconGrid(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="4" y="4" width="7" height="7" rx="1.2" />
      <rect x="13" y="4" width="7" height="7" rx="1.2" />
      <rect x="4" y="13" width="7" height="7" rx="1.2" />
      <rect x="13" y="13" width="7" height="7" rx="1.2" />
    </Svg>
  );
}

export function IconEdit(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 20h8" />
      <path d="M16.4 3.8a2 2 0 0 1 2.8 2.8L8 18l-4 1 1-4Z" />
    </Svg>
  );
}

export function IconEye(p: IconProps) {
  return (
    <Svg {...p}>
      <ellipse cx="12" cy="12" rx="9" ry="6.5" />
      <circle cx="12" cy="12" r="2.5" />
    </Svg>
  );
}

export function IconChat(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M5 6.5h10.5A2.5 2.5 0 0 1 18 9v5.5A2.5 2.5 0 0 1 15.5 17H11l-3.5 3v-3H5A2 2 0 0 1 3 15V8.5A2 2 0 0 1 5 6.5z" />
      <path d="M8 11h6M8 8.8h4" />
    </Svg>
  );
}

export function IconUser(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19.5c1.2-3.2 3.6-4.8 7-4.8s5.8 1.6 7 4.8" />
    </Svg>
  );
}

export function IconPage(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="6" y="3.5" width="12" height="17" rx="1.5" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </Svg>
  );
}

export function IconBuilding(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M5 21V5.5A1.5 1.5 0 0 1 6.5 4h7A1.5 1.5 0 0 1 15 5.5V21" />
      <path d="M15 10h3.5A1.5 1.5 0 0 1 20 11.5V21" />
      <path d="M9 8h2M9 12h2M9 16h2M5 21h14" />
    </Svg>
  );
}

export function IconRocket(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3c3 2 5.5 6 5.5 10.5 0 1.5-.3 2.8-.8 3.9L12 21l-4.7-3.6A9 9 0 0 1 6.5 13.5C6.5 9 9 5 12 3z" />
      <circle cx="12" cy="11" r="1.6" />
      <path d="M8 19c-1.2.4-2.8.6-4 .4.4-1.4.9-2.6 1.6-3.5" />
    </Svg>
  );
}

export function IconBag(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6.5A3 3 0 0 1 12 3.5 3 3 0 0 1 15 6.5V8" />
    </Svg>
  );
}

export function IconImage(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.4" />
      <path d="M4 16l5-4 4 3 3-2 4 3" />
    </Svg>
  );
}

export function IconSend(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 12 20 4l-6 16-2.5-6.5L4 12z" />
    </Svg>
  );
}

export function IconPhone(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M8 3.5h8A1.5 1.5 0 0 1 17.5 5v14a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 19V5A1.5 1.5 0 0 1 8 3.5z" />
      <path d="M10 18h4" />
    </Svg>
  );
}

export function IconCta(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="4" y="8" width="16" height="8" rx="2" />
      <path d="M8 12h8" />
    </Svg>
  );
}

export function IconTag(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 12.5V5.8A1.8 1.8 0 0 1 5.8 4h6.7L20 11.5 12.5 19 4 12.5z" />
      <circle cx="8.2" cy="8.2" r="1.1" />
    </Svg>
  );
}

export function IconLogout(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M10 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H10" />
      <path d="M10 12h9M16 8.5 19.5 12 16 15.5" />
    </Svg>
  );
}

export function IconPalette(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 4a8 8 0 1 0 0 16h1.2a2.2 2.2 0 0 0 2-3.1 2.2 2.2 0 0 1 2-3.2H18A8 8 0 0 0 12 4z" />
      <circle cx="8.2" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="10.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="8" r="1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconShield(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3.5 19 6.5v5.2c0 4.2-2.8 7.4-7 8.8-4.2-1.4-7-4.6-7-8.8V6.5z" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  );
}

export function IconPuzzle(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M8 4.5h3.2V6a1.6 1.6 0 1 0 3.2 0V4.5H17A1.5 1.5 0 0 1 18.5 6v3.2H17a1.6 1.6 0 1 0 0 3.2h1.5V16A1.5 1.5 0 0 1 17 17.5h-2.6V16a1.6 1.6 0 1 0-3.2 0v1.5H8A1.5 1.5 0 0 1 6.5 16v-3.2H8a1.6 1.6 0 1 0 0-3.2H6.5V6A1.5 1.5 0 0 1 8 4.5z" />
    </Svg>
  );
}

export function IconKey(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="8.5" cy="12" r="3.2" />
      <path d="M11.5 12H20v2.2h-2.2V16H15.5v-2.2H13.8" />
    </Svg>
  );
}

export function IconWrench(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M14.5 5.2a4 4 0 0 0-5.6 5.4L4.2 15.3a1.8 1.8 0 0 0 2.5 2.5l4.7-4.7a4 4 0 0 0 5.4-5.6l-2.6 2.6-2.2-2.2z" />
    </Svg>
  );
}

export function IconDownload(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 4v10" />
      <path d="M8.5 10.5 12 14l3.5-3.5" />
      <path d="M5 18h14" />
    </Svg>
  );
}

export function IconInfo(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8.2v.2" />
    </Svg>
  );
}

export function IconChevron(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="m9 6 6 6-6 6" />
    </Svg>
  );
}

export function IconHandset(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7.2 3.8c.7-.7 1.9-.7 2.6 0l1.4 1.4c.7.7.7 1.8 0 2.5l-1 1a12 12 0 0 0 5.1 5.1l1-1c.7-.7 1.8-.7 2.5 0l1.4 1.4c.7.7.7 1.9 0 2.6l-1.1 1.1c-.8.8-2 1.1-3.1.7A16.5 16.5 0 0 1 5.4 8c-.4-1.1-.1-2.3.7-3.1l1.1-1.1z" />
    </Svg>
  );
}

export function IconMail(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </Svg>
  );
}

export function IconGenderMale(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="10" cy="14" r="5.2" />
      <path d="M14 10 20 4M15.2 4H20v4.8" />
    </Svg>
  );
}

export function IconGenderFemale(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="9.2" r="5.2" />
      <path d="M12 14.4v6.2M9.2 17.8h5.6" />
    </Svg>
  );
}
