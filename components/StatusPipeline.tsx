'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, computeCountByStatus, computeValueByStatus } from '@/lib/store';
import { formatCurrencyCompact } from '@/lib/mockData';

// UPDATED PALETTE (2.1)
const ALL_STATUSES = [
  { key: 'Captured',  label: 'Draft',     accentColor: '#F59E0B', topBorder: '#F59E0B' }, // Amber-500
  { key: 'Submitted', label: 'Submitted', accentColor: '#3B82F6', topBorder: '#3B82F6' }, // Blue-500
  { key: 'Approved',  label: 'Approved',  accentColor: '#10B981', topBorder: '#10B981' }, // Emerald-500
  { key: 'Paid',      label: 'Paid',      accentColor: '#475569', topBorder: '#475569' }, // Slate-600
  { key: 'Disputed',  label: 'Disputed',  accentColor: '#EF4444', topBorder: '#EF4444' }, // Red-500
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
                borderRadius: 12, // 2.2 Standardised Radius
                padding: '16px', // 2.2 Standardised Padding
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                transform: isActive ? 'translateY(-2px)' : undefined,
                boxShadow: isActive ? `0 4px 12px rgba(0,0,0,0.08)` : '0 1px 2px rgba(0,0,0,0.02)', // 2.2 Standardised Shadow
                height: 110, // 2.2 Fixed Height
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Top Border (2.2 3px height) */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 3, background: s.topBorder,
              }} />

              {/* Label (2.2) */}
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 500,
                color: '#6B7280', // Medium Grey
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {s.label}
              </div>

              {/* Count (2.2 32px bold) */}
              <div style={{
                fontSize: 32,
                fontWeight: 700,
                color: s.accentColor,
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>
                {count}
              </div>

              {/* Value (2.2 16px regular dark) */}
              <div style={{
                fontSize: 16,
                fontWeight: 400,
                color: '#111827', // Dark Navy
              }}>
                {formatCurrencyCompact(value)}
              </div>
            </button>
          );
        })}

        {/* Extra stat cards (At Risk) */}
        {extraCards.map((card, i) => {
          const displayValue = card.isCurrency
            ? formatCurrencyCompact(card.value)
            : card.value.toLocaleString();
          
          const isAtRisk = card.title === 'At Risk';
          // 2.2 At Risk Emphasis
          const borderColor = isAtRisk ? '#F97316' : '#e2e8f0'; // Orange-500
          const bgColor = isAtRisk ? '#FFF7ED' : 'white'; // Orange-50
          const topBorderColor = isAtRisk ? '#F97316' : '#e2e8f0';

          return (
            <div key={i} style={{
              background: bgColor,
              border: `1px solid ${borderColor}`,
              borderRadius: 12,
              padding: '16px',
              position: 'relative',
              overflow: 'hidden',
              height: 110,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: topBorderColor }} />
              
              <div style={{ 
                fontFamily: "'DM Sans', sans-serif", 
                fontSize: 12, 
                fontWeight: 600, // Slightly bolder for At Risk
                color: isAtRisk ? '#9A3412' : '#6B7280', // Darker orange or grey
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
              }}>
                {card.title}
              </div>
              
              <div style={{ 
                fontSize: 32, 
                fontWeight: 700, 
                color: card.accentColor ?? '#111827', 
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>
                {displayValue}
              </div>
              
              {card.subtitle && (
                <div style={{ 
                  fontSize: 13, 
                  color: isAtRisk ? '#C2410C' : '#111827', 
                  fontFamily: "'DM Sans', sans-serif",
                  opacity: 0.8
                }}>
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
          marginTop: 16,
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}>
          {filteredVariations.length === 0 ? (
            <div style={{ padding: '24px', fontSize: 14, color: '#6B7280', textAlign: 'center' }}>
              No {activeStatus.toLowerCase()} variations
            </div>
          ) : (
            <>
              <div style={{
                padding: '12px 20px',
                borderBottom: '1px solid #e2e8f0',
                background: '#F9FAFB',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                color: '#6B7280',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
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
                    padding: '16px 20px',
                    background: 'white',
                    border: 'none',
                    borderBottom: i < filteredVariations.length - 1 ? '1px solid #F3F4F6' : 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 14, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {v.title}
                    </div>
                    <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                      {getProjectName(v.projectId)} · {v.instructionSource}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, marginLeft: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{formatCurrencyCompact(v.value)}</div>
                    <div style={{ fontSize: 14, color: '#9CA3AF' }}>→</div>
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
