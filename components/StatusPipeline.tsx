'use client';

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, computeCountByStatus, computeValueByStatus } from '@/lib/store';
import { formatCurrencyCompact } from '@/lib/mockData';

const ALL_STATUSES = [
  { key: 'Captured',  label: 'Draft',     accentColor: '#F59E0B', grad: 'linear-gradient(90deg, #F59E0B, #F97316)' },
  { key: 'Submitted', label: 'Submitted', accentColor: '#3b82f6', grad: 'linear-gradient(90deg, #3b82f6, #6366f1)' },
  { key: 'Approved',  label: 'Approved',  accentColor: '#22C55E', grad: 'linear-gradient(90deg, #22C55E, #10b981)' },
  { key: 'Paid',      label: 'Paid',      accentColor: '#6366F1', grad: 'linear-gradient(90deg, #6366f1, #8b5cf6)' },
  { key: 'Disputed',  label: 'Disputed',  accentColor: '#EF4444', grad: 'linear-gradient(90deg, #EF4444, #f97316)' },
] as const;

interface ExtraCard {
  title: string;
  value: number;
  isCurrency?: boolean;
  accentColor?: string;
  subtitle?: string;
}

interface Props {
  extraCards?: ExtraCard[];
}

export default function StatusPipeline({ extraCards = [] }: Props) {
  const router = useRouter();
  const { variations, projects } = useAppStore();
  const counts = computeCountByStatus(variations);
  const values = computeValueByStatus(variations);
  const [activeStatus, setActiveStatus] = useState<string | null>(null);

  const filteredVariations = activeStatus
    ? variations.filter(v => v.status === activeStatus)
    : [];

  const activeConfig = ALL_STATUSES.find(s => s.key === activeStatus);

  const getProjectName = (projectId: string) =>
    projects.find(p => p.id === projectId)?.name ?? 'Unknown Project';

  return (
    <div>
      {/* All boxes in one row */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${5 + extraCards.length}, 1fr)`, gap: 12 }}>
        {ALL_STATUSES.map((s) => {
          const count = counts[s.key] ?? 0;
          const value = values[s.key] ?? 0;
          const isActive = activeStatus === s.key;

          return (
            <button
              key={s.key}
              onClick={() => setActiveStatus(prev => prev === s.key ? null : s.key)}
              style={{
                background: 'white',
                border: isActive ? `1px solid ${s.accentColor}` : '1px solid #e2e8f0',
                borderRadius: 10,
                padding: '14px 16px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                transform: isActive ? 'translateY(-2px)' : undefined,
                boxShadow: isActive ? `0 4px 12px rgba(0,0,0,0.08)` : 'none',
              }}
            >
              {/* Gradient top border */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 3, background: s.grad,
              }} />

              {/* Label */}
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginTop: 4,
              }}>
                {s.label}
              </div>

              {/* Count */}
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: s.accentColor,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                marginTop: 6,
              }}>
                {count}
              </div>

              {/* Value */}
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#0f172a',
                marginTop: 6,
              }}>
                {formatCurrencyCompact(value)}
              </div>
            </button>
          );
        })}

        {/* Extra stat cards in the same row */}
        {extraCards.map((card, i) => {
          const displayValue = card.isCurrency
            ? formatCurrencyCompact(card.value)
            : card.value.toLocaleString();
          return (
            <div key={i} style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              padding: '14px 16px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #e2e8f0, #cbd5e1)' }} />
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4 }}>
                {card.title}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: card.accentColor ?? '#0f172a', letterSpacing: '-0.03em', lineHeight: 1, marginTop: 6 }}>
                {displayValue}
              </div>
              {card.subtitle && (
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 5, fontFamily: "'DM Sans', sans-serif" }}>
                  {card.subtitle}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded variation list */}
      {activeStatus && activeConfig && (
        <div style={{
          marginTop: 12,
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: 10,
          overflow: 'hidden',
        }}>
          {filteredVariations.length === 0 ? (
            <div style={{ padding: '20px 24px', fontSize: 13, color: '#94a3b8', textAlign: 'center' }}>
              No {activeStatus.toLowerCase()} variations
            </div>
          ) : (
            <>
              <div style={{
                padding: '10px 16px',
                borderBottom: '1px solid #e2e8f0',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}>
                {filteredVariations.length} {activeStatus === 'Captured' ? 'Draft' : activeStatus} variation{filteredVariations.length !== 1 ? 's' : ''}
              </div>
              {filteredVariations.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => router.push(`/variations/${v.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '12px 16px',
                    background: 'white',
                    border: 'none',
                    borderBottom: i < filteredVariations.length - 1 ? '1px solid #f1f5f9' : 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {v.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                      {getProjectName(v.projectId)} · {v.instructionSource}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, marginLeft: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{formatCurrencyCompact(v.value)}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>→</div>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
