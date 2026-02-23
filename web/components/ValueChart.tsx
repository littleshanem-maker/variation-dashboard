'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useAppStore, computeValueByStatus } from '@/lib/store';
import { formatCurrencyCompact } from '@/lib/mockData';

const STATUS_COLORS: Record<string, string> = {
  Captured:  '#F59E0B',
  Submitted: '#3b82f6',
  Approved:  '#22C55E',
  Paid:      '#6366F1',
  Disputed:  '#EF4444',
};

export default function ValueChart() {
  const { variations } = useAppStore();
  const valueByStatus = computeValueByStatus(variations);

  const data = Object.entries(valueByStatus)
    .filter(([, v]) => v > 0)
    .map(([status, value]) => ({ name: status, value }));

  const total = data.reduce((s, d) => s + d.value, 0);

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
    cx: number; cy: number; midAngle: number;
    innerRadius: number; outerRadius: number; percent: number;
  }) => {
    if (percent < 0.05) return null;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const rad = Math.PI / 180;
    const x = cx + r * Math.cos(-midAngle * rad);
    const y = cy + r * Math.sin(-midAngle * rad);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
        fontSize="12" fontWeight="700">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomLegend = ({ payload }: { payload?: Array<{ value: string; color: string }> }) => (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: '8px 16px',
      marginTop: 16, justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {(payload ?? []).map((entry, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 10, height: 10, borderRadius: 3,
            backgroundColor: entry.color, flexShrink: 0,
          }} />
          <span style={{ fontSize: 12, color: '#64748b' }}>{entry.value}</span>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            ({formatCurrencyCompact(data.find(d => d.name === entry.value)?.value ?? 0)})
          </span>
        </div>
      ))}
    </div>
  );

  if (data.length === 0) {
    return (
      <div className="section-card" style={{ padding: '28px 24px' }}>
        <h3 className="section-title" style={{ marginBottom: 20 }}>Value by Status</h3>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: 260, color: '#94a3b8',
        }}>
          No variation data available
        </div>
      </div>
    );
  }

  return (
    <div className="section-card" style={{ padding: '28px 24px' }}>
      <h3 className="section-title" style={{ marginBottom: 20 }}>Value by Status</h3>

      <div style={{ position: 'relative', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={60} outerRadius={105}
              labelLine={false}
              label={renderLabel}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={STATUS_COLORS[entry.name] ?? '#94a3b8'} />
              ))}
            </Pie>
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Centre label */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', top: -24,
        }}>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 20, fontWeight: 700,
            color: '#0f172a', letterSpacing: '-0.02em',
          }}>
            {formatCurrencyCompact(total)}
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>Total</div>
        </div>
      </div>
    </div>
  );
}
