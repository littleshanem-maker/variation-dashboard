'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import StatusPipeline from '@/components/StatusPipeline';
import ProjectTable from '@/components/ProjectTable';
import ActivityFeed from '@/components/ActivityFeed';
import ValueChart from '@/components/ValueChart';
import NoticeAlerts from '@/components/NoticeAlerts';
import { useAppStore, computeTotalValue, computeApprovedValue, computePaidValue, computeAtRiskValue, computeAverageDaysToApproval, computeCountByStatus } from '@/lib/store';

export default function Dashboard() {
  const { variations } = useAppStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setLastRefresh(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDateTime = (d: Date) =>
    d.toLocaleString('en-AU', {
      weekday: 'short', month: 'short',
      day: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });

  const totalVariations = variations.length;
  const totalValue      = computeTotalValue(variations);
  const approvedValue   = computeApprovedValue(variations);
  const paidValue       = computePaidValue(variations);
  const atRiskValue     = computeAtRiskValue(variations);
  const avgDays         = computeAverageDaysToApproval(variations);
  const counts          = computeCountByStatus(variations);
  const totalWithOutcome = (counts.Approved ?? 0) + (counts.Disputed ?? 0) + (counts.Paid ?? 0);
  const winRate = totalWithOutcome > 0
    ? Math.round(((counts.Approved ?? 0) + (counts.Paid ?? 0)) / totalWithOutcome * 100)
    : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* ─── Fixed Header ─── */}
      <header style={{
        position: 'fixed', top: 0, left: 220, right: 0, zIndex: 100,
        padding: '0 40px',
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid #e2e8f0',
      }}>
        {/* Left: Title + Live */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700, fontSize: 17,
            letterSpacing: '-0.02em',
            color: '#0f172a',
          }}>
            Variation Register
          </span>

          <span style={{ color: 'rgba(0,0,0,0.15)', fontSize: 18, fontWeight: 300 }}>·</span>

          {/* Live badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 14px',
            background: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: 100,
          }}>
            <div className="live-dot" style={{ width: 6, height: 6 }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, fontWeight: 700,
              color: '#3b82f6',
              letterSpacing: '0.1em',
            }}>LIVE</span>
          </div>
        </div>

        {/* Right: datetime */}
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, color: '#64748b',
            letterSpacing: '0.03em',
          }}>
            {formatDateTime(currentTime)}
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
            Pipeline Construction Services Pty Ltd
          </div>
        </div>
      </header>

      {/* ─── Content ─── */}
      <div style={{ paddingTop: 64, position: 'relative' }}>
        <div style={{ padding: '48px 40px 40px', position: 'relative' }}>

          {/* ─── VARIATION STATUS ─── */}
          <div style={{ marginBottom: 40 }}>
            <div className="label-tag">Variation Status</div>
            <StatusPipeline extraCards={[{
              title: 'At Risk',
              value: atRiskValue,
              isCurrency: true,
              accentColor: '#ea580c',
              subtitle: 'Captured + Submitted',
            }]} />
          </div>

          {/* ─── PROJECTS + ACTIVITY ─── */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="label-tag" style={{ margin: 0 }}>Projects & Activity</div>
              <div className="no-print" style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => window.print()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'transparent', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13 }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
                  </svg>
                  Print
                </button>
                <button
                  onClick={() => {
                    const headers = ['Project', 'Qty', 'Draft', 'Submitted', 'Approved', 'Paid', 'Disputed', 'At Risk'];
                    const csv = [headers.join(',')].join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = 'variation-register.csv'; a.click();
                    URL.revokeObjectURL(url);
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: 'rgba(34,197,94,0.06)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13 }}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <ProjectTable />
              <ActivityFeed />
            </div>
          </div>

          {/* ─── Footer ─── */}
          <footer style={{
            borderTop: '1px solid #e2e8f0',
            paddingTop: 24,
            paddingBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28, height: 28,
                background: '#3b82f6',
                borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700, fontSize: 13, color: 'white',
              }}>
                VC
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#64748b' }}>
                Variation Capture
              </span>
              <span style={{ color: 'rgba(0,0,0,0.15)' }}>·</span>
              <a
                href="https://variationcapture.com.au"
                style={{ fontSize: 13, color: '#3b82f6', textDecoration: 'none' }}
              >
                variationcapture.com.au
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>
                Last refresh: {formatTime(lastRefresh)}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div className="live-dot" style={{ width: 6, height: 6 }} />
                <span style={{ fontSize: 12, color: '#64748b' }}>Auto-refresh every 30s</span>
              </div>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}
