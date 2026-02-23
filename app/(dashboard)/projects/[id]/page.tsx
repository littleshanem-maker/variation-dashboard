'use client';

import { useState, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProjectById, getVariationsByProjectId, formatCurrency, type Variation } from '@/lib/mockData';

type SortField = 'title' | 'value' | 'status' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

const statusOrder = { Captured: 1, Submitted: 2, Approved: 3, Paid: 4, Disputed: 5 };

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  Captured:  { bg: 'rgba(245,158,11,0.08)',  color: '#f59e0b', border: 'rgba(245,158,11,0.2)'  },
  Submitted: { bg: 'rgba(99,102,241,0.08)',  color: '#6366f1', border: 'rgba(99,102,241,0.2)'  },
  Approved:  { bg: 'rgba(34,197,94,0.08)',   color: '#16a34a', border: 'rgba(34,197,94,0.2)'   },
  Paid:      { bg: 'rgba(20,184,166,0.08)',  color: '#0d9488', border: 'rgba(20,184,166,0.2)'  },
  Disputed:  { bg: 'rgba(239,68,68,0.08)',   color: '#dc2626', border: 'rgba(239,68,68,0.2)'   },
};

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const project = getProjectById(projectId);
  const variations = getVariationsByProjectId(projectId);

  const sorted = useMemo(() => {
    return [...variations].sort((a, b) => {
      let av: any, bv: any;
      if (sortField === 'title')          { av = a.title.toLowerCase();   bv = b.title.toLowerCase(); }
      else if (sortField === 'value')     { av = a.value;                  bv = b.value; }
      else if (sortField === 'status')    { av = statusOrder[a.status as keyof typeof statusOrder]; bv = statusOrder[b.status as keyof typeof statusOrder]; }
      else if (sortField === 'createdAt') { av = a.createdAt.getTime();    bv = b.createdAt.getTime(); }
      else                                { av = a.updatedAt.getTime();    bv = b.updatedAt.getTime(); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ?  1 : -1;
      return 0;
    });
  }, [variations, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const sortArrow = (field: SortField) =>
    sortField !== field ? ' ↕' : sortDir === 'asc' ? ' ↑' : ' ↓';

  const exportCSV = useCallback(() => {
    const headers = ['Title', 'Description', 'Value', 'Status', 'Instruction Source', 'Evidence', 'Created', 'Updated'];
    const rows = sorted.map(v => [
      `"${v.title.replace(/"/g, '""')}"`,
      `"${v.description.replace(/"/g, '""')}"`,
      (v.value / 100).toFixed(2),
      v.status,
      `"${v.instructionSource.replace(/"/g, '""')}"`,
      v.evidenceCount,
      formatDate(v.createdAt),
      formatDate(v.updatedAt),
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.name ?? 'project'}-variations.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [sorted, project]);

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Project not found</h2>
          <button onClick={() => router.push('/')} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
        </div>
      </div>
    );
  }

  const totalVal    = variations.reduce((s, v) => s + v.value, 0);
  const approvedVal = variations.filter(v => v.status === 'Approved' || v.status === 'Paid').reduce((s, v) => s + v.value, 0);
  const paidVal     = variations.filter(v => v.status === 'Paid').reduce((s, v) => s + v.value, 0);
  const atRiskVal   = variations.filter(v => v.status === 'Captured' || v.status === 'Submitted').reduce((s, v) => s + v.value, 0);

  const stats = [
    { label: 'Variation Value', value: formatCurrency(totalVal),    color: '#0f172a', subtitle: undefined },
    { label: 'Approved',        value: formatCurrency(approvedVal), color: '#16a34a', subtitle: undefined },
    { label: 'Paid',            value: formatCurrency(paidVal),     color: '#0d9488', subtitle: undefined },
    { label: 'At Risk',         value: formatCurrency(atRiskVal),   color: '#ea580c', subtitle: 'Captured + Submitted' },
  ];

  const btnStyle = (color: string, bg: string, border: string): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '7px 14px',
    background: bg, color, border: `1px solid ${border}`,
    borderRadius: 8, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600, fontSize: 13,
  });

  const thStyle: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12, fontWeight: 600,
    color: '#94a3b8', letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '12px 16px', textAlign: 'left',
    borderBottom: '1px solid #e2e8f0',
    cursor: 'pointer', whiteSpace: 'nowrap',
    background: '#f8fafc',
  };

  const canEdit = (v: Variation) => v.status === 'Captured' || v.status === 'Submitted';

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* ─── Fixed Header ─── */}
      <header style={{
        position: 'fixed', top: 0, left: 220, right: 0, zIndex: 100,
        padding: '0 40px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.push('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 14, fontFamily: "'DM Sans', sans-serif", padding: '6px 10px', borderRadius: 6 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#3b82f6')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Variation Register
          </button>
          <span style={{ color: '#e2e8f0' }}>/</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em', color: '#0f172a' }}>
            {project.name}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ padding: '4px 12px', background: 'rgba(99,102,241,0.08)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 100, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            {project.contractType}
          </span>
          <span style={{ padding: '4px 12px', background: 'rgba(59,130,246,0.08)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 100, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            {variations.length} variations
          </span>
        </div>
      </header>

      {/* ─── Content ─── */}
      <div style={{ paddingTop: 64 }}>
        <div style={{ padding: '48px 40px 40px' }}>

          {/* ─── PROJECT OVERVIEW ─── */}
          <div style={{ marginBottom: 40 }}>
            <div className="label-tag">Project Overview</div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '28px 32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #3b82f6, #6366f1)' }} />
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: 6 }}>
                  {project.name}
                </h1>
                <div style={{ display: 'flex', gap: 24, fontSize: 14, color: '#64748b', fontFamily: "'DM Sans', sans-serif" }}>
                  <span><span style={{ color: '#94a3b8' }}>Client:</span> {project.client}</span>
                  <span><span style={{ color: '#94a3b8' }}>Contract:</span> {project.contractType}</span>
                  <span><span style={{ color: '#94a3b8' }}>Variations:</span> {variations.length}</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                {stats.map(s => (
                  <div key={s.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 20px' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: s.color, fontFamily: "'DM Sans', sans-serif" }}>
                      {s.value}
                    </div>
                    {s.subtitle && (
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>
                        {s.subtitle}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── VARIATIONS TABLE ─── */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="label-tag" style={{ margin: 0 }}>Variations</div>
              {/* Export toolbar */}
              <div className="no-print" style={{ display: 'flex', gap: 8 }}>
                <button
                  style={btnStyle('#64748b', 'transparent', '#e2e8f0')}
                  onClick={() => window.print()}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
                  </svg>
                  Print
                </button>
                <button
                  style={btnStyle('#16a34a', 'rgba(34,197,94,0.06)', 'rgba(34,197,94,0.2)')}
                  onClick={exportCSV}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(34,197,94,0.06)'; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Export CSV
                </button>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
              {variations.length === 0 ? (
                <div style={{ padding: '60px 40px', textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                  <p style={{ color: '#64748b', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>No variations on this project yet.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {[
                        { label: 'Variation',  field: 'title'     as SortField },
                        { label: 'Value',      field: 'value'     as SortField },
                        { label: 'Status',     field: 'status'    as SortField },
                        { label: 'Created',    field: 'createdAt' as SortField },
                        { label: 'Updated',    field: 'updatedAt' as SortField },
                        { label: 'Evidence',   field: null },
                        { label: '',           field: null },
                      ].map((col, i) => (
                        <th
                          key={i}
                          style={{ ...thStyle, textAlign: col.label === 'Value' ? 'right' as const : 'left' as const, cursor: col.field ? 'pointer' : 'default' }}
                          onClick={() => col.field && toggleSort(col.field)}
                        >
                          {col.label}{col.field ? sortArrow(col.field) : ''}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((v, i) => {
                      const s = STATUS_STYLES[v.status] ?? STATUS_STYLES.Captured;
                      const isExpanded = expandedId === v.id;
                      const editable = canEdit(v);
                      return (
                        <>
                          <tr
                            key={v.id}
                            style={{
                              borderBottom: isExpanded ? 'none' : (i < sorted.length - 1 ? '1px solid #f1f5f9' : 'none'),
                              cursor: 'pointer',
                              background: isExpanded ? '#f8fafc' : 'transparent',
                              transition: 'background 0.1s',
                            }}
                            onClick={() => setExpandedId(isExpanded ? null : v.id)}
                            onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = '#f8fafc'; }}
                            onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = 'transparent'; }}
                          >
                            {/* Title */}
                            <td style={{ padding: '16px', maxWidth: 280 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>
                                  <polyline points="9 18 15 12 9 6"/>
                                </svg>
                                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, color: '#0f172a' }}>
                                  {v.title}
                                </span>
                              </div>
                            </td>
                            {/* Value */}
                            <td style={{ padding: '16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: '#0f172a' }}>
                                {formatCurrency(v.value)}
                              </span>
                            </td>
                            {/* Status */}
                            <td style={{ padding: '16px' }}>
                              <span style={{ padding: '4px 12px', background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 100, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>
                                {v.status === 'Captured' ? 'Draft' : v.status}
                              </span>
                            </td>
                            {/* Created */}
                            <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                              <span style={{ fontSize: 13, color: '#64748b', fontFamily: "'DM Sans', sans-serif" }}>{formatDate(v.createdAt)}</span>
                            </td>
                            {/* Updated */}
                            <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                              <span style={{ fontSize: 13, color: '#64748b', fontFamily: "'DM Sans', sans-serif" }}>{formatDate(v.updatedAt)}</span>
                            </td>
                            {/* Evidence */}
                            <td style={{ padding: '16px' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(59,130,246,0.08)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 100, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                                📎 {v.evidenceCount}
                              </span>
                            </td>
                            {/* Edit button */}
                            <td style={{ padding: '16px' }} onClick={e => e.stopPropagation()}>
                              {editable && (
                                <Link href={`/variations/${v.id}/edit`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: 'rgba(59,130,246,0.08)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", textDecoration: 'none' }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#3b82f6'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.08)'; (e.currentTarget as HTMLElement).style.color = '#3b82f6'; }}
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                  </svg>
                                  Edit
                                </Link>
                              )}
                            </td>
                          </tr>
                          {/* Expanded detail row */}
                          {isExpanded && (
                            <tr key={`${v.id}-detail`} style={{ borderBottom: i < sorted.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                              <td colSpan={7} style={{ padding: '0 16px 16px 40px', background: '#f8fafc' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, padding: '16px 0' }}>
                                  <div>
                                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>Description</div>
                                    <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                                      {v.description || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No description</span>}
                                    </div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>Instruction Source</div>
                                    <div style={{ fontSize: 13, color: '#374151', fontFamily: "'DM Sans', sans-serif" }}>
                                      {v.instructionSource || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not specified</span>}
                                    </div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>Evidence</div>
                                    <div style={{ fontSize: 13, color: '#374151', fontFamily: "'DM Sans', sans-serif" }}>
                                      {v.evidenceCount} item{v.evidenceCount !== 1 ? 's' : ''} attached
                                    </div>
                                    {!editable && (
                                      <div style={{ marginTop: 8, fontSize: 12, color: '#94a3b8', fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic' }}>
                                        Locked — {v.status} variations cannot be edited
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
