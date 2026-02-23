'use client';

import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { formatCurrencyCompact } from '@/lib/mockData';

const STATUS_LABELS: Record<string, string> = {
  Captured:  'drafted',
  Submitted: 'submitted for approval',
  Approved:  'approved',
  Paid:      'paid',
  Disputed:  'disputed',
};

// 2.4 Human-readable timestamps
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// 2.1 & 2.4 Updated Palette and Badges
const STATUS_BADGE_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  Captured:  { bg: '#FFF7ED',  color: '#C2410C', border: '#FFEDD5'  }, // Orange-50/700/200
  Submitted: { bg: '#EFF6FF',  color: '#1D4ED8', border: '#DBEAFE'  }, // Blue-50/700/200
  Approved:  { bg: '#ECFDF5',  color: '#047857', border: '#D1FAE5'  }, // Emerald-50/700/200
  Paid:      { bg: '#F8FAFC',  color: '#334155', border: '#E2E8F0'  }, // Slate-50/700/200
  Disputed:  { bg: '#FEF2F2',  color: '#B91C1C', border: '#FEE2E2'  }, // Red-50/700/200
};

export default function ActivityFeed() {
  const { variations, getProjectById } = useAppStore();

  // Compute recent activity from store
  const activity = [...variations]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 10);

  return (
    <div className="section-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
      {/* 2.3 Section Heading style */}
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 20 }}>Recent Activity</h2>

      <div style={{ flex: 1, maxHeight: 380, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {activity.map((v, i) => {
          const project = getProjectById(v.projectId);
          const isNew = i < 3; // First 3 are "new"
          const badge = STATUS_BADGE_STYLE[v.status] ?? STATUS_BADGE_STYLE.Submitted;

          return (
            <Link
              key={v.id}
              href={`/variations/${v.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  padding: '16px',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0', // 2.4 Consistent neutral border
                  background: 'white', // 2.4 Clean white
                  transition: 'border-color 0.15s, background 0.15s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = '#F9FAFB';
                  (e.currentTarget as HTMLElement).style.borderColor = '#D1D5DB';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'white';
                  (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* 2.4 Readable Date */}
                    <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6, fontWeight: 500 }}>
                      {formatDate(v.updatedAt)} · {project?.name}
                    </div>
                    
                    <div style={{
                      fontWeight: 600, color: '#111827', fontSize: 14,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      marginBottom: 4
                    }}>
                      {v.title}
                    </div>
                    
                    <div style={{ fontSize: 13, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{fontWeight: 500, color: '#374151'}}>{formatCurrencyCompact(v.value)}</span>
                      <span>·</span>
                      <span>{v.instructionSource}</span>
                      {v.evidenceCount > 0 && (
                        <>
                          <span>·</span>
                          <span style={{ fontSize: 12, color: '#6B7280' }}>📎 {v.evidenceCount}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                    {/* 2.4 Standardised Badge */}
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '4px 10px', 
                      borderRadius: 100, // Pill
                      fontSize: 11, fontWeight: 600, letterSpacing: '0.03em',
                      textTransform: 'uppercase',
                      background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`,
                    }}>
                      {v.status === 'Captured' ? 'Draft' : v.status}
                    </span>
                    
                    {/* 2.4 NEW Indicator */}
                    {isNew && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3B82F6' }} />
                        <span style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 11, fontWeight: 700, color: '#3B82F6', letterSpacing: '0.05em',
                        }}>NEW</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {activity.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF', fontSize: 14 }}>
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
}
