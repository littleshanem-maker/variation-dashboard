'use client';

import Link from 'next/link';
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

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, getVariationsByProjectId } = useAppStore();

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

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px' }}>

      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
      }}>
        <div>
          <div className="label-tag" style={{ marginBottom: 4 }}>All Projects</div>
          <h1 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 28, fontWeight: 700,
            letterSpacing: '-0.03em',
            color: '#0f172a',
          }}>
            Projects
          </h1>
        </div>
        <button
          onClick={() => router.push('/projects/new')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#2563eb')}
          onMouseLeave={e => (e.currentTarget.style.background = '#3b82f6')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Project
        </button>
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 16,
          padding: '80px 40px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>No projects yet</h3>
          <p style={{ color: '#64748b', marginBottom: 24 }}>Create your first project to start tracking variations</p>
          <Link
            href="/projects/new"
            style={{
              display: 'inline-block',
              padding: '10px 24px',
              background: '#3b82f6',
              color: 'white',
              borderRadius: 10,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            New Project
          </Link>
        </div>
      )}

      {/* Projects Table */}
      {projects.length > 0 && (
        <div className="section-card" style={{ padding: '28px 24px', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={thStyle('left')}>Project</th>
                  <th style={thStyle('center')}>Qty</th>
                  {STATUSES.map(s => (
                    <th key={s.key} style={thStyle('right', s.color)}>
                      {s.label}
                      {s.key === 'at-risk' && (
                        <div style={{ fontSize: 10, fontWeight: 500, color: '#94a3b8', letterSpacing: '0.04em', textTransform: 'none', marginTop: 2 }}>
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
                      style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 12px 14px 0' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{project.name}</div>
                        <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                          {project.client} · <span style={{color: '#94a3b8'}}>{project.contractType}</span>
                        </div>
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
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
