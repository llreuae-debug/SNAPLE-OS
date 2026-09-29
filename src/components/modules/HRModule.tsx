import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  BookOpen,
  History,
  CheckCircle2,
  FileText,
  Award,
  ShieldCheck,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../common/StatusBadge';
import { mockEmployees, mockJobVersions, mockSOPs } from '../../db/mockData';
import { Employee, JobVersion, SOPVersion } from '../../types';

export const HRModule: React.FC = () => {
  const { currentUser, activeCompanyId } = useAuth();
  const { t, isRTL } = useLanguage();

  const [activeTab, setActiveTab] = useState<'DIRECTORY' | 'JOB_LIBRARY' | 'SOPS'>('JOB_LIBRARY');
  const [selectedJob, setSelectedJob] = useState<JobVersion>(mockJobVersions[0]);
  const [selectedSOP, setSelectedSOP] = useState<SOPVersion>(mockSOPs[0]);
  const [acknowledgedSOPs, setAcknowledgedSOPs] = useState<Record<string, boolean>>({
    'sop-mb-01': true
  });
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEmployees = mockEmployees.filter((emp) => {
    if (activeCompanyId !== 'ALL' && emp.companyId !== activeCompanyId) return false;
    if (searchQuery && !emp.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleAcknowledgeSOP = (sopId: string) => {
    setAcknowledgedSOPs((prev) => ({ ...prev, [sopId]: true }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--border-base)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-[#6366F1]" />
            <h1 className="text-xl font-bold text-[var(--text-primary)]">People, Job Library & Operating SOPs</h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Version-controlled Job Library with clear authority limits, KPIs, and RACI governance.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-base)] text-xs">
          <button
            onClick={() => setActiveTab('JOB_LIBRARY')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'JOB_LIBRARY' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Job Library (Versioned)
          </button>
          <button
            onClick={() => setActiveTab('SOPS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'SOPS' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            SOP Operating Manuals
          </button>
          <button
            onClick={() => setActiveTab('DIRECTORY')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'DIRECTORY' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Employee Directory ({filteredEmployees.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Versioned Job Library & Diffs */}
      {activeTab === 'JOB_LIBRARY' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Job Selector */}
          <div className="lg:col-span-4 space-y-3">
            <div className="ui-surface rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Position Profiles & Versions
              </h3>
              <div className="space-y-2">
                {mockJobVersions.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`w-full text-left p-3 rounded-xl border transition ${
                      selectedJob.id === job.id
                        ? 'bg-[var(--primary-bg)] border-[var(--primary-border)] text-[var(--text-primary)] shadow-sm'
                        : 'ui-surface hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-[#6366F1] font-bold">{job.jobCode}</span>
                      <StatusBadge status={job.status} size="xs" />
                    </div>
                    <p className="text-xs font-bold text-[var(--text-primary)]">{job.standardTitle}</p>
                    <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mt-1">
                      <span>Grade: {job.grade}</span>
                      <span>Version: v{job.version}.0</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Job Description */}
          <div className="lg:col-span-8 space-y-4">
            <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b border-[var(--border-base)]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#6366F1]">{selectedJob.jobCode}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                      v{selectedJob.version}.0 Active
                    </span>
                    <StatusBadge status={selectedJob.status} size="xs" />
                  </div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)] mt-1">{selectedJob.standardTitle}</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Effective: {selectedJob.effectiveFrom} • Approved by {selectedJob.approvedBy}
                  </p>
                </div>
                {selectedJob.changeReason && (
                  <div className="p-2.5 rounded-xl bg-[var(--primary-bg)] border border-[var(--primary-border)] text-xs text-[var(--primary-text)] max-w-xs">
                    <strong className="block text-[10px] uppercase font-bold">Change Reason:</strong>
                    <span>{selectedJob.changeReason}</span>
                  </div>
                )}
              </div>

              {/* Responsibilities */}
              <div>
                <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Key Responsibilities
                </h4>
                <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                  {selectedJob.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 bg-[var(--bg-subtle)] p-2.5 rounded-xl">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] mt-1.5 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Authority Limits */}
              <div>
                <h4 className="text-xs font-bold text-[var(--warning-text)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
                  <span>Authority Limits & Sign-Off Mandates</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                  {selectedJob.authorityLimits.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 bg-[var(--warning-bg)] border border-[var(--warning-border)] p-2.5 rounded-xl text-[var(--warning-text)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mt-1.5 shrink-0" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* KPIs & Weights */}
              <div>
                <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#6366F1]" />
                  <span>Key Performance Indicators (KPIs)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedJob.kpis.map((kpi) => (
                    <div key={kpi.id} className="p-3 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-base)] space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[var(--text-primary)]">{kpi.title}</span>
                        <span className="font-bold text-[#6366F1]">{kpi.weight}%</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">{kpi.formula}</p>
                      <p className="text-[11px] font-bold text-[#10B981]">Target: {kpi.target}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: SOP Library & RACI Matrix */}
      {activeTab === 'SOPS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Operating Manuals
            </h3>
            {mockSOPs.map((sop) => (
              <div
                key={sop.id}
                onClick={() => setSelectedSOP(sop)}
                className="p-4 rounded-2xl ui-surface hover:border-[#6366F1] cursor-pointer transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#6366F1] font-bold">{sop.sopNumber}</span>
                  <StatusBadge status={sop.status} size="xs" />
                </div>
                <h4 className="text-xs font-bold text-[var(--text-primary)]">{sop.title}</h4>
                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-subtle)]">
                  <span>Version v{sop.version}.0</span>
                  <span className="text-[#10B981] font-semibold">{sop.acknowledgedCount} Acknowledged</span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b border-[var(--border-base)]">
                <div>
                  <span className="text-xs font-mono font-bold text-[#6366F1]">{selectedSOP.sopNumber}</span>
                  <h2 className="text-lg font-bold text-[var(--text-primary)] mt-1">{selectedSOP.title}</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Effective: {selectedSOP.effectiveDate} • Next Review: {selectedSOP.reviewDate}
                  </p>
                </div>
                <button
                  onClick={() => handleAcknowledgeSOP(selectedSOP.id)}
                  disabled={acknowledgedSOPs[selectedSOP.id]}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    acknowledgedSOPs[selectedSOP.id]
                      ? 'bg-[var(--success-bg)] text-[var(--success-text)] border border-[var(--success-border)]'
                      : 'bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-sm'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{acknowledgedSOPs[selectedSOP.id] ? 'SOP Acknowledged ✓' : 'Acknowledge SOP'}</span>
                </button>
              </div>

              {/* Purpose */}
              <div>
                <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Purpose</h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-subtle)] p-3 rounded-xl">
                  {selectedSOP.purpose}
                </p>
              </div>

              {/* Procedure Steps */}
              <div>
                <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Execution Steps
                </h4>
                <div className="space-y-2">
                  {selectedSOP.procedureSteps.map((step) => (
                    <div key={step.step} className="p-3 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-base)] flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#6366F1] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {step.step}
                      </span>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-[var(--text-primary)]">{step.title}</p>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--primary-bg)] text-[var(--primary-text)] border border-[var(--primary-border)]">
                            {step.responsible}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RACI Matrix */}
              <div>
                <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  RACI Matrix
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {selectedSOP.raci.map((r, i) => (
                    <div key={i} className="p-2.5 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-base)] flex items-center justify-between">
                      <span className="text-xs text-[var(--text-secondary)] font-medium">{r.role}</span>
                      <span className="w-6 h-6 rounded-lg bg-[var(--primary-bg)] text-[var(--primary-text)] border border-[var(--primary-border)] font-bold text-xs flex items-center justify-center">
                        {r.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Employee Directory */}
      {activeTab === 'DIRECTORY' && (
        <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Staff Performer Compliance Directory</h3>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-base)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
              />
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-base)] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                  <th className="pb-3 px-3">Emp No</th>
                  <th className="pb-3 px-3">Name</th>
                  <th className="pb-3 px-3">Company / Dept</th>
                  <th className="pb-3 px-3">Job Title</th>
                  <th className="pb-3 px-3">Reporting Line</th>
                  <th className="pb-3 px-3">DWR Rate</th>
                  <th className="pb-3 px-3">Quality Score</th>
                  <th className="pb-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-[var(--bg-hover)]">
                    <td className="py-3 px-3 font-mono text-[#6366F1] font-bold">{emp.employeeNo}</td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-[var(--text-primary)]">{emp.name}</p>
                      {emp.nameUrdu && <p className="text-[11px] text-[var(--text-muted)] font-urdu">{emp.nameUrdu}</p>}
                    </td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">
                      {emp.companyId.toUpperCase()} • {emp.departmentId}
                    </td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">
                      <span className="font-semibold">{emp.jobTitle}</span> ({emp.grade})
                    </td>
                    <td className="py-3 px-3 text-[var(--text-muted)]">{emp.reportingManagerName || 'N/A'}</td>
                    <td className="py-3 px-3 font-bold text-[#10B981]">{emp.dwrComplianceRate}%</td>
                    <td className="py-3 px-3 font-bold text-[#F59E0B]">★ {emp.averageQualityRating} / 5</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={emp.status} size="xs" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
