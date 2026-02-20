'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { formatCurrencyCompact } from '@/lib/mockData';

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, getVariationsByProjectId } = useAppStore();

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

      {/* Project Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 20,
      }}>
        {projects.map(project => {
          const variations = getVariationsByProjectId(project.id);
          const totalVal = variations.reduce((s, v) => s + v.value, 0);
          const approvedVal = variations
            .filter(v => v.status === 'Approved' || v.status === 'Paid')
            .reduce((s, v) => s + v.value, 0);
          const pct = totalVal > 0 ? Math.round((approvedVal / totalVal) * 100) : 0;

          return (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 16,
                  padding: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(59,130,246,0.3)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(59,130,246,0.08)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'none';
                  (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                {/* Gradient top border */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: 3,
                  background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                }} />

                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 16, fontWeight: 700,
                      color: '#0f172a',
                      letterSpacing: '-0.01em',
                      marginBottom: 4,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {project.name}
                    </h3>
                    <div style={{ fontSize: 13, color: '#64748b' }}>{project.client}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 12 }}>
                    <span style={{
                      padding: '3px 10px',
                      background: 'rgba(99,102,241,0.08)',
                      color: '#6366f1',
                      border: '1px solid rgba(99,102,241,0.2)',
                      borderRadius: 100,
                      fontSize: 13, fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {project.contractType}
                    </span>
                    <span style={{
                      padding: '3px 10px',
                      background: 'rgba(59,130,246,0.08)',
                      color: '#3b82f6',
                      border: '1px solid rgba(59,130,246,0.2)',
                      borderRadius: 100,
                      fontSize: 13, fontWeight: 700,
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {variations.length} vars
                    </span>
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Total Value</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
                      {formatCurrencyCompact(totalVal)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Approved</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#22C55E', letterSpacing: '-0.02em' }}>
                      {formatCurrencyCompact(approvedVal)}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>
                    <span>Approval progress</span>
                    <span>{pct}%</span>
                  </div>
                  <div style={{ background: '#e2e8f0', borderRadius: 9999, height: 6 }}>
                    <div style={{
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, #3b82f6, #22C55E)',
                      height: 6, borderRadius: 9999,
                      transition: 'width 0.7s ease',
                    }} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
