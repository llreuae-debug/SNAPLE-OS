import React, { useState } from 'react';
import {
  HardHat,
  FileCheck2,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building,
  Image as ImageIcon,
  Lock,
  Plus,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  mockDrawings,
  mockBOQItems,
  mockMeasurementEntries,
  mockContractorBills,
  mockDPRReports,
  mockQCInspections,
  mockNCRs
} from '../../db/mockData';
import { DrawingItem, MeasurementEntry, ContractorBillIPC } from '../../types';

export const ProjectControlsModule: React.FC = () => {
  const { currentUser, requestStepUpMFA } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'MB_REGISTER' | 'DRAWINGS' | 'BOQ' | 'CONTRACTOR_BILLS' | 'DPR_QC'>('MB_REGISTER');
  const [drawings, setDrawings] = useState<DrawingItem[]>(mockDrawings);
  const [mbEntries, setMbEntries] = useState<MeasurementEntry[]>(mockMeasurementEntries);
  const [bills, setBills] = useState<ContractorBillIPC[]>(mockContractorBills);

  // Selected Drawing modal for viewer
  const [selectedDrawing, setSelectedDrawing] = useState<DrawingItem | null>(null);

  const handleVerifyMB = (id: string) => {
    setMbEntries((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'QS_VERIFIED',
              verifiedBy: currentUser.name
            }
          : m
      )
    );
  };

  const handleCertifyBill = (billId: string) => {
    requestStepUpMFA(
      'Certify Contractor IPC Bill for Payment',
      'This action authorises the release of PKR 15,480,000 to Al-Madina Construction based on verified MB line items.',
      () => {
        setBills((prev) =>
          prev.map((b) => (b.id === billId ? { ...b, status: 'APPROVED_FOR_PAYMENT' } : b))
        );
      }
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--border-base)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HardHat className="w-5 h-5 text-[#F59E0B]" />
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Project Controls, MB & Construction Quality</h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Rule: Zero Contractor Billing without QS-Verified Measurement Book (MB) entries.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-base)] text-xs">
          <button
            onClick={() => setActiveTab('MB_REGISTER')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'MB_REGISTER' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Measurement Book (MB)
          </button>
          <button
            onClick={() => setActiveTab('CONTRACTOR_BILLS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'CONTRACTOR_BILLS' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Contractor IPC Bills
          </button>
          <button
            onClick={() => setActiveTab('DRAWINGS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'DRAWINGS' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Drawings (ISO 19650)
          </button>
          <button
            onClick={() => setActiveTab('BOQ')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'BOQ' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            BOQ Schedule
          </button>
          <button
            onClick={() => setActiveTab('DPR_QC')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'DPR_QC' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            DPR & QC
          </button>
        </div>
      </div>

      {/* Tab 1: Measurement Book (MB) 3-Step Verification */}
      {activeTab === 'MB_REGISTER' && (
        <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#10B981]" />
                <span>Physical Site Measurement Book (MB) Register</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Workflow: Supervisor Entry → Engineer Cross-Check → Lead QS Verification & Lock
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {mbEntries.map((mb) => (
              <div key={mb.id} className="p-4 rounded-xl ui-surface border space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#6366F1]">{mb.id.toUpperCase()}</span>
                    <span className="text-xs font-bold text-[var(--text-primary)] ml-2">{mb.itemDescription}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={mb.status} size="xs" />
                    <span className="text-xs text-[var(--text-muted)]">{mb.dateRecorded}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[var(--bg-subtle)] p-3 rounded-xl text-xs">
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Location / Grid</p>
                    <p className="font-semibold text-[var(--text-primary)]">{mb.locationReference}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Verified Quantity</p>
                    <p className="font-bold text-[#10B981] text-sm">{mb.quantityMeasured} {mb.unit}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Recorded By</p>
                    <p className="text-[var(--text-secondary)]">{mb.enteredBy}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Lead QS Sign-Off</p>
                    <p className="text-[#6366F1] font-semibold">{mb.verifiedBy || 'Pending QS Verification'}</p>
                  </div>
                </div>

                {mb.status !== 'QS_VERIFIED' && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleVerifyMB(mb.id)}
                      className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Lock for Contractor Billing</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Contractor IPC Bills */}
      {activeTab === 'CONTRACTOR_BILLS' && (
        <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#6366F1]" />
                <span>Interim Payment Certificate (IPC) Contractor Bills</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Rule: Zero payment certificate generation without prior QS Measurement verification.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {bills.map((b) => (
              <div key={b.id} className="p-5 rounded-xl ui-surface border space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#F59E0B]">{b.ipcNumber}</span>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] mt-0.5">{b.contractorName}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={b.status} size="xs" />
                    <span className="text-xs text-[var(--text-muted)]">Period: {b.periodStart} to {b.periodEnd}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[var(--bg-subtle)] p-4 rounded-xl text-xs">
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Claimed by Contractor</p>
                    <p className="font-bold text-[var(--text-secondary)]">PKR {(b.claimedAmountPKR / 1000000).toFixed(2)}M</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">QS Verified Amount</p>
                    <p className="font-bold text-[#10B981]">PKR {(b.verifiedAmountPKR / 1000000).toFixed(2)}M</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Retention (10%)</p>
                    <p className="font-bold text-[#EF4444]">- PKR {(b.retentionDeductionPKR / 1000000).toFixed(2)}M</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Net Payable to Contractor</p>
                    <p className="font-extrabold text-[var(--text-primary)] text-base">PKR {(b.netPayablePKR / 1000000).toFixed(2)}M</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-xs">
                  <span className="text-[var(--text-muted)]">
                    Backed by <strong>{b.verifiedMBEntriesCount} QS-Verified MB line items</strong>.
                  </span>
                  {b.status === 'QS_CERTIFIED' && (
                    <button
                      onClick={() => handleCertifyBill(b.id)}
                      className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs shadow-sm transition flex items-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Approve Bill for Finance Release (MFA)</span>
                    </button>
                  )}
                  {b.status === 'APPROVED_FOR_PAYMENT' && (
                    <span className="text-[#10B981] font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Certified & Dispatched to Finance</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Controlled Drawing Register */}
      {activeTab === 'DRAWINGS' && (
        <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#6366F1]" />
                <span>Controlled Engineering Drawing Register (ISO 19650)</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Superseded revisions are strictly watermarked to prevent obsolete drawings from reaching site.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drawings.map((drw) => (
              <div
                key={drw.id}
                onClick={() => setSelectedDrawing(drw)}
                className={`p-4 rounded-xl border cursor-pointer transition relative overflow-hidden ${
                  drw.status === 'SUPERSEDED'
                    ? 'bg-[var(--danger-bg)] border-[var(--danger-border)] opacity-75'
                    : 'ui-surface hover:border-[#6366F1]'
                }`}
              >
                {/* Visual Watermark for Superseded */}
                {drw.status === 'SUPERSEDED' && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-15 rotate-[-20deg]">
                    <span className="text-3xl font-black text-[#EF4444] border-4 border-[#EF4444] px-4 py-1 uppercase">
                      SUPERSEDED / DO NOT ISSUE
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#6366F1]">{drw.drawingNo}</span>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] mt-0.5">{drw.title}</h4>
                  </div>
                  <StatusBadge status={drw.status} size="xs" />
                </div>

                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-subtle)]">
                  <span>Discipline: <strong className="text-[var(--text-primary)]">{drw.discipline}</strong></span>
                  <span>Revision: <strong className="text-[#F59E0B]">{drw.currentRevision}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: BOQ Schedule */}
      {activeTab === 'BOQ' && (
        <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Bill of Quantities (BOQ) Master Schedule</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-base)] text-[var(--text-muted)] uppercase font-semibold">
                  <th className="pb-3 px-3">Item Code</th>
                  <th className="pb-3 px-3">Description</th>
                  <th className="pb-3 px-3">Unit</th>
                  <th className="pb-3 px-3">BOQ Qty</th>
                  <th className="pb-3 px-3">Contract Rate</th>
                  <th className="pb-3 px-3">Executed Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {mockBOQItems.map((boq) => (
                  <tr key={boq.id} className="hover:bg-[var(--bg-hover)]">
                    <td className="py-3 px-3 font-mono text-[#6366F1] font-bold">{boq.itemCode}</td>
                    <td className="py-3 px-3 text-[var(--text-primary)] max-w-xs">{boq.description}</td>
                    <td className="py-3 px-3 text-[var(--text-muted)]">{boq.unit}</td>
                    <td className="py-3 px-3 font-semibold text-[var(--text-secondary)]">{boq.boqQuantity.toLocaleString()}</td>
                    <td className="py-3 px-3 text-[var(--text-muted)] font-mono">PKR {boq.contractRatePKR.toLocaleString()}</td>
                    <td className="py-3 px-3 font-bold text-[#10B981]">{boq.executedQuantity.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: DPR & QC */}
      {activeTab === 'DPR_QC' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Building className="w-4 h-4 text-[#6366F1]" />
              <span>Daily Progress Report (DPR)</span>
            </h3>
            {mockDPRReports.map((dpr) => (
              <div key={dpr.id} className="p-4 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-base)] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)]">{dpr.projectName}</span>
                  <span className="text-[var(--text-muted)]">{dpr.date} ({dpr.weather})</span>
                </div>
                <p className="text-[var(--text-secondary)]"><strong>Work Done:</strong> {dpr.workDoneSummary}</p>
                <p className="text-[11px] text-[var(--text-muted)]">Headcount: {dpr.manpowerHeadcount} Personnel</p>
              </div>
            ))}
          </div>

          <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
              <span>QC Inspections & Open NCRs</span>
            </h3>
            {mockNCRs.map((ncr) => (
              <div key={ncr.id} className="p-4 bg-[var(--danger-bg)] rounded-xl border border-[var(--danger-border)] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#EF4444]">{ncr.ncrNumber}</span>
                  <StatusBadge status={ncr.status} size="xs" />
                </div>
                <p className="font-semibold text-[var(--text-primary)]">{ncr.description}</p>
                <div className="p-2.5 bg-[var(--bg-surface)] rounded-lg text-[var(--text-secondary)]">
                  <strong className="text-[var(--warning-text)]">Action:</strong> {ncr.correctiveActionProposed}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drawing Viewer Modal */}
      {selectedDrawing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="ui-surface-elevated rounded-2xl p-6 max-w-3xl w-full shadow-2xl space-y-4 border">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#6366F1]">{selectedDrawing.drawingNo}</span>
                <h3 className="text-base font-bold text-[var(--text-primary)]">{selectedDrawing.title}</h3>
              </div>
              <button onClick={() => setSelectedDrawing(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">✕</button>
            </div>

            <div className="relative rounded-xl overflow-hidden border bg-black h-80 flex items-center justify-center">
              <img
                src={selectedDrawing.fileUrl}
                alt="Engineering Drawing"
                className="w-full h-full object-cover opacity-80"
              />
              {selectedDrawing.status === 'SUPERSEDED' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rotate-[-15deg]">
                  <span className="text-3xl font-black text-[#EF4444] border-4 border-[#EF4444] px-6 py-2 uppercase">
                    SUPERSEDED — NOT FOR SITE
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-[var(--text-muted)]">Revision: {selectedDrawing.currentRevision}</span>
              <StatusBadge status={selectedDrawing.status} size="xs" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
