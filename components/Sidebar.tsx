'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    exact: true,
  },
];

const CTA_ITEMS = [
  {
    href: '/projects/new',
    label: 'New Project',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        <line x1="12" y1="11" x2="12" y2="17" />
        <line x1="9" y1="14" x2="15" y2="14" />
      </svg>
    ),
  },
  {
    href: '/variations/new',
    label: 'New Variation',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean): boolean {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 240,
        height: '100vh',
        background: '#0F172A', // Dark Navy (match homepage footer/nav)
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 200,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            background: '#2563EB', // Brand Blue
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: 14,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          LS
          <span
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: '-0.01em',
            color: '#F1F5F9', // Light text
          }}
        >
          Leveraged Systems
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(item => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                color: active ? '#FFFFFF' : '#94A3B8',
                background: active ? 'rgba(37,99,235,0.15)' : 'transparent',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLElement).style.color = '#F1F5F9';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#94A3B8';
                }
              }}
            >
              <span style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '12px 0' }} />

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {CTA_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                color: '#3B82F6', // Blue-500
                background: 'rgba(37,99,235,0.08)',
                border: '1px solid rgba(37,99,235,0.15)',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = '#2563EB';
                (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                (e.currentTarget as HTMLElement).style.borderColor = '#2563EB';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(37,99,235,0.08)';
                (e.currentTarget as HTMLElement).style.color = '#3B82F6';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,99,235,0.15)';
              }}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* User / Footer */}
      <div
        style={{
          padding: '20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: '50%', background: '#334155',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: 14, fontWeight: 600
        }}>
          SL
        </div>
        <div>
          <div style={{ fontSize: 14, color: 'white', fontWeight: 500 }}>Shane Little</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>Admin</div>
        </div>
      </div>
    </aside>
  );
}
