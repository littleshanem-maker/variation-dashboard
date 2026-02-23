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

function timeAgo(date: Date): string {
  const hrs = Math.floor((Date.now() - date.getTime()) / 3_600_000);
  if (hrs < 1) return 'Just now';
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const STATUS_BADGE_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  Captured:  { bg: 'rgba(245,158,11,0.1)',  color: '#F59E0B', border: 'rgba(245,158,11,0.2)'  },
  Submitted: { bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6', border: 'rgba(59,130,246,0.2)'  },
  Approved:  { bg: 'rgba(34,197,94,0.1)',   color: '#22C55E', border: 'rgba(34,197,94,0.2)'   },
  Paid:      { bg: 'rgba(99,102,241,0.1)',  color: '#6366F1', border: 'rgba(99,102,241,0.2)'  },
  Disputed:  { bg: 'rgba(239,68,68,0.1)',   color: '#EF4444', border: 'rgba(239,68,68,0.2)'   },
};

export default function ActivityFeed() {
  const { variations, getProjectById } = useAppStore();

  // Compute recent activity from store
  const activity = [...variations]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 10);

  return (
    <div className="section-card" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column' }}>
      <h3 className="section-title" style={{ marginBottom: 20 }}>Recent Activity</h3>

      <div style={{ flex: 1, maxHeight: 380, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {activity.map((v, i) => {
          const project = getProjectById(v.projectId);
          const isNew = i < 3;
          const badge = STATUS_BADGE_STYLE[v.status] ?? STATUS_BADGE_STYLE.Submitted;

          return (
            <Link
              key={v.id}
              href={`/variations/${v.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: 10,
                  border: `1px solid ${isNew ? 'rgba(59,130,246,0.2)' : '#e2e8f0'}`,
                  background: isNew ? 'rgba(59,130,246,0.02)' : '#fafafa',
                  transition: 'border-color 0.2s, background 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = '#f1f5f9';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.3)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = isNew ? 'rgba(59,130,246,0.02)' : '#fafafa';
                  (e.currentTarget as HTMLElement).style.borderColor = isNew ? 'rgba(59,130,246,0.2)' : '#e2e8f0';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>
                      {timeAgo(v.updatedAt)} · {project?.name}
                    </div>
                    <div style={{
                      fontWeight: 700, color: '#0f172a', fontSize: 13,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {v.title}
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                      {STATUS_LABELS[v.status] ?? 'updated'} · {formatCurrencyCompact(v.value)}
                    </div>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                      📎 {v.evidenceCount} · {v.instructionSource}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '4px 12px', borderRadius: 100,
                      fontSize: 13, fontWeight: 600, letterSpacing: '0.03em',
                      background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`,
                    }}>
                      {v.status}
                    </span>
                    {isNew && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div className="live-dot" style={{ width: 6, height: 6 }} />
                        <span style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 12, color: '#3b82f6', letterSpacing: '0.08em',
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
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 14 }}>
            No activity yet
          </div>
        )}
      </div>

      <div style={{
        borderTop: '1px solid #e2e8f0',
        marginTop: 16, paddingTop: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 13, color: '#94a3b8' }}>Click a row to view</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="live-dot" style={{ width: 6, height: 6 }} />
          <span style={{ fontSize: 13, color: '#3b82f6' }}>Live</span>
        </div>
      </div>
    </div>
  );
}
