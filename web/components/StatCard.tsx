import { formatCurrencyCompact } from '@/lib/mockData';

interface StatCardProps {
  title: string;
  value: number;
  isCurrency?: boolean;
  subtitle?: string;
  accentColor?: string;
  animDelay?: number;
  compact?: boolean;
}

export default function StatCard({
  title,
  value,
  isCurrency = false,
  subtitle,
  accentColor,
  animDelay = 0,
  compact = false,
}: StatCardProps) {
  const displayValue = isCurrency
    ? formatCurrencyCompact(value)
    : value.toLocaleString();

  return (
    <div
      className="stat-card"
      style={{
        animationDelay: `${animDelay * 0.07}s`,
        padding: compact ? '14px 16px' : undefined,
      }}
    >
      <div className="metric-label" style={compact ? { fontSize: 12 } : undefined}>
        {title}
      </div>
      <div
        className="metric-value"
        style={{
          ...(accentColor ? { color: accentColor } : {}),
          ...(compact ? { fontSize: '1.25rem', marginTop: 6 } : {}),
        }}
      >
        {displayValue}
      </div>
      {subtitle && (
        <div style={{
          marginTop: 6,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: compact ? 9 : 11,
          color: '#94a3b8',
          letterSpacing: '0.05em',
        }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
