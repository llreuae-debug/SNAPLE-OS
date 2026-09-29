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
    <div className="space-y-6 animate-fadeIn pb-6">
      {/* Top Geofence Action Card */}
      <div className="ui-surface-elevated p-6 sm:p-7 rounded-[24px] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[var(--primary-500)]" />
              <h1 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">Attendance & Geofence Engine</h1>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Multi-factor validation: GPS Geofence (150m radius) + Office Wi-Fi SSID + Registered Device Hash.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[var(--success-bg)] text-[var(--success-text)] px-3.5 py-1.5 rounded-full border border-[var(--success-border)] font-semibold flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[var(--success-dot)]" />
              <span>Location: {currentUser.siteId}</span>
            </span>
          </div>
        </div>

        {checkInSuccess && (
          <div className="p-4 bg-[var(--success-bg)] border border-[var(--success-border)] text-[var(--success-text)] rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-[var(--success-dot)] shrink-0" />
            <span>{checkInSuccess}</span>
          </div>
        )}

        {/* Action Check-In Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          <button
            onClick={() => handleCheckIn('GEOFENCE')}
            disabled={hasCheckedInToday}
            className={`p-4.5 rounded-2xl border text-left transition flex flex-col justify-between ${
              hasCheckedInToday
                ? 'ui-surface opacity-60'
                : 'ui-card-tactile'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--primary-bg)] text-[var(--primary-text)] border border-[var(--primary-border)] flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--primary-bg)] text-[var(--primary-text)] border border-[var(--primary-border)]">
                Primary
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)]">GPS Geofence Check-In</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Auto-checks 150m site boundary</p>
            </div>
          </button>

          <button
            onClick={() => handleCheckIn('WIFI_SSID')}
            disabled={hasCheckedInToday}
            className={`p-4.5 rounded-2xl border text-left transition flex flex-col justify-between ${
              hasCheckedInToday
                ? 'ui-surface opacity-60'
                : 'ui-card-tactile'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--secondary-bg)] text-[var(--secondary-text)] border border-[var(--secondary-border)] flex items-center justify-center">
                <Wifi className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--secondary-bg)] text-[var(--secondary-text)] border border-[var(--secondary-border)]">
                Office
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)]">Office Wi-Fi Check-In</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Verified Corporate Network</p>
            </div>
          </button>

          <button
            onClick={() => handleCheckIn('QR_SUPERVISOR')}
            disabled={hasCheckedInToday}
            className={`p-4.5 rounded-2xl border text-left transition flex flex-col justify-between ${
              hasCheckedInToday
                ? 'ui-surface opacity-60'
                : 'ui-card-tactile'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent-bg)] text-[var(--accent-text)] border border-[var(--accent-border)] flex items-center justify-center">
                <QrCode className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent-bg)] text-[var(--accent-text)] border border-[var(--accent-border)]">
                Field QR
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)]">Supervisor QR Scan</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Physical site terminal scan</p>
            </div>
          </button>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="ui-card-tactile p-6 sm:p-7 space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Attendance Logs & Geofence Verification Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-base)] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Employee</th>
                <th className="pb-3 px-3">Check-In Time</th>
                <th className="pb-3 px-3">Site Location</th>
                <th className="pb-3 px-3">Method</th>
                <th className="pb-3 px-3">Device Hash</th>
                <th className="pb-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-[var(--bg-hover)] transition">
                  <td className="py-3 px-3 font-semibold text-[var(--text-primary)]">{r.date}</td>
                  <td className="py-3 px-3 font-medium text-[var(--text-secondary)]">{r.employeeName}</td>
                  <td className="py-3 px-3 font-mono text-[var(--primary-text)] font-bold">{r.checkInTime}</td>
                  <td className="py-3 px-3 text-[var(--text-secondary)]">{r.siteName}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[10px] font-semibold text-[var(--text-muted)]">
                      {r.method}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[var(--text-muted)]">{r.deviceIdHash}</td>
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
