import React, { useState } from 'react';
import {
  Share2,
  TrendingUp,
  CheckCircle2,
  Send,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../common/StatusBadge';
import { mockAgencySubmissions, mockAgencyScorecards } from '../../db/mockData';
import { AgencyDailySubmission, AgencyScorecard } from '../../types';

export const AgencyPortalModule: React.FC = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'SCORECARD' | 'DAILY_SUBMIT' | 'SUBMISSIONS_LOG'>('SCORECARD');
  const [submissions, setSubmissions] = useState<AgencyDailySubmission[]>(mockAgencySubmissions);

  // Form State
  const [outboundCalls, setOutboundCalls] = useState(120);
  const [adSpendPKR, setAdSpendPKR] = useState(50000);
  const [leadsGenerated, setLeadsGenerated] = useState(12);
  const [siteVisitsConducted, setSiteVisitsConducted] = useState(3);
  const [notes, setNotes] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const currentScorecard: AgencyScorecard = mockAgencyScorecards[0];

  const handleSubmitAgencyDaily = (e: React.FormEvent) => {
    e.preventDefault();
    const newSub: AgencyDailySubmission = {
      id: `sub-${Date.now()}`,
      agencyId: currentUser.scope.agencyId || 'agency-apex',
      agencyName: 'Apex Growth Media & Sales',
      staffName: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      outboundCalls,
      adSpendPKR,
      leadsGenerated,
      siteVisitsConducted,
      notes,
      submittedAt: new Date().toISOString()
    };

    setSubmissions((prev) => [newSub, ...prev]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setActiveTab('SUBMISSIONS_LOG');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-6">
      {/* Top Banner */}
      <div className="ui-surface-elevated p-6 rounded-[24px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Share2 className="w-5 h-5 text-[var(--secondary-500)]" />
            <h1 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">Apex Growth Media & Sales Partner Hub</h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Agency isolation boundary: Submissions, tracking attribution, and CPL/CPQL scorecard.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-subtle)] rounded-2xl border border-[var(--border-base)] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('SCORECARD')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'SCORECARD' ? 'btn-tactile-primary text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Agency Scorecard
          </button>
          <button
            onClick={() => setActiveTab('DAILY_SUBMIT')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'DAILY_SUBMIT' ? 'btn-tactile-primary text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            + Daily Submission
          </button>
          <button
            onClick={() => setActiveTab('SUBMISSIONS_LOG')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'SUBMISSIONS_LOG' ? 'btn-tactile-primary text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Activity Logs
          </button>
        </div>
      </div>

      {/* Tab 1: Agency Scorecard */}
      {activeTab === 'SCORECARD' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="ui-card-tactile p-5.5 bg-[var(--secondary-bg)] border-[var(--secondary-border)]">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Cost Per Qualified Lead</span>
              <h3 className="text-2xl font-bold text-[var(--secondary-text)] mt-1.5">
                PKR {currentScorecard.costPerQualifiedLead.toLocaleString()}
              </h3>
              <p className="text-[11px] text-[var(--success-text)] mt-2 font-semibold">↓ 14% vs target</p>
            </div>

            <div className="ui-card-tactile p-5.5 bg-[var(--primary-bg)] border-[var(--primary-border)]">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Qualified Leads</span>
              <h3 className="text-2xl font-bold text-[var(--primary-text)] mt-1.5">
                {currentScorecard.qualifiedLeads} Leads
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-2">From {currentScorecard.totalLeads} enquiries</p>
            </div>

            <div className="ui-card-tactile p-5.5 bg-[var(--success-bg)] border-[var(--success-border)]">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">SLA Compliance</span>
              <h3 className="text-2xl font-bold text-[var(--success-text)] mt-1.5">
                98.4% On-Time
              </h3>
              <p className="text-[11px] text-[var(--warning-text)] mt-2 font-medium">1 SLA response breach</p>
            </div>

            <div className="ui-card-tactile p-5.5 bg-[var(--warning-bg)] border-[var(--warning-border)]">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Quality Score</span>
              <h3 className="text-2xl font-bold text-[var(--warning-text)] mt-1.5">
                {currentScorecard.ratingScore} / 100
              </h3>
              <p className="text-[11px] text-[var(--success-text)] mt-2 font-semibold">Tier-1 Agency</p>
            </div>
          </div>

          <div className="ui-card-tactile p-6 space-y-2">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--success-dot)]" />
              <span>Agency Data Governance & Customer Protection Policy</span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Agency accounts are strictly restricted to assigned campaigns and attributable prospect leads. Exporting the master customer database is disabled by default.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Daily Submission Form */}
      {activeTab === 'DAILY_SUBMIT' && (
        <form onSubmit={handleSubmitAgencyDaily} className="ui-card-tactile p-6 sm:p-7 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Record Agency Daily Output</h3>

          {submitSuccess && (
            <div className="p-4 bg-[var(--success-bg)] border border-[var(--success-border)] text-[var(--success-text)] rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[var(--success-dot)]" />
              <span>Agency daily output recorded and reconciled with CRM pipeline.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Outbound Calls</label>
              <input
                type="number"
                min={0}
                required
                value={outboundCalls}
                onChange={(e) => setOutboundCalls(Number(e.target.value))}
                className="w-full px-3 py-2.5 input-tactile text-xs text-[var(--text-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Daily Ad Spend (PKR)</label>
              <input
                type="number"
                min={0}
                required
                value={adSpendPKR}
                onChange={(e) => setAdSpendPKR(Number(e.target.value))}
                className="w-full px-3 py-2.5 input-tactile text-xs text-[var(--text-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Leads Generated</label>
              <input
                type="number"
                min={0}
                required
                value={leadsGenerated}
                onChange={(e) => setLeadsGenerated(Number(e.target.value))}
                className="w-full px-3 py-2.5 input-tactile text-xs text-[var(--text-primary)] font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Site Visits Conducted</label>
              <input
                type="number"
                min={0}
                required
                value={siteVisitsConducted}
                onChange={(e) => setSiteVisitsConducted(Number(e.target.value))}
                className="w-full px-3 py-2.5 input-tactile text-xs text-[var(--text-primary)] font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Campaign Notes</label>
            <textarea
              rows={3}
              placeholder="Key customer objections, demand trends, high-performing creatives..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2.5 input-tactile text-xs text-[var(--text-primary)]"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="btn-tactile-primary px-6 py-2.5 text-xs font-bold flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Daily Output</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Submissions Log */}
      {activeTab === 'SUBMISSIONS_LOG' && (
        <div className="ui-card-tactile p-6 sm:p-7 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Historical Daily Submissions</h3>
          <div className="space-y-3.5">
            {submissions.map((sub) => (
              <div key={sub.id} className="p-4.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-base)] space-y-2.5 text-xs shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)]">{sub.staffName} ({sub.agencyName})</span>
                  <span className="text-[var(--text-muted)]">{sub.date}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[var(--bg-subtle)] p-3.5 rounded-2xl">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Calls</span>
                    <p className="font-bold text-[var(--text-primary)]">{sub.outboundCalls}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Ad Spend</span>
                    <p className="font-bold text-[var(--warning-text)]">PKR {sub.adSpendPKR.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Leads</span>
                    <p className="font-bold text-[var(--secondary-text)]">{sub.leadsGenerated}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Visits</span>
                    <p className="font-bold text-[var(--success-text)]">{sub.siteVisitsConducted}</p>
                  </div>
                </div>
                {sub.notes && <p className="text-[var(--text-secondary)] italic">{sub.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
