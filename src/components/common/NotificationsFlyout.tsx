import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  FileCheck,
  Info,
  X
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  type: 'CRITICAL' | 'ACTION_REQUIRED' | 'INFO';
  title: string;
  description: string;
  timestamp: string;
  tabId: string;
  isRead: boolean;
}

interface NotificationsFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string) => void;
}

export const NotificationsFlyout: React.FC<NotificationsFlyoutProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'ACTION_REQUIRED'>('ALL');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'CRITICAL',
      title: 'Contractor IPC #06 Claim Has Unverified MB Quantities',
      description: 'Deduct PKR 450,000 or require Lead QS verification before release.',
      timestamp: '15m ago',
      tabId: 'projects',
      isRead: false
    },
    {
      id: 'notif-2',
      type: 'ACTION_REQUIRED',
      title: 'Supervisor DWR Verification Waiting (24h SLA)',
      description: 'Civil Site Supervisor submitted concrete pour checklist for Floor 4.',
      timestamp: '45m ago',
      tabId: 'dwr',
      isRead: false
    },
    {
      id: 'notif-3',
      type: 'ACTION_REQUIRED',
      title: 'SOP Acknowledgement Required: SOP-ENG-042',
      description: 'Site Measurement Book & Contractor Bill Certification Manual v3.0.',
      timestamp: '2h ago',
      tabId: 'hr',
      isRead: false
    },
    {
      id: 'notif-4',
      type: 'INFO',
      title: 'Daily Financial Closing Balanced',
      description: 'DAGMAR / GCH closing verified with zero variance by Finance Controller.',
      timestamp: 'Yesterday',
      tabId: 'finance',
      isRead: true
    }
  ]);

  if (!isOpen) return null;

  const filteredList = notifications.filter((n) => {
    if (filter === 'ALL') return true;
    return n.type === filter;
  });

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClickItem = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
    );
    onNavigate(item.tabId);
    onClose();
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 ui-surface-elevated rounded-[24px] shadow-2xl border border-[var(--border-base)] z-50 overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-base)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[var(--primary-bg)] text-[var(--primary-text)] border border-[var(--primary-border)] flex items-center justify-center">
            <Bell className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-[var(--text-primary)]">Notifications</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--danger-bg)] text-[var(--danger-text)] border border-[var(--danger-border)]">
            {notifications.filter((n) => !n.isRead).length} New
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            className="text-[11px] text-[var(--primary-text)] hover:underline font-semibold"
          >
            Mark all read
          </button>
          <button onClick={onClose} className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 pt-2 pb-2 flex gap-1.5 border-b border-[var(--border-subtle)] text-[11px]">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1 rounded-xl font-semibold transition ${
            filter === 'ALL'
              ? 'bg-[var(--primary-500)] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('CRITICAL')}
          className={`px-3 py-1 rounded-xl font-semibold transition ${
            filter === 'CRITICAL'
              ? 'bg-[var(--danger-bg)] text-[var(--danger-text)] border border-[var(--danger-border)]'
              : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
          }`}
        >
          Critical
        </button>
        <button
          onClick={() => setFilter('ACTION_REQUIRED')}
          className={`px-3 py-1 rounded-xl font-semibold transition ${
            filter === 'ACTION_REQUIRED'
              ? 'bg-[var(--warning-bg)] text-[var(--warning-text)] border border-[var(--warning-border)]'
              : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
          }`}
        >
          Action Required
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border-subtle)] p-1">
        {filteredList.map((n) => (
          <div
            key={n.id}
            onClick={() => handleClickItem(n)}
            className={`p-3.5 rounded-2xl hover:bg-[var(--bg-hover)] cursor-pointer transition flex items-start gap-3 m-1 ${
              !n.isRead ? 'bg-[var(--bg-subtle)]' : ''
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {n.type === 'CRITICAL' && <AlertTriangle className="w-4 h-4 text-[var(--danger-dot)]" />}
              {n.type === 'ACTION_REQUIRED' && <FileCheck className="w-4 h-4 text-[var(--warning-dot)]" />}
              {n.type === 'INFO' && <Info className="w-4 h-4 text-[var(--info-dot)]" />}
            </div>

            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-bold text-[var(--text-primary)] truncate">{n.title}</p>
                <span className="text-[10px] text-[var(--text-muted)] shrink-0">{n.timestamp}</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2">{n.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
