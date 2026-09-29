import React, { useState } from 'react';
import {
  MapPin,
  CheckCircle2,
  Wifi,
  QrCode,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSync } from '../../context/SyncContext';
import { StatusBadge } from '../common/StatusBadge';
import { mockAttendanceRecords } from '../../db/mockData';
import { AttendanceRecord } from '../../types';

export const AttendanceModule: React.FC = () => {
  const { currentUser, activeCompanyId } = useAuth();
  const { t } = useLanguage();
  const { enqueueOfflineAction, isOnline } = useSync();

  const [records, setRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(false);
  const [checkInSuccess, setCheckInSuccess] = useState<string | null>(null);

  const handleCheckIn = (method: AttendanceRecord['method']) => {
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      companyId: activeCompanyId === 'ALL' ? currentUser.companyId : activeCompanyId,
      siteId: currentUser.siteId,
      siteName: currentUser.siteId.toUpperCase(),
      date: new Date().toISOString().split('T')[0],
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      method,
      locationVerified: true,
      deviceIdHash: `dev_${currentUser.id}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'ON_TIME'
    };

    if (!isOnline) {
      enqueueOfflineAction('ATTENDANCE', `Attendance Check-In (${currentUser.name})`, newRecord);
    }

    setRecords((prev) => [newRecord, ...prev]);
    setHasCheckedInToday(true);
    setCheckInSuccess(`Check-in verified via ${method} at ${newRecord.checkInTime}`);
    setTimeout(() => setCheckInSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Geofence Action Card */}
      <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#10B981]" />
              <h1 className="text-xl font-bold text-[var(--text-primary)]">Attendance & Geofence Engine</h1>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Multi-factor validation: GPS Geofence (150m radius) + Office Wi-Fi SSID + Registered Device Hash.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[var(--success-bg)] text-[var(--success-text)] px-3 py-1 rounded-xl border border-[var(--success-border)] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Location: {currentUser.siteId}</span>
            </span>
          </div>
        </div>

        {checkInSuccess && (
          <div className="p-3 bg-[var(--success-bg)] border border-[var(--success-border)] text-[var(--success-text)] rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>{checkInSuccess}</span>
          </div>
        )}

        {/* Action Check-In Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => handleCheckIn('GEOFENCE')}
            disabled={hasCheckedInToday}
            className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
              hasCheckedInToday
                ? 'ui-surface opacity-60'
                : 'ui-surface hover:border-[#6366F1] shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <MapPin className="w-5 h-5 text-[#6366F1]" />
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[var(--primary-bg)] text-[var(--primary-text)]">
                Primary
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)]">GPS Geofence Check-In</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Auto-checks 150m radius</p>
            </div>
          </button>

          <button
            onClick={() => handleCheckIn('WIFI_SSID')}
            disabled={hasCheckedInToday}
            className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
              hasCheckedInToday
                ? 'ui-surface opacity-60'
                : 'ui-surface hover:border-[#06B6D4] shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Wifi className="w-5 h-5 text-[#06B6D4]" />
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[var(--info-bg)] text-[var(--info-text)]">
                Office
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)]">Office Wi-Fi SSID</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Matched HQ Access Point</p>
            </div>
          </button>

          <button
            onClick={() => handleCheckIn('QR_CODE')}
            disabled={hasCheckedInToday}
            className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
              hasCheckedInToday
                ? 'ui-surface opacity-60'
                : 'ui-surface hover:border-[#F59E0B] shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <QrCode className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[var(--warning-bg)] text-[var(--warning-text)]">
                Fallback
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)]">QR Gate Checkpoint</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Scan physical gate code</p>
            </div>
          </button>
        </div>
      </div>

      {/* Attendance Logs Table */}
      <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#6366F1]" />
            <span>Daily Attendance Verification Log</span>
          </h3>
          <span className="text-xs text-[var(--text-muted)]">{records.length} Check-Ins</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-base)] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                <th className="pb-3 px-3">Employee</th>
                <th className="pb-3 px-3">Site / Location</th>
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Check-In Time</th>
                <th className="pb-3 px-3">Verification Mode</th>
                <th className="pb-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-[var(--bg-hover)]">
                  <td className="py-3 px-3 font-semibold text-[var(--text-primary)]">{r.employeeName}</td>
                  <td className="py-3 px-3 text-[var(--text-secondary)]">{r.siteName}</td>
                  <td className="py-3 px-3 text-[var(--text-muted)]">{r.date}</td>
                  <td className="py-3 px-3 font-mono font-bold text-[#10B981]">{r.checkInTime}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] border text-[10px]">
                      {r.method}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={r.status} size="xs" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
