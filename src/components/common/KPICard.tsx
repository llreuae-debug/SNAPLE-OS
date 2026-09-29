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
  surfaceVariant?: 'sage' | 'blue-grey' | 'lavender' | 'warm' | 'default';
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
  surfaceVariant = 'default'
}) => {
  const variantStyles = {
    default: 'ui-card-tactile',
    sage: 'ui-card-tactile bg-[var(--primary-bg)] border-[var(--primary-border)]',
    'blue-grey': 'ui-card-tactile bg-[var(--secondary-bg)] border-[var(--secondary-border)]',
    lavender: 'ui-card-tactile bg-[var(--accent-bg)] border-[var(--accent-border)]',
    warm: 'ui-card-tactile bg-[var(--warning-bg)] border-[var(--warning-border)]'
  };

  const iconStyles = {
    default: 'bg-[var(--bg-elevated)] text-[var(--primary-text)] border-[var(--border-base)]',
    sage: 'bg-[var(--bg-elevated)] text-[var(--primary-text)] border-[var(--primary-border)]',
    'blue-grey': 'bg-[var(--bg-elevated)] text-[var(--secondary-text)] border-[var(--secondary-border)]',
    lavender: 'bg-[var(--bg-elevated)] text-[var(--accent-text)] border-[var(--accent-border)]',
    warm: 'bg-[var(--bg-elevated)] text-[var(--warning-text)] border-[var(--warning-border)]'
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        variantStyles[surfaceVariant],
        'p-4 sm:p-5 relative flex flex-col justify-between select-none',
        onClick ? 'cursor-pointer' : ''
      )}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {title}
          </p>
          {badge && (
            <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] shadow-xs">
              {badge}
            </span>
          )}
        </div>

        {Icon && (
          <div
            className={clsx(
              'w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-sm',
              iconStyles[surfaceVariant]
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="space-y-1.5">
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
          {value}
        </h3>

        {/* Change / Trend indicator */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {change && (
            <span
              className={clsx(
                'inline-flex items-center gap-0.5 font-bold px-2 py-0.5 rounded-full text-[11px] shadow-xs',
                isPositive
                  ? 'bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]'
                  : 'bg-[var(--danger-bg)] text-[var(--danger-text)] border border-[var(--danger-border)]'
              )}
            >
              {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
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
