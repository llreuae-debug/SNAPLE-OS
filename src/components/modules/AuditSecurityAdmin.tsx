import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  Server,
  Sliders
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../common/StatusBadge';
import { mockAuditEvents, mockUsers } from '../../db/mockData';
import { AuditEvent } from '../../types';

export const AuditSecurityAdmin: React.FC = () => {
  const { requestStepUpMFA } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'AUDIT_TRAIL' | 'ROLE_MATRIX' | 'SYSTEM_HEALTH'>('AUDIT_TRAIL');
  const [auditList] = useState<AuditEvent[]>(mockAuditEvents);
  const [searchQuery, setSearchQuery] = useState('');

  const [featureFlags, setFeatureFlags] = useState([
    { key: 'MANDATORY_DWR_EVIDENCE', name: 'Enforce Photo/Audio on DWR', enabled: true },
    { key: 'STEP_UP_EXPORTS', name: 'Step-Up MFA on Board Exports', enabled: true },
    { key: 'STZ_TAX_CALCULATOR', name: 'Pixel Park STZ Tax Model', enabled: true },
    { key: 'GEOFENCE_ATTENDANCE_150M', name: 'GPS Geofence (150m)', enabled: true }
  ]);

  const toggleFeature = (key: string) => {
    requestStepUpMFA(
      `Modify System Feature Flag (${key})`,
      'Changing runtime feature flags affects all 3 companies and updates the security policy configuration.',
      () => {
        setFeatureFlags((prev) =>
          prev.map((f) => (f.key === key ? { ...f, enabled: !f.enabled } : f))
        );
      }
    );
  };

  const filteredAudits = auditList.filter((a) => {
    if (!searchQuery) return true;
    return (
      a.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.entityType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--border-base)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-[#EF4444]" />
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Security, Append-Only Audit & Administration</h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Rule: Technical admin / business data separation. Immutable historical changes without deletion.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-base)] text-xs">
          <button
            onClick={() => setActiveTab('AUDIT_TRAIL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'AUDIT_TRAIL' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Append-Only Audit Trail
          </button>
          <button
            onClick={() => setActiveTab('ROLE_MATRIX')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'ROLE_MATRIX' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            RBAC + ABAC Scopes
          </button>
          <button
            onClick={() => setActiveTab('SYSTEM_HEALTH')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'SYSTEM_HEALTH' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Feature Flags & Health
          </button>
        </div>
      </div>

      {/* Tab 1: Audit Trail */}
      {activeTab === 'AUDIT_TRAIL' && (
        <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">{t('security.audit_log')}</h3>
              <p className="text-xs text-[var(--text-muted)]">
                Every privilege elevation, measurement sign-off, and reversal is permanently captured.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search audit trail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-base)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
              />
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-3">
            {filteredAudits.map((aud) => (
              <div key={aud.id} className="p-4 rounded-xl ui-surface border space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#6366F1]">{aud.action}</span>
                    <span className="text-[var(--text-muted)]">on</span>
                    <span className="font-semibold text-[var(--text-primary)]">{aud.entityType} ({aud.entityId})</span>
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">{aud.timestamp}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[var(--bg-subtle)] p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Actor</span>
                    <p className="font-semibold text-[var(--text-primary)]">{aud.actorName} ({aud.actorRole})</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">New Value Summary</span>
                    <p className="text-[#10B981] font-medium">{aud.newValueSummary}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Governance Reason</span>
                    <p className="text-[var(--text-secondary)] italic">{aud.reason || 'Standard workflow progression'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1">
                  <span>IP Address: {aud.ipAddress}</span>
                  <span className="px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] border uppercase font-mono">
                    {aud.confidentiality}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Role & Scopes Matrix */}
      {activeTab === 'ROLE_MATRIX' && (
        <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Active Users & Multi-Company Authorization Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-base)] text-[var(--text-muted)] uppercase font-semibold">
                  <th className="pb-3 px-3">Principal User</th>
                  <th className="pb-3 px-3">Role</th>
                  <th className="pb-3 px-3">Company Scope</th>
                  <th className="pb-3 px-3">Max Confidentiality</th>
                  <th className="pb-3 px-3">MFA Enforced</th>
                  <th className="pb-3 px-3">Scope Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {mockUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[var(--bg-hover)]">
                    <td className="py-3 px-3">
                      <p className="font-bold text-[var(--text-primary)]">{u.name}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">{u.email}</p>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#6366F1]">{u.role}</td>
                    <td className="py-3 px-3 text-[var(--text-secondary)] font-mono">
                      {u.scope.companyIds.join(', ').toUpperCase()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] border text-[10px] font-mono">
                        {u.scope.maxConfidentiality}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {u.isMfaEnabled ? (
                        <span className="text-[#10B981] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)]">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[var(--text-muted)]">
                      {u.scope.isGroupWide ? 'Group Consolidated' : 'Entity Bound'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Feature Flags & Health */}
      {activeTab === 'SYSTEM_HEALTH' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#6366F1]" />
              <span>Runtime Feature Flags (Step-Up Guarded)</span>
            </h3>

            <div className="space-y-3">
              {featureFlags.map((flag) => (
                <div key={flag.key} className="p-3.5 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-base)] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[var(--text-primary)]">{flag.name}</p>
                    <p className="text-[10px] font-mono text-[var(--text-muted)]">{flag.key}</p>
                  </div>
                  <button
                    onClick={() => toggleFeature(flag.key)}
                    className={`px-3 py-1 rounded-xl font-bold text-[11px] transition ${
                      flag.enabled
                        ? 'bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]'
                        : 'ui-surface text-[var(--text-muted)] border'
                    }`}
                  >
                    {flag.enabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Server className="w-4 h-4 text-[#10B981]" />
              <span>Infrastructure Health Sentinel</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-base)] flex items-center justify-between">
                <span>PostgreSQL Primary Replica (Multi-Tenant RLS)</span>
                <span className="text-[#10B981] font-bold">HEALTHY (0.8ms query)</span>
              </div>
              <div className="p-3 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-base)] flex items-center justify-between">
                <span>Redis Session & BullMQ Async Queue</span>
                <span className="text-[#10B981] font-bold">OPERATIONAL</span>
              </div>
              <div className="p-3 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-base)] flex items-center justify-between">
                <span>IndexedDB Dexie Offline Engine</span>
                <span className="text-[#06B6D4] font-bold">READY (PWA Cached)</span>
              </div>
              <div className="p-3 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-base)] flex items-center justify-between">
                <span>Cloudflare Edge TLS & WAF Protection</span>
                <span className="text-[#10B981] font-bold">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
