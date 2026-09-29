import React, { useState } from 'react';

// ----------------------------------------------------------------------------
// 1. Interactive Area Trend Chart (e.g. DWR Compliance, Revenue, SPI S-Curve)
// ----------------------------------------------------------------------------

interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

interface AreaTrendChartProps {
  data: DataPoint[];
  height?: number;
  valuePrefix?: string;
  valueSuffix?: string;
  color?: string; // e.g. '#7D9B91' (Soft Sage)
  secondaryColor?: string;
}

export const AreaTrendChart: React.FC<AreaTrendChartProps> = ({
  data,
  height = 180,
  valuePrefix = '',
  valueSuffix = '',
  color = '#7D9B91',
  secondaryColor = '#8299A2'
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const width = 600;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const allValues = data.flatMap((d) => [d.value, d.secondaryValue || 0]);
  const maxValue = Math.max(...allValues) * 1.15 || 100;
  const minValue = 0;

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) => padding.top + chartHeight - ((val - minValue) / (maxValue - minValue)) * chartHeight;

  // Build SVG Path strings
  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');
  const areaPoints = `${getX(0)},${padding.top + chartHeight} ${points} ${getX(data.length - 1)},${padding.top + chartHeight}`;

  const hasSecondary = data.some((d) => d.secondaryValue !== undefined);
  const secondaryPoints = hasSecondary
    ? data.map((d, i) => `${getX(i)},${getY(d.secondaryValue || 0)}`).join(' ')
    : '';

  return (
    <div className="w-full select-none relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal subtle grid lines */}
        {[0, 0.33, 0.66, 1].map((ratio, i) => {
          const y = padding.top + chartHeight * ratio;
          return (
            <line
              key={i}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="var(--border-base)"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
          );
        })}

        {/* Shaded Area */}
        <polygon points={areaPoints} fill="url(#areaGradient)" />

        {/* Secondary Line (if present) */}
        {hasSecondary && (
          <polyline
            points={secondaryPoints}
            fill="none"
            stroke={secondaryColor}
            strokeWidth="2"
            strokeDasharray="4 3"
          />
        )}

        {/* Main Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data Point Dots & Hover Hotspots */}
        {data.map((d, i) => {
          const cx = getX(i);
          const cy = getY(d.value);
          const isHovered = hoverIndex === i;

          return (
            <g key={i} onMouseEnter={() => setHoverIndex(i)} className="cursor-pointer">
              {/* Invisible touch area */}
              <circle cx={cx} cy={cy} r="16" fill="transparent" />

              {/* Visible circle */}
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? '5.5' : '3.5'}
                fill="var(--bg-elevated)"
                stroke={color}
                strokeWidth={isHovered ? '3' : '2'}
                className="transition-all duration-150"
              />

              {/* X Axis Label */}
              <text
                x={cx}
                y={height - 8}
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize="10"
                fontFamily="inherit"
                fontWeight="500"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Interactive Tooltip Callout */}
      {hoverIndex !== null && (
        <div
          className="absolute z-10 ui-surface-elevated rounded-2xl px-3 py-2 text-xs font-semibold shadow-xl border border-[var(--border-base)] pointer-events-none transform -translate-x-1/2 -translate-y-full -top-1"
          style={{ left: `${(getX(hoverIndex) / width) * 100}%` }}
        >
          <div className="text-[10px] text-[var(--text-muted)]">{data[hoverIndex].label}</div>
          <div className="text-[var(--text-primary)] font-bold">
            {valuePrefix}
            {data[hoverIndex].value.toLocaleString()}
            {valueSuffix}
          </div>
          {data[hoverIndex].secondaryValue !== undefined && (
            <div className="text-[10px] text-[var(--secondary-text)]">
              Target: {valuePrefix}
              {data[hoverIndex].secondaryValue?.toLocaleString()}
              {valueSuffix}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------------
// 2. Bar Comparison Chart (e.g. Receipts vs Expenses by Company)
// ----------------------------------------------------------------------------

interface BarGroup {
  label: string;
  series1: number;
  series2: number;
}

interface BarComparisonChartProps {
  data: BarGroup[];
  height?: number;
  series1Name?: string;
  series2Name?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

export const BarComparisonChart: React.FC<BarComparisonChartProps> = ({
  data,
  height = 170,
  series1Name = 'Receipts',
  series2Name = 'Expenses',
  valuePrefix = 'PKR ',
  valueSuffix = 'M'
}) => {
  const maxVal = Math.max(...data.flatMap((d) => [d.series1, d.series2])) * 1.2 || 10;

  return (
    <div className="w-full space-y-3 select-none">
      {/* Legend */}
      <div className="flex items-center justify-end gap-4 text-xs">
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary-500)] shadow-xs" />
          <span>{series1Name}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--danger-dot)] shadow-xs" />
          <span>{series2Name}</span>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="flex items-end justify-between gap-3 pt-2" style={{ height: `${height}px` }}>
        {data.map((item, i) => {
          const h1 = (item.series1 / maxVal) * 100;
          const h2 = (item.series2 / maxVal) * 100;

          return (
            <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
              <div className="w-full flex items-end justify-center gap-2 h-full max-w-[56px]">
                {/* Series 1 Bar */}
                <div
                  className="flex-1 bg-[var(--primary-500)] hover:brightness-110 rounded-t-xl transition-all duration-300 relative group/bar shadow-xs"
                  style={{ height: `${Math.max(h1, 6)}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-[var(--bg-elevated)] border border-[var(--border-base)] text-[var(--text-primary)] text-[10px] font-bold px-2 py-0.5 rounded-xl shadow-lg whitespace-nowrap z-20 pointer-events-none">
                    {valuePrefix}{item.series1}{valueSuffix}
                  </div>
                </div>

                {/* Series 2 Bar */}
                <div
                  className="flex-1 bg-[var(--danger-dot)] hover:brightness-110 rounded-t-xl transition-all duration-300 relative group/bar shadow-xs"
                  style={{ height: `${Math.max(h2, 6)}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-[var(--bg-elevated)] border border-[var(--border-base)] text-[var(--text-primary)] text-[10px] font-bold px-2 py-0.5 rounded-xl shadow-lg whitespace-nowrap z-20 pointer-events-none">
                    {valuePrefix}{item.series2}{valueSuffix}
                  </div>
                </div>
              </div>

              {/* Label */}
              <span className="text-[11px] font-medium text-[var(--text-muted)] mt-2 text-center truncate max-w-full">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// 3. Compact Ring Donut Chart (e.g. Budget / Execution Percentage)
// ----------------------------------------------------------------------------

interface DonutMetricProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  sublabel?: string;
  color?: string;
}

export const DonutMetric: React.FC<DonutMetricProps> = ({
  percentage,
  size = 110,
  strokeWidth = 10,
  label,
  sublabel,
  color = '#7D9B91'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--border-base)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-base font-extrabold text-[var(--text-primary)] leading-none">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="space-y-0.5">
        <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">{label}</h4>
        {sublabel && <p className="text-xs text-[var(--text-secondary)]">{sublabel}</p>}
      </div>
    </div>
  );
};
