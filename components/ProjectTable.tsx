'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { formatCurrencyCompact } from '@/lib/mockData';

const STATUSES = [
  { key: 'Captured',  label: 'Draft',     color: '#F59E0B' },
  { key: 'Submitted', label: 'Submitted',  color: '#3B82F6' },
  { key: 'Approved',  label: 'Approved',   color: '#10B981' },
  { key: 'Paid',      label: 'Paid',       color: '#475569' },
  { key: 'Disputed',  label: 'Disputed',   color: '#EF4444' },
  { key: 'at-risk',   label: 'At Risk',    color: '#F97316' },
] as const;

export default function ProjectTable() {
  const router = useRouter();
  const { projects, getVariationsByProjectId, variations: allVariations } = useAppStore();

  const thStyle = (align: 'left' | 'center' | 'right') => ({
    paddingBottom: 12,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    fontWeight: 500 as const,
    color: '#6B7280', // Medium grey (neutral)
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    textAlign: align,
  });

  // Compute totals across all variations
  const grandTotal: Record<string, number> = {};
  let grandVars = 0;
  for (const project of projects) {
    const vars = getVariationsByProjectId(project.id);
    grandVars += vars.length;
    for (const s of STATUSES) {
      const val = s.key === 'at-risk'
        ? vars.filter(v => v.status === 'Captured' || v.status === 'Submitted').reduce((sum, v) => sum + v.value, 0)
        : vars.filter(v => v.status === s.key).reduce((sum, v) => sum + v.value, 0);
      grandTotal[s.key] = (grandTotal[s.key] ?? 0) + val;
    }
  }

  return (
    <div className="section-card" style={{ padding: '24px', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
      {/* 2.3 Section Heading */}
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 20 }}>Projects & Activity</h2>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <th style={thStyle('left')}>Project</th>
              <th style={thStyle('center')}>Qty</th>
              {STATUSES.map(s => (
                <th key={s.key} style={thStyle('right')}>
                  {s.label}
                  {s.key === 'at-risk' && (
                    <div style={{ fontSize: 10, fontWeight: 500, color: '#9CA3AF', letterSpacing: '0.04em', textTransform: 'none', marginTop: 2 }}>
                      Captured + Submitted
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const variations = getVariationsByProjectId(project.id);

              const getVal = (key: string) => {
                if (key === 'at-risk') {
                  return variations
                    .filter(v => v.status === 'Captured' || v.status === 'Submitted')
                    .reduce((sum, v) => sum + v.value, 0);
                }
                return variations.filter(v => v.status === key).reduce((sum, v) => sum + v.value, 0);
              };

              return (
                <tr
                  key={project.id}
                  onClick={() => router.push(`/projects/${project.id}`)}
                  style={{ borderBottom: '1px solid #F3F4F6', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '16px 12px 16px 0' }}>
                    <div style={{ fontWeight: 500, color: '#111827', fontSize: 14 }}>{project.name}</div>
                    <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{project.contractType}</div>
                  </td>

                  <td style={{ padding: '16px 0', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      background: '#EFF6FF', // Blue-50
                      color: '#2563EB', // Blue-600
                      padding: '4px 10px',
                      borderRadius: 100, // Pill
                      fontSize: 12,
                      fontWeight: 600,
                      minWidth: 32, // Consistent width
                      textAlign: 'center',
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {variations.length}
                    </span>
                  </td>

                  {STATUSES.map(s => {
                    const val = getVal(s.key);
                    const isAtRisk = s.key === 'at-risk';
                    return (
                      <td key={s.key} style={{ 
                        padding: '16px 0', 
                        textAlign: 'right', 
                        fontWeight: 500, 
                        color: isAtRisk && val > 0 ? '#EA580C' : (val > 0 ? '#111827' : '#D1D5DB'), // Neutral unless at-risk
                        fontSize: 14,
                      }}>
                        {val > 0 ? formatCurrencyCompact(val) : '—'}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>

          {/* Totals row */}
          {projects.length > 0 && (
            <tfoot>
              <tr style={{ borderTop: '2px solid #E5E7EB' }}>
                <td style={{ padding: '16px 12px 4px 0', fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Totals
                </td>
                <td style={{ padding: '16px 0 4px', textAlign: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: '#111827' }}>
                  {grandVars}
                </td>
                {STATUSES.map(s => {
                  const val = grandTotal[s.key] ?? 0;
                  const isAtRisk = s.key === 'at-risk';
                  return (
                    <td key={s.key} style={{ 
                      padding: '16px 0 4px', 
                      textAlign: 'right', 
                      fontWeight: 600, 
                      color: isAtRisk && val > 0 ? '#EA580C' : (val > 0 ? '#111827' : '#D1D5DB'), 
                      fontSize: 14 
                    }}>
                      {val > 0 ? formatCurrencyCompact(val) : '—'}
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          )}
        </table>

        {projects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF', fontSize: 14 }}>
            No projects yet
          </div>
        )}
      </div>
    </div>
  );
}
