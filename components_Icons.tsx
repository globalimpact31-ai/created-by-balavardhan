import React from "react";

export const IconMap: Record<string, React.ReactNode> = {
  F: (
    <svg viewBox="0 0 24 24" width="56" height="56" fill="none" aria-hidden>
      <path d="M3 12s4-5 9-5 9 5 9 5-4 5-9 5S3 12 3 12z" fill="#FDE68A"/>
      <path d="M7 12c0 1.657 2 3 5 3s5-1.343 5-3" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.5 9.2c.8-.8 2.4-.8 3.2 0" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  L: (
    <svg viewBox="0 0 24 24" width="56" height="56" fill="none" aria-hidden>
      <path d="M12 21s-7-4.8-9-8.4C1 8.2 6 4 9.6 6.2 11 7.1 12 8.4 12 8.4s1-1.3 2.4-2.2C18 4 23 8.2 21 12.6 19 16.2 12 21 12 21z" fill="#FCA5A5"/>
      <path d="M12 21s-7-4.8-9-8.4C1 8.2 6 4 9.6 6.2 11 7.1 12 8.4 12 8.4" stroke="#9B1C1C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  A: (
    <svg viewBox="0 0 24 24" width="56" height="56" fill="none" aria-hidden>
      <circle cx="12" cy="10" r="3" fill="#C7F9CC"/>
      <path d="M5 20c2-3 6-4 7-4s5 1 7 4" stroke="#166534" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  M: (
    <svg viewBox="0 0 24 24" width="56" height="56" fill="none" aria-hidden>
      <circle cx="8" cy="10" r="2" fill="#E6E6FA" />
      <circle cx="16" cy="10" r="2" fill="#E6E6FA" />
      <path d="M3 20c2-3 6-4 9-4s7 1 9 4" stroke="#6D28D9" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 8c2-2 6-2 10 0" stroke="#6D28D9" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  E: (
    <svg viewBox="0 0 24 24" width="56" height="56" fill="none" aria-hidden>
      <path d="M12 3l9 18H3L12 3z" fill="#FEE2E2"/>
      <path d="M12 9v4" stroke="#B91C1C" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M12 15v.01" stroke="#B91C1C" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  S: (
    <svg viewBox="0 0 24 24" width="56" height="56" fill="none" aria-hidden>
      <path d="M6 8c1-2 4-3 6-3s5 1 6 3" stroke="#0EA5A4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 21v-6a4 4 0 014-4h0a4 4 0 014 4v6" stroke="#065F46" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
};

export function IconFor(letter: string) {
  const key = letter.toUpperCase();
  return IconMap[key] ?? null;
}