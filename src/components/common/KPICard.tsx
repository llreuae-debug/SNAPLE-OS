import React from 'react';
import clsx from 'clsx';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  target?: string;
  icon?: LucideIcon;
  subtitle?: string;
  badge?: string;
  onClick?: () => void;
  accentColor?: 'indigo' | 'emerald' | 'amber' | 'cyan' | 'rose';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  target,
  icon: Icon,
  subtitle,
  badge,
  onClick,
  accentColor = 'indigo'
}) => {
  const accentClasses = {
    indigo: 'text-[#6366F1] bg-[var(--primary-bg)] border-[var(--primary-border)]',
    emerald: 'text-[#10B981] bg-[var(--success-bg)] border-[var(--success-border)]',
    amber: 'text-[#F59E0B] bg-[var(--warning-bg)] border-[var(--warning-border)]',
    cyan: 'text-[#06B6D4] bg-[var(--info-bg)] border-[var(--info-border)]',
    rose: 'text-[#EF4444] bg-[var(--danger-bg)] border-[var(--danger-border)]'
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'ui-surface rounded-2xl p-4 sm:p-5 relative flex flex-col justify-between select-none',
        onClick ? 'ui-card-interactive cursor-pointer' : ''
      )}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {title}
          </p>
          {badge && (
            <span className="inline-block text-[10px] font-bold px-1.5 py-0.2 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
              {badge}
            </span>
          )}
        </div>

        {Icon && (
          <div
            className={clsx(
              'w-8 h-8 rounded-xl border flex items-center justify-center shrink-0',
              accentClasses[accentColor]
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
          {value}
        </h3>

        {/* Change / Trend indicator */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {change && (
            <span
              className={clsx(
                'inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded-md text-[11px]',
                isPositive
                  ? 'bg-[var(--success-bg)] text-[var(--success-text)]'
                  : 'bg-[var(--danger-bg)] text-[var(--danger-text)]'
              )}
            >
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {change}
            </span>
          )}

          {target && (
            <span className="text-[var(--text-muted)] text-[11px]">
              vs target <strong className="text-[var(--text-secondary)] font-semibold">{target}</strong>
            </span>
          )}

          {subtitle && !target && (
            <span className="text-[var(--text-muted)] text-[11px]">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
};
