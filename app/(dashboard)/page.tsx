'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import StatusPipeline from '@/components/StatusPipeline';
import ProjectTable from '@/components/ProjectTable';
import ActivityFeed from '@/components/ActivityFeed';
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

  const atRiskValue = computeAtRiskValue(variations);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>

      {/* ─── Header (Simplified, Dark Navy to match Sidebar/Home) ─── */}
      <header style={{
        position: 'fixed', top: 0, left: 240, right: 0, zIndex: 90,
        height: '64px',
        padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
      }}>
        {/* Left: Breadcrumb/Title */}
        <h1 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700, fontSize: 20,
          color: '#111827',
          letterSpacing: '-0.02em',
        }}>
          Variation Register
        </h1>

        {/* Right: Actions/Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 12px',
            background: '#F0FDF4', border: '1px solid #BBF7D0',
            borderRadius: 100,
          }}>
            <div className="live-dot" style={{ width: 6, height: 6, background: '#22C55E' }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12, fontWeight: 600,
              color: '#15803D',
              letterSpacing: '0.05em',
            }}>LIVE</span>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#64748B' }}>
              {formatDateTime(currentTime)}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Content ─── */}
      <div style={{ paddingTop: 64, position: 'relative' }}>
        <div style={{ padding: '32px', maxWidth: 1600, margin: '0 auto' }}>

          {/* ─── VARIATION STATUS ─── */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#64748B', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pipeline Status
            </div>
            <StatusPipeline extraCards={[{
              title: 'At Risk',
              value: atRiskValue,
              isCurrency: true,
              accentColor: '#EA580C', // Orange-600
              subtitle: 'Captured + Submitted',
            }]} />
          </div>

          {/* ─── STACKED LAYOUT (Projects then Activity) ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <ProjectTable />
            <ActivityFeed />
          </div>

        </div>
      </div>
    </div>
  );
}
