import type { CSSProperties } from 'react';

const paths = {
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  arrowDown: <><path d="M12 4v16m-6-6 6 6 6-6" /></>,
  external: <><path d="M14 4h6v6m0-6L10 14" /><path d="M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></>,
  bookmark: <path d="M6 4h12v17l-6-4-6 4z" />,
  flame: <path d="M13 3c1 5-4 5-2 9 1-2 3-2 3-5 3 3 5 5 5 8a7 7 0 1 1-14 0c0-4 3-6 3-9 1 2 1 4 2 4-1-4 3-4 3-7Z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  heart: <path d="M20.7 4.9a5.4 5.4 0 0 0-7.6 0L12 6l-1.1-1.1a5.4 5.4 0 0 0-7.6 7.6L12 21l8.7-8.5a5.4 5.4 0 0 0 0-7.6Z" />,
  reply: <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />,
  repost: <><path d="m3 7 3-3 3 3M6 4v11a2 2 0 0 0 2 2h4m9 0-3 3-3-3m3 3V9a2 2 0 0 0-2-2h-4" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  code: <><path d="m7 7-5 5 5 5m10-10 5 5-5 5M14 4l-4 16" /></>,
  community: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.9" /><circle cx="9" cy="7" r="4" /><path d="M16 3.1a4 4 0 0 1 0 7.8" /></>,
  chip: <><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 1v5m6-5v5M9 18v5m6-5v5M1 9h5m-5 6h5m12-6h5m-5 6h5" /><rect x="9" y="9" width="6" height="6" rx="1" /></>,
  hash: <><path d="M4 9h16M3 15h16M10 3 8 21M16 3l-2 18" /></>,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  check: <path d="m5 12 4 4L19 6" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-10v.1" /></>,
  x: <path d="M4 3h4.5L20 21h-4.5L4 3Zm0 18L20 3" />,
};

export type IconName = keyof typeof paths;

export default function Icon({ name, size = 20, className = '', style }: { name: IconName; size?: number; className?: string; style?: CSSProperties }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>{paths[name]}</svg>;
}
