import React from 'react';
import clsx from 'clsx';
import { useLanguage } from '../../context/LanguageContext';

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  size = 'sm',
  showDot = true
}) => {
  const { t } = useLanguage();

  const getStyle = (s: string) => {
    switch (s.toUpperCase()) {
      case 'VERIFIED':
      case 'QS_VERIFIED':
      case 'ACTIVE':
      case 'ON_TIME':
      case 'BALANCED':
      case 'APPROVED':
      case 'APPROVED_BY_USER':
      case 'VERIFIED_CLOSED':
      case 'PASS':
      case 'ISSUED_FOR_CONSTRUCTION':
        return {
          container: 'bg-[var(--success-bg)] text-[var(--success-text)] border-[var(--success-border)]',
          dot: 'bg-[var(--success-dot)]'
        };
      case 'WARNING':
      case 'VARIANCE_FLAGGED':
      case 'CORRECTION_REQUESTED':
      case 'UNDER_REVIEW':
      case 'MB_VERIFICATION_PENDING':
      case 'PENDING_HUMAN_REVIEW':
      case 'PENDING':
      case 'SUBMITTED':
      case 'PASS_WITH_REMARKS':
      case 'IN_PROGRESS':
      case 'RESERVED':
        return {
          container: 'bg-[var(--warning-bg)] text-[var(--warning-text)] border-[var(--warning-border)]',
          dot: 'bg-[var(--warning-dot)]'
        };
      case 'CRITICAL':
      case 'REJECTED':
      case 'REVERSED':
      case 'FAIL_NCR_RAISED':
      case 'LATE':
      case 'LOST':
        return {
          container: 'bg-[var(--danger-bg)] text-[var(--danger-text)] border-[var(--danger-border)]',
          dot: 'bg-[var(--danger-dot)]'
        };
      case 'SUPERSEDED':
      case 'EXPIRED':
      case 'DRAFT':
      case 'DRAFT_ENTERED':
      case 'CLOSED':
        return {
          container: 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border-[var(--border-strong)]',
          dot: 'bg-[var(--text-muted)]'
        };
      default:
        return {
          container: 'bg-[var(--info-bg)] text-[var(--info-text)] border-[var(--info-border)]',
          dot: 'bg-[var(--info-dot)]'
        };
    }
  };

  const style = getStyle(status);

  const getLabel = (s: string) => {
    const key = `status.${s.toLowerCase()}`;
    return t(key, s.replace(/_/g, ' '));
  };

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs'
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-full border tracking-wide uppercase',
        sizeClasses[size],
        style.container,
        className
      )}
    >
      {showDot && <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', style.dot)} />}
      <span className="font-semibold">{getLabel(status)}</span>
    </span>
  );
};
