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
    <div className="space-y-6 animate-fadeIn pb-6">
      {/* Top Header & Tabs */}
      <div className="ui-surface-elevated p-6 rounded-[24px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HardHat className="w-5 h-5 text-[var(--warning-dot)]" />
            <h1 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">Project Controls, MB & Construction Quality</h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Rule: Zero Contractor Billing without QS-Verified Measurement Book (MB) entries.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[var(--bg-subtle)] rounded-2xl border border-[var(--border-base)] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('MB_REGISTER')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'MB_REGISTER' ? 'btn-tactile-primary text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Measurement Book (MB)
          </button>
          <button
            onClick={() => setActiveTab('CONTRACTOR_BILLS')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'CONTRACTOR_BILLS' ? 'btn-tactile-primary text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Contractor IPC Bills
          </button>
          <button
            onClick={() => setActiveTab('DRAWINGS')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'DRAWINGS' ? 'btn-tactile-primary text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Drawings (ISO 19650)
          </button>
          <button
            onClick={() => setActiveTab('BOQ')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'BOQ' ? 'btn-tactile-primary text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            BOQ Schedule
          </button>
          <button
            onClick={() => setActiveTab('DPR_QC')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'DPR_QC' ? 'btn-tactile-primary text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            DPR & QC
          </button>
        </div>
      </div>

      {/* Tab 1: Measurement Book (MB) 3-Step Verification */}
      {activeTab === 'MB_REGISTER' && (
        <div className="ui-card-tactile p-6 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[var(--primary-500)]" />
                <span>Physical Site Measurement Book (MB) Register</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Workflow: Supervisor Entry → Engineer Cross-Check → Lead QS Verification & Lock
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {mbEntries.map((mb) => (
              <div key={mb.id} className="p-4.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-base)] space-y-3.5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-[var(--primary-text)] bg-[var(--primary-bg)] px-2 py-0.5 rounded-lg border border-[var(--primary-border)]">
                      {mb.id.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-[var(--text-primary)] ml-2">{mb.itemDescription}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={mb.status} size="xs" />
                    <span className="text-xs text-[var(--text-muted)]">{mb.dateRecorded}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[var(--bg-subtle)] p-3.5 rounded-2xl text-xs">
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Location / Grid</p>
                    <p className="font-semibold text-[var(--text-primary)]">{mb.locationReference}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Verified Quantity</p>
                    <p className="font-bold text-[var(--success-text)] text-sm">{mb.quantityMeasured} {mb.unit}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Recorded By</p>
                    <p className="text-[var(--text-secondary)]">{mb.enteredBy}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Lead QS Sign-Off</p>
                    <p className="text-[var(--primary-text)] font-semibold">{mb.verifiedBy || 'Pending QS Verification'}</p>
                  </div>
                </div>

                {mb.status !== 'QS_VERIFIED' && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleVerifyMB(mb.id)}
                      className="btn-tactile-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-sm"
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
        <div className="ui-card-tactile p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--primary-500)]" />
                <span>Interim Payment Certificate (IPC) Contractor Bills</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Rule: Zero payment certificate generation without prior QS Measurement verification.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {bills.map((b) => (
              <div key={b.id} className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-base)] space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-[var(--warning-text)] bg-[var(--warning-bg)] px-2 py-0.5 rounded-lg border border-[var(--warning-border)]">
                      {b.ipcNumber}
                    </span>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] mt-1">{b.contractorName}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={b.status} size="xs" />
                    <span className="text-xs text-[var(--text-muted)]">Period: {b.periodStart} to {b.periodEnd}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[var(--bg-subtle)] p-4 rounded-2xl text-xs">
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Claimed by Contractor</p>
                    <p className="font-bold text-[var(--text-secondary)]">PKR {(b.claimedAmountPKR / 1000000).toFixed(2)}M</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">QS Verified Amount</p>
                    <p className="font-bold text-[var(--success-text)]">PKR {(b.verifiedAmountPKR / 1000000).toFixed(2)}M</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Retention (10%)</p>
                    <p className="font-bold text-[var(--danger-dot)]">- PKR {(b.retentionDeductionPKR / 1000000).toFixed(2)}M</p>
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
                      className="btn-tactile-primary px-4 py-2 text-xs font-bold flex items-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Approve Bill for Finance Release (MFA)</span>
                    </button>
                  )}
                  {b.status === 'APPROVED_FOR_PAYMENT' && (
                    <span className="text-[var(--success-text)] font-bold flex items-center gap-1.5">
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
        <div className="ui-card-tactile p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--primary-500)]" />
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
                className={`p-4.5 rounded-2xl border cursor-pointer transition relative overflow-hidden ${
                  drw.status === 'SUPERSEDED'
                    ? 'bg-[var(--danger-bg)] border-[var(--danger-border)] opacity-80'
                    : 'bg-[var(--bg-elevated)] border-[var(--border-base)] hover:border-[var(--border-strong)]'
                }`}
              >
                {/* Visual Watermark for Superseded */}
                {drw.status === 'SUPERSEDED' && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20 rotate-[-20deg]">
                    <span className="text-2xl font-black text-[var(--danger-dot)] border-4 border-[var(--danger-dot)] px-4 py-1 uppercase">
                      SUPERSEDED / DO NOT ISSUE
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-[var(--primary-text)]">{drw.drawingNo}</span>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] mt-0.5">{drw.title}</h4>
                  </div>
                  <StatusBadge status={drw.status} size="xs" />
                </div>

                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-subtle)]">
                  <span>Discipline: <strong className="text-[var(--text-primary)]">{drw.discipline}</strong></span>
                  <span>Revision: <strong className="text-[var(--warning-text)]">{drw.currentRevision}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: BOQ Schedule */}
      {activeTab === 'BOQ' && (
        <div className="ui-card-tactile p-6 sm:p-7 space-y-4">
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
                  <tr key={boq.id} className="hover:bg-[var(--bg-hover)] transition">
                    <td className="py-3 px-3 font-mono text-[var(--primary-text)] font-bold">{boq.itemCode}</td>
                    <td className="py-3 px-3 text-[var(--text-primary)] max-w-xs">{boq.description}</td>
                    <td className="py-3 px-3 text-[var(--text-muted)]">{boq.unit}</td>
                    <td className="py-3 px-3 font-semibold text-[var(--text-secondary)]">{boq.boqQuantity.toLocaleString()}</td>
                    <td className="py-3 px-3 text-[var(--text-muted)] font-mono">PKR {boq.contractRatePKR.toLocaleString()}</td>
                    <td className="py-3 px-3 font-bold text-[var(--success-text)]">{boq.executedQuantity.toLocaleString()}</td>
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
          <div className="ui-card-tactile p-6 space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Building className="w-4 h-4 text-[var(--primary-500)]" />
              <span>Daily Progress Report (DPR)</span>
            </h3>
            {mockDPRReports.map((dpr) => (
              <div key={dpr.id} className="p-4 bg-[var(--bg-subtle)] rounded-2xl border border-[var(--border-base)] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)]">{dpr.projectName}</span>
                  <span className="text-[var(--text-muted)]">{dpr.date} ({dpr.weather})</span>
                </div>
                <p className="text-[var(--text-secondary)]"><strong>Work Done:</strong> {dpr.workDoneSummary}</p>
                <p className="text-[11px] text-[var(--text-muted)]">Headcount: {dpr.manpowerHeadcount} Personnel</p>
              </div>
            ))}
          </div>

          <div className="ui-card-tactile p-6 space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[var(--danger-dot)]" />
              <span>QC Inspections & Open NCRs</span>
            </h3>
            {mockNCRs.map((ncr) => (
              <div key={ncr.id} className="p-4 bg-[var(--danger-bg)] rounded-2xl border border-[var(--danger-border)] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[var(--danger-dot)]">{ncr.ncrNumber}</span>
                  <StatusBadge status={ncr.status} size="xs" />
                </div>
                <p className="font-semibold text-[var(--text-primary)]">{ncr.description}</p>
                <div className="p-3 bg-[var(--bg-elevated)] rounded-xl text-[var(--text-secondary)]">
                  <strong className="text-[var(--warning-text)]">Action:</strong> {ncr.correctiveActionProposed}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drawing Viewer Modal */}
      {selectedDrawing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="ui-surface-elevated rounded-[24px] p-6 max-w-3xl w-full shadow-2xl space-y-4 border border-[var(--border-base)]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[var(--primary-text)]">{selectedDrawing.drawingNo}</span>
                <h3 className="text-base font-bold text-[var(--text-primary)]">{selectedDrawing.title}</h3>
              </div>
              <button onClick={() => setSelectedDrawing(null)} className="p-1 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)]">✕</button>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-[var(--border-base)] bg-black h-80 flex items-center justify-center">
              <img
                src={selectedDrawing.fileUrl}
                alt="Engineering Drawing"
                className="w-full h-full object-cover opacity-80"
              />
              {selectedDrawing.status === 'SUPERSEDED' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rotate-[-15deg]">
                  <span className="text-3xl font-black text-[var(--danger-dot)] border-4 border-[var(--danger-dot)] px-6 py-2 uppercase">
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
