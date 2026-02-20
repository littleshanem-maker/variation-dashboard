'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { formatCurrencyCompact } from '@/lib/mockData';

const STATUSES = [
  { key: 'Captured',  label: 'Draft',     color: '#F59E0B' },
  { key: 'Submitted', label: 'Submitted',  color: '#3b82f6' },
  { key: 'Approved',  label: 'Approved',   color: '#22C55E' },
  { key: 'Paid',      label: 'Paid',       color: '#6366F1' },
  { key: 'Disputed',  label: 'Disputed',   color: '#EF4444' },
  { key: 'at-risk',   label: 'At Risk',    color: '#F59E0B' },
] as const;

export default function ProjectTable() {
  const router = useRouter();
  const { projects, getVariationsByProjectId, variations: allVariations } = useAppStore();

  const thStyle = (align: 'left' | 'center' | 'right', color = '#94a3b8') => ({
    paddingBottom: 12,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    fontWeight: 700 as const,
    color,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.12em',
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
    <div className="section-card" style={{ padding: '28px 24px' }}>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <th style={thStyle('left')}>Project</th>
              <th style={thStyle('center')}>Vars</th>
              {STATUSES.map(s => (
                <th key={s.key} style={thStyle('right', s.color)}>{s.label}</th>
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
                  style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 12px 14px 0' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>{project.name}</div>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{project.contractType}</div>
                  </td>

                  <td style={{ padding: '14px 0', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      background: 'rgba(59,130,246,0.08)',
                      color: '#3b82f6',
                      padding: '3px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {variations.length}
                    </span>
                  </td>

                  {STATUSES.map(s => {
                    const val = getVal(s.key);
                    return (
                      <td key={s.key} style={{ padding: '14px 0', textAlign: 'right', fontWeight: 600, color: val > 0 ? s.color : '#d1d5db' }}>
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
              <tr style={{ borderTop: '2px solid #e2e8f0' }}>
                <td style={{ padding: '12px 12px 4px 0', fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  Totals
                </td>
                <td style={{ padding: '12px 0 4px', textAlign: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: '#3b82f6' }}>
                  {grandVars}
                </td>
                {STATUSES.map(s => (
                  <td key={s.key} style={{ padding: '12px 0 4px', textAlign: 'right', fontWeight: 700, color: (grandTotal[s.key] ?? 0) > 0 ? s.color : '#d1d5db', fontSize: 13 }}>
                    {(grandTotal[s.key] ?? 0) > 0 ? formatCurrencyCompact(grandTotal[s.key]) : '—'}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>

        {projects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 14 }}>
            No projects yet
          </div>
        )}
      </div>
    </div>
  );
}
