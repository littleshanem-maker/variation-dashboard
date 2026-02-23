'use client';

import { useAppStore, computeNoticeAlerts } from '@/lib/store';
import { formatCurrencyCompact } from '@/lib/mockData';

const LEVEL_STYLES = {
  red: {
    bg:     'rgba(239,68,68,0.06)',
    border: 'rgba(239,68,68,0.2)',
    color:  '#EF4444',
    badge:  'OVERDUE',
    bar:    '#EF4444',
    icon:   '🚨',
  },
  amber: {
    bg:     'rgba(245,158,11,0.06)',
    border: 'rgba(245,158,11,0.2)',
    color:  '#F59E0B',
    badge:  'APPROACHING',
    bar:    '#F59E0B',
    icon:   '⚠️',
  },
  green: {
    bg:     'rgba(34,197,94,0.06)',
    border: 'rgba(34,197,94,0.2)',
    color:  '#22C55E',
    badge:  'ON TRACK',
    bar:    '#22C55E',
    icon:   '✅',
  },
};

export default function NoticeAlerts() {
  const { variations, getProjectById } = useAppStore();
  const alerts = computeNoticeAlerts(variations);

  if (alerts.length === 0) {
    return (
      <div className="section-card" style={{ padding: '28px 24px' }}>
        <h3 className="section-title" style={{ marginBottom: 20 }}>Notice Window Alerts</h3>
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          height: 128, gap: 8, color: '#94a3b8',
        }}>
          <span style={{ fontSize: 28 }}>✅</span>
          <span style={{ fontSize: 13 }}>All variations on track</span>
        </div>
      </div>
    );
  }

  return (
    <div className="section-card" style={{ padding: '28px 24px' }}>
      <h3 className="section-title" style={{ marginBottom: 20 }}>Notice Window Alerts</h3>

      <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {alerts.map((alert) => {
          const project = getProjectById(alert.projectId);
          const s = LEVEL_STYLES[alert.alertLevel];
          const pct = Math.min((alert.daysSinceCapture / 28) * 100, 100);

          return (
            <div
              key={alert.id}
              style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
                borderRadius: 10,
                padding: '14px 16px',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'flex-start',
                justifyContent: 'space-between', gap: 12, marginBottom: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{s.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontWeight: 600, color: '#0f172a', fontSize: 13,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {alert.title}
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{project?.name}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                    {formatCurrencyCompact(alert.value)}
                  </div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12, fontWeight: 700,
                    color: s.color, marginTop: 2,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}>
                    {s.badge}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>
                {alert.daysSinceCapture}d since capture · Deadline{' '}
                {alert.deadline.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
              </div>

              <div style={{
                width: '100%',
                background: '#e2e8f0',
                borderRadius: 9999, height: 4,
              }}>
                <div style={{
                  width: `${pct}%`,
                  background: s.bar,
                  height: 4, borderRadius: 9999,
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        borderTop: '1px solid #e2e8f0',
        marginTop: 16, paddingTop: 12,
        display: 'flex', justifyContent: 'space-between',
        fontSize: 12,
      }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <span style={{ color: '#EF4444' }}>
            {alerts.filter(a => a.alertLevel === 'red').length} overdue
          </span>
          <span style={{ color: '#F59E0B' }}>
            {alerts.filter(a => a.alertLevel === 'amber').length} approaching
          </span>
          <span style={{ color: '#22C55E' }}>
            {alerts.filter(a => a.alertLevel === 'green').length} on track
          </span>
        </div>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12, color: '#94a3b8',
          letterSpacing: '0.08em',
        }}>
          28-DAY WINDOW
        </span>
      </div>
    </div>
  );
}
