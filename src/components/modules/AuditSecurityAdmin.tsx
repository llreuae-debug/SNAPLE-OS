import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  Server,
  Sliders,
  Lock,
  Activity,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-[var(--border-base)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#B97878]/15 text-[#B97878] flex items-center justify-center shadow-inner">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Security, Append-Only Audit & Governance</h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Rule: Technical admin / business data separation. Immutable historical changes without deletion.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[var(--surface-sunken)] rounded-[18px] border border-[var(--border-base)] text-xs shadow-inner">
          <button
            onClick={() => setActiveTab('AUDIT_TRAIL')}
            className={`px-3.5 py-1.5 rounded-[12px] font-semibold transition ${
              activeTab === 'AUDIT_TRAIL'
                ? 'bg-[var(--surface-elevated)] text-[var(--text-primary)] shadow-sm font-bold border border-[var(--border-base)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Append-Only Audit Trail
          </button>
          <button
            onClick={() => setActiveTab('ROLE_MATRIX')}
            className={`px-3.5 py-1.5 rounded-[12px] font-semibold transition ${
              activeTab === 'ROLE_MATRIX'
                ? 'bg-[var(--surface-elevated)] text-[var(--text-primary)] shadow-sm font-bold border border-[var(--border-base)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            RBAC + ABAC Scopes
          </button>
          <button
            onClick={() => setActiveTab('SYSTEM_HEALTH')}
            className={`px-3.5 py-1.5 rounded-[12px] font-semibold transition ${
              activeTab === 'SYSTEM_HEALTH'
                ? 'bg-[var(--surface-elevated)] text-[var(--text-primary)] shadow-sm font-bold border border-[var(--border-base)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Feature Flags & Health
          </button>
        </div>
      </div>

      {/* Tab 1: Audit Trail */}
      {activeTab === 'AUDIT_TRAIL' && (
        <div className="ui-surface-elevated rounded-[24px] p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">{t('security.audit_log')}</h3>
              <p className="text-xs text-[var(--text-muted)]">
                Every privilege elevation, measurement sign-off, and reversal is permanently captured.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search audit trail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-tactile w-full pl-9 pr-3 py-2 text-xs"
              />
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-3">
            {filteredAudits.map((aud) => (
              <div key={aud.id} className="p-4 rounded-[18px] bg-[var(--surface-subtle)] border border-[var(--border-base)] space-y-2 text-xs hover:border-[var(--brand-primary)]/40 transition">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[var(--brand-primary)] px-2 py-0.5 rounded-lg bg-[var(--brand-primary)]/10">{aud.action}</span>
                    <span className="text-[var(--text-muted)]">on</span>
                    <span className="font-semibold text-[var(--text-primary)]">{aud.entityType} ({aud.entityId})</span>
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">{aud.timestamp}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[var(--surface-elevated)] p-3 rounded-[14px] border border-[var(--border-subtle)]">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Actor</span>
                    <p className="font-semibold text-[var(--text-primary)]">{aud.actorName} ({aud.actorRole})</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">New Value Summary</span>
                    <p className="text-[#7FA88E] font-semibold">{aud.newValueSummary}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Governance Reason</span>
                    <p className="text-[var(--text-secondary)] italic">{aud.reason || 'Standard workflow progression'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1">
                  <span>IP Address: {aud.ipAddress}</span>
                  <span className="px-2 py-0.5 rounded-[8px] bg-[var(--surface-sunken)] text-[var(--text-secondary)] border border-[var(--border-subtle)] uppercase font-mono font-bold">
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
        <div className="ui-surface-elevated rounded-[24px] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Active Users & Multi-Company Authorization Matrix</h3>
              <p className="text-xs text-[var(--text-muted)]">Granular ABAC tenant scoping and strict privilege enforcement</p>
            </div>
            <div className="px-3 py-1 rounded-[12px] bg-[var(--brand-accent)]/15 text-[var(--brand-accent)] border border-[var(--brand-accent)]/20 text-xs font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Multi-Tenant RLS</span>
            </div>
          </div>

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
                  <tr key={u.id} className="hover:bg-[var(--surface-subtle)] transition">
                    <td className="py-3 px-3">
                      <p className="font-bold text-[var(--text-primary)]">{u.name}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">{u.email}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[var(--brand-primary)] px-2 py-0.5 rounded-[8px] bg-[var(--brand-primary)]/10">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[var(--text-secondary)] font-mono font-semibold">
                      {u.scope.companyIds.join(', ').toUpperCase()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-[8px] bg-[var(--surface-sunken)] text-[var(--text-secondary)] border border-[var(--border-subtle)] text-[10px] font-mono font-bold">
                        {u.scope.maxConfidentiality}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {u.isMfaEnabled ? (
                        <span className="text-[#7FA88E] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Enforced
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)]">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[var(--text-muted)]">
                      <span className="px-2 py-0.5 rounded-full text-[11px] bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
                        {u.scope.isGroupWide ? 'Group Consolidated' : 'Entity Bound'}
                      </span>
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
          <div className="ui-surface-elevated rounded-[24px] p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[var(--brand-accent)]" />
              <span>Runtime Feature Flags (Step-Up Guarded)</span>
            </h3>

            <div className="space-y-3">
              {featureFlags.map((flag) => (
                <div key={flag.key} className="p-3.5 bg-[var(--surface-subtle)] rounded-[16px] border border-[var(--border-base)] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[var(--text-primary)]">{flag.name}</p>
                    <p className="text-[10px] font-mono text-[var(--text-muted)]">{flag.key}</p>
                  </div>
                  <button
                    onClick={() => toggleFeature(flag.key)}
                    className={`px-3 py-1.5 rounded-[12px] font-bold text-[11px] transition shadow-sm ${
                      flag.enabled
                        ? 'btn-tactile-primary !py-1 !px-3'
                        : 'btn-tactile-secondary !py-1 !px-3 opacity-60'
                    }`}
                  >
                    {flag.enabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="ui-surface-elevated rounded-[24px] p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Server className="w-4 h-4 text-[#7FA88E]" />
              <span>Infrastructure Health Sentinel</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-[var(--surface-subtle)] rounded-[16px] border border-[var(--border-base)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#7FA88E] animate-pulse"></div>
                  <span>PostgreSQL Primary Replica (Multi-Tenant RLS)</span>
                </div>
                <span className="text-[#7FA88E] font-bold font-mono">HEALTHY (0.8ms query)</span>
              </div>
              <div className="p-3 bg-[var(--surface-subtle)] rounded-[16px] border border-[var(--border-base)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#7FA88E]"></div>
                  <span>Redis Session & BullMQ Async Queue</span>
                </div>
                <span className="text-[#7FA88E] font-bold font-mono">OPERATIONAL</span>
              </div>
              <div className="p-3 bg-[var(--surface-subtle)] rounded-[16px] border border-[var(--border-base)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#8299A2]"></div>
                  <span>IndexedDB Dexie Offline Engine</span>
                </div>
                <span className="text-[var(--brand-secondary)] font-bold font-mono">READY (PWA Cached)</span>
              </div>
              <div className="p-3 bg-[var(--surface-subtle)] rounded-[16px] border border-[var(--border-base)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#7FA88E]"></div>
                  <span>Cloudflare Edge TLS & WAF Protection</span>
                </div>
                <span className="text-[#7FA88E] font-bold font-mono">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
