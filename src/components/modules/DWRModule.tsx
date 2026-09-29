import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Camera,
  Mic,
  QrCode,
  CheckCircle,
  Star,
  Clock,
  AlertCircle,
  Send,
  Sparkles,
  Filter,
  Check,
  Save,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSync } from '../../context/SyncContext';
import { StatusBadge } from '../common/StatusBadge';
import { mockDWRRecords } from '../../db/mockData';
import { DWRRecord, DWROutputItem } from '../../types';

export const DWRModule: React.FC = () => {
  const { currentUser, activeCompanyId } = useAuth();
  const { t } = useLanguage();
  const { enqueueOfflineAction, isOnline } = useSync();

  const [dwrList, setDwrList] = useState<DWRRecord[]>(mockDWRRecords);
  const [activeTab, setActiveTab] = useState<'NEW_SUBMIT' | 'REVIEW_PENDING' | 'HISTORY'>('NEW_SUBMIT');

  // Form State
  const [workDate, setWorkDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<DWROutputItem[]>([
    {
      id: 'it-1',
      taskTitle: '',
      outputType: 'Physical Output',
      quantity: 1,
      unit: 'Units',
      notes: ''
    }
  ]);
  const [problems, setProblems] = useState<string>('');
  const [supportNeeded, setSupportNeeded] = useState<string>('');
  const [hasPhoto, setHasPhoto] = useState<boolean>(false);
  const [hasVoice, setHasVoice] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Supervisor Review Modal state
  const [reviewingDWR, setReviewingDWR] = useState<DWRRecord | null>(null);
  const [rubricScore, setRubricScore] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [rubricFeedback, setRubricFeedback] = useState<string>('Precise measurable logging with verified on-site evidence.');

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: 'it-' + (prev.length + 1),
        taskTitle: '',
        outputType: 'Task Execution',
        quantity: 1,
        unit: 'Tasks',
        notes: ''
      }
    ]);
  };

  const handleUpdateItem = (index: number, field: keyof DWROutputItem, val: any) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitDWR = (isDraft: boolean = false) => {
    setValidationError(null);

    // Rule: Reject vague entries like "worked on site" or empty task titles
    if (!isDraft) {
      for (const item of items) {
        if (!item.taskTitle.trim() || item.taskTitle.toLowerCase().includes('worked on site')) {
          setValidationError('Measurable Output Validation Error: Vague descriptions like "worked on site" are rejected. Specify concrete task output.');
          return;
        }
        if (item.quantity <= 0) {
          setValidationError('Measurable Output Validation Error: Quantity must be greater than zero.');
          return;
        }
      }
    }

    const newRecord: DWRRecord = {
      id: `dwr-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      companyId: activeCompanyId === 'ALL' ? currentUser.companyId : activeCompanyId,
      departmentId: currentUser.departmentId,
      siteId: currentUser.siteId,
      workDate,
      items,
      problemsEncountered: problems,
      supportNeeded,
      evidences: [
        ...(hasPhoto
          ? [
              {
                id: `ev-p-${Date.now()}`,
                type: 'PHOTO' as const,
                url: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800',
                label: 'On-site timestamped progress photo',
                timestamp: new Date().toISOString()
              }
            ]
          : []),
        ...(hasVoice
          ? [
              {
                id: `ev-v-${Date.now()}`,
                type: 'VOICE_NOTE' as const,
                url: 'voice-note-sync.m4a',
                label: 'Voice summary attachment',
                timestamp: new Date().toISOString()
              }
            ]
          : [])
      ],
      submittedAt: new Date().toISOString(),
      status: isDraft ? 'DRAFT' : 'SUBMITTED',
      syncStatus: isOnline ? 'SYNCED' : 'PENDING'
    };

    if (!isOnline) {
      enqueueOfflineAction('DWR', `DWR: ${currentUser.name} (${workDate})`, newRecord);
    }

    setDwrList((prev) => [newRecord, ...prev]);
    setSubmitSuccess(isDraft ? 'Draft saved locally.' : 'DWR submitted successfully for supervisor review.');
    setTimeout(() => {
      setSubmitSuccess(null);
      if (!isDraft) setActiveTab('HISTORY');
    }, 1500);
  };

  const handleSupervisorVerify = () => {
    if (!reviewingDWR) return;
    setDwrList((prev) =>
      prev.map((d) =>
        d.id === reviewingDWR.id
          ? {
              ...d,
              status: 'VERIFIED',
              supervisorReview: {
                reviewerId: currentUser.id,
                reviewerName: currentUser.name,
                qualityScore: rubricScore,
                rubricFeedback,
                reviewedAt: new Date().toISOString()
              }
            }
          : d
      )
    );
    setReviewingDWR(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--border-base)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="w-5 h-5 text-[#6366F1]" />
            <h1 className="text-xl font-bold text-[var(--text-primary)]">{t('dwr.title')}</h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">{t('dwr.quick_time')}</p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-base)] text-xs">
          <button
            onClick={() => setActiveTab('NEW_SUBMIT')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'NEW_SUBMIT'
                ? 'bg-[#6366F1] text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            + Record Today
          </button>
          <button
            onClick={() => setActiveTab('REVIEW_PENDING')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'REVIEW_PENDING'
                ? 'bg-[#6366F1] text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span>Supervisor Reviews</span>
            <span className="w-4 h-4 rounded-full bg-[#F59E0B] text-slate-950 font-black text-[9px] flex items-center justify-center">
              {dwrList.filter((d) => d.status === 'SUBMITTED').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'HISTORY'
                ? 'bg-[#6366F1] text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            History & Rubric
          </button>
        </div>
      </div>

      {submitSuccess && (
        <div className="p-3 bg-[var(--success-bg)] border border-[var(--success-border)] text-[var(--success-text)] rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-[#10B981]" />
          <span>{submitSuccess}</span>
        </div>
      )}

      {/* Mode 1: Fast Entry Form */}
      {activeTab === 'NEW_SUBMIT' && (
        <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Reporting Date
              </label>
              <input
                type="date"
                value={workDate}
                onChange={(e) => setWorkDate(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-base)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Department / Scope Location
              </label>
              <div className="px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-secondary)]">
                {currentUser.companyId.toUpperCase()} • {currentUser.departmentId} ({currentUser.siteId})
              </div>
            </div>
          </div>

          {/* Measurable Output Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Measurable Work Output Items (No Vague Entries)
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-[#6366F1] hover:underline font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('dwr.add_item')}</span>
              </button>
            </div>

            {items.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-base)] grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
              >
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    required
                    placeholder="Specific output (e.g. 4th Floor Slab Pour Rebar Check)"
                    value={item.taskTitle}
                    onChange={(e) => handleUpdateItem(idx, 'taskTitle', e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="number"
                    min={1}
                    required
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(idx, 'quantity', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    required
                    placeholder="Unit (Cu.Ft, Calls)"
                    value={item.unit}
                    onChange={(e) => handleUpdateItem(idx, 'unit', e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Notes / Grid"
                    value={item.notes}
                    onChange={(e) => handleUpdateItem(idx, 'notes', e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 text-[var(--text-muted)] hover:text-[#EF4444]"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Evidence Buttons */}
          <div className="p-3.5 rounded-xl bg-[var(--primary-bg)] border border-[var(--primary-border)] space-y-2">
            <p className="text-[11px] font-bold text-[var(--primary-text)] uppercase tracking-wider">
              Quick Evidence Capture (Field & Office)
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setHasPhoto(!hasPhoto)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                  hasPhoto
                    ? 'bg-[#10B981] text-white border-transparent shadow-sm'
                    : 'ui-surface text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{hasPhoto ? 'Photo Attached ✓' : t('dwr.photo_evidence')}</span>
              </button>

              <button
                type="button"
                onClick={() => setHasVoice(!hasVoice)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                  hasVoice
                    ? 'bg-[#10B981] text-white border-transparent shadow-sm'
                    : 'ui-surface text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{hasVoice ? 'Voice Note (0:24) ✓' : t('dwr.voice_evidence')}</span>
              </button>

              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl ui-surface text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] border text-xs font-semibold transition"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{t('dwr.qr_evidence')}</span>
              </button>
            </div>
          </div>

          {/* Problems & Support Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                {t('dwr.problems')}
              </label>
              <textarea
                rows={2}
                placeholder="Any site blockages, material delays, or dependencies..."
                value={problems}
                onChange={(e) => setProblems(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-base)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                {t('dwr.support')}
              </label>
              <textarea
                rows={2}
                placeholder="Specific management action or escalation required..."
                value={supportNeeded}
                onChange={(e) => setSupportNeeded(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-base)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
              />
            </div>
          </div>

          {validationError && (
            <div className="p-3 bg-[var(--danger-bg)] border border-[var(--danger-border)] text-[var(--danger-text)] rounded-xl text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => handleSubmitDWR(true)}
              className="px-4 py-2.5 rounded-xl ui-surface hover:bg-[var(--bg-hover)] text-xs font-semibold text-[var(--text-secondary)] transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              onClick={() => handleSubmitDWR(false)}
              className="px-5 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs shadow-sm transition flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t('dwr.submit_btn')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Supervisor Reviews */}
      {activeTab === 'REVIEW_PENDING' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Pending Supervisor Verifications (24h SLA)
            </h3>
            <span className="text-xs text-[var(--text-muted)]">1-5 Quality Rubric Rating</span>
          </div>

          {dwrList.filter((d) => d.status === 'SUBMITTED').length === 0 ? (
            <div className="ui-surface rounded-2xl p-8 text-center text-[var(--text-muted)] text-xs">
              All submitted DWRs have been verified. Zero backlogs.
            </div>
          ) : (
            dwrList
              .filter((d) => d.status === 'SUBMITTED')
              .map((dwr) => (
                <div key={dwr.id} className="ui-surface rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-[var(--text-primary)]">{dwr.employeeName}</span>
                      <span className="text-xs text-[var(--text-muted)] ml-2">
                        ({dwr.companyId.toUpperCase()} • {dwr.departmentId})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={dwr.status} />
                      <span className="text-xs text-[var(--text-muted)]">{dwr.workDate}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[var(--bg-subtle)] rounded-xl space-y-1 text-xs">
                    {dwr.items.map((it) => (
                      <div key={it.id} className="flex items-center justify-between text-[var(--text-secondary)]">
                        <span>{it.taskTitle}</span>
                        <strong className="text-[var(--text-primary)] font-bold">
                          {it.quantity} {it.unit}
                        </strong>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setReviewingDWR(dwr)}
                      className="px-3.5 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold text-xs transition flex items-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>Review & Rate Quality (1-5)</span>
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* Mode 3: History & Rubric Ratings */}
      {activeTab === 'HISTORY' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Daily Output History & Rubric Scores
            </h3>
            <span className="text-xs text-[var(--text-muted)]">Permanent Performer History</span>
          </div>

          <div className="space-y-3">
            {dwrList.map((dwr) => (
              <div key={dwr.id} className="ui-surface rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-primary)]">{dwr.employeeName}</span>
                    <span className="text-[11px] text-[var(--text-muted)]">• {dwr.workDate}</span>
                    <StatusBadge status={dwr.status} size="xs" />
                  </div>
                  {dwr.supervisorReview && (
                    <div className="flex items-center gap-1 text-xs font-bold text-[#F59E0B] bg-[var(--warning-bg)] px-2.5 py-1 rounded-lg border border-[var(--warning-border)]">
                      <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
                      <span>Score: {dwr.supervisorReview.qualityScore} / 5</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[var(--bg-subtle)] p-3 rounded-xl">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold mb-1">
                      Outputs Delivered
                    </p>
                    {dwr.items.map((it) => (
                      <p key={it.id} className="text-[var(--text-secondary)]">
                        • {it.taskTitle} ({it.quantity} {it.unit})
                      </p>
                    ))}
                  </div>

                  {dwr.supervisorReview ? (
                    <div className="bg-[var(--bg-subtle)] p-3 rounded-xl">
                      <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold mb-1">
                        Supervisor Feedback ({dwr.supervisorReview.reviewerName})
                      </p>
                      <p className="text-[var(--text-secondary)] italic">{dwr.supervisorReview.rubricFeedback}</p>
                    </div>
                  ) : (
                    <div className="bg-[var(--bg-subtle)] p-3 rounded-xl flex items-center justify-center text-[var(--text-muted)] italic">
                      Pending Supervisor Verification
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supervisor Review Rubric Modal */}
      {reviewingDWR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="ui-surface-elevated rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">Rate DWR Quality Rubric (1–5)</h3>
                <p className="text-xs text-[var(--text-muted)]">Record for {reviewingDWR.employeeName}</p>
              </div>
              <button onClick={() => setReviewingDWR(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                ✕
              </button>
            </div>

            {/* Rubric Star Buttons (1 to 5) */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">
                Quality Score (Rubric Criteria Standard)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRubricScore(s as any)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs border flex items-center justify-center gap-1 transition ${
                      rubricScore === s
                        ? 'bg-[#F59E0B] text-slate-950 border-transparent shadow'
                        : 'ui-surface text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${rubricScore >= s ? 'fill-current' : ''}`} />
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Rubric Feedback Notes
              </label>
              <textarea
                rows={3}
                value={rubricFeedback}
                onChange={(e) => setRubricFeedback(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-base)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setReviewingDWR(null)}
                className="px-4 py-2 rounded-xl ui-surface hover:bg-[var(--bg-hover)] text-xs text-[var(--text-secondary)] font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSupervisorVerify}
                className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Verify & Record Score</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
