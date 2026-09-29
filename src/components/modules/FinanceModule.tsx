import React, { useState } from 'react';
import {
  Receipt,
  RotateCcw,
  CheckCircle2,
  Lock,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../common/StatusBadge';
import { mockReceipts, mockExpenses, mockDailyClosings } from '../../db/mockData';
import { FinancialReceipt, FinancialExpense } from '../../types';

export const FinanceModule: React.FC = () => {
  const { currentUser, requestStepUpMFA } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'RECEIPTS' | 'EXPENSES' | 'DAILY_CLOSING'>('RECEIPTS');
  const [receipts, setReceipts] = useState<FinancialReceipt[]>(mockReceipts);
  const [expenses, setExpenses] = useState<FinancialExpense[]>(mockExpenses);

  // Reversal Modal state
  const [reversingReceipt, setReversingReceipt] = useState<FinancialReceipt | null>(null);
  const [reversalReason, setReversalReason] = useState<string>('');

  const handlePerformReversal = () => {
    if (!reversingReceipt || !reversalReason.trim()) return;

    requestStepUpMFA(
      `Financial Reversal: ${reversingReceipt.receiptNumber}`,
      `Reversing PKR ${reversingReceipt.amountPKR.toLocaleString()} for ${reversingReceipt.customerOrPayee}. This generates an immutable ledger reversal event.`,
      () => {
        setReceipts((prev) =>
          prev.map((r) =>
            r.id === reversingReceipt.id
              ? {
                  ...r,
                  status: 'REVERSED',
                  reversalReason,
                  reversedBy: currentUser.name
                }
              : r
          )
        );
        setReversingReceipt(null);
        setReversalReason('');
      }
    );
  };

  const handleApproveExpense = (expId: string) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === expId
          ? {
              ...e,
              status: 'APPROVED',
              approvedBy: currentUser.name,
              approvalDate: new Date().toISOString().split('T')[0]
            }
          : e
      )
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-6">
      {/* Header */}
      <div className="ui-surface-elevated p-6 rounded-[24px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-5 h-5 text-[var(--primary-500)]" />
            <h1 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">Finance, Approvals & Immutable Reversals</h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Rule: Deletion is strictly prohibited. Corrective adjustments execute via paired immutable reversals.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-subtle)] rounded-2xl border border-[var(--border-base)] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('RECEIPTS')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'RECEIPTS' ? 'btn-tactile-primary text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Receipts Schedule
          </button>
          <button
            onClick={() => setActiveTab('EXPENSES')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'EXPENSES' ? 'btn-tactile-primary text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Expense Vouchers
          </button>
          <button
            onClick={() => setActiveTab('DAILY_CLOSING')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'DAILY_CLOSING' ? 'btn-tactile-primary text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Daily Closings
          </button>
        </div>
      </div>

      {/* Tab 1: Receipts */}
      {activeTab === 'RECEIPTS' && (
        <div className="ui-card-tactile p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Customer Booking & Installment Receipts</h3>
            <span className="text-xs text-[var(--text-muted)]">Verified Bank Clearances</span>
          </div>

          <div className="space-y-3.5">
            {receipts.map((r) => (
              <div key={r.id} className="p-4.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-base)] space-y-3 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-[var(--primary-text)] bg-[var(--primary-bg)] px-2 py-0.5 rounded-lg border border-[var(--primary-border)]">
                      {r.receiptNumber}
                    </span>
                    <span className="text-xs font-bold text-[var(--text-primary)] ml-2">{r.customerOrPayee}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={r.status} size="xs" />
                    <span className="text-xs text-[var(--text-muted)]">{r.date}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[var(--bg-subtle)] p-3.5 rounded-2xl text-xs">
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Instrument</p>
                    <p className="font-semibold text-[var(--text-primary)]">{r.paymentMethod} ({r.instrumentRef})</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Amount</p>
                    <p className="font-bold text-[var(--success-text)] text-sm">PKR {r.amountPKR.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Allocated Unit</p>
                    <p className="text-[var(--text-secondary)]">{r.unitAllocated || 'General Balance'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Created By</p>
                    <p className="text-[var(--text-secondary)]">{r.createdBy}</p>
                  </div>
                </div>

                {r.status === 'REVERSED' ? (
                  <div className="p-3 bg-[var(--danger-bg)] border border-[var(--danger-border)] rounded-xl text-xs text-[var(--danger-text)]">
                    <strong>Reversal Reason:</strong> {r.reversalReason} (Reversed by {r.reversedBy})
                  </div>
                ) : (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setReversingReceipt(r)}
                      className="btn-tactile-secondary px-3.5 py-1.5 text-xs text-[var(--danger-dot)] hover:border-[var(--danger-border)] flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Execute Paired Reversal (MFA)</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Expense Vouchers */}
      {activeTab === 'EXPENSES' && (
        <div className="ui-card-tactile p-6 sm:p-7 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Disbursement & Expense Vouchers</h3>
          <div className="space-y-3.5">
            {expenses.map((e) => (
              <div key={e.id} className="p-4.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-base)] space-y-3 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-[var(--warning-text)] bg-[var(--warning-bg)] px-2 py-0.5 rounded-lg border border-[var(--warning-border)]">
                      {e.voucherNumber}
                    </span>
                    <span className="text-xs font-bold text-[var(--text-primary)] ml-2">{e.payee}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={e.status} size="xs" />
                    <span className="text-xs text-[var(--text-muted)]">{e.date}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[var(--bg-subtle)] p-3.5 rounded-2xl text-xs">
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Category</p>
                    <p className="font-semibold text-[var(--text-primary)]">{e.category}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Amount</p>
                    <p className="font-bold text-[var(--danger-dot)] text-sm">PKR {e.amountPKR.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Tax Deducted</p>
                    <p className="text-[var(--text-secondary)]">PKR {e.taxDeductionPKR.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Approved By</p>
                    <p className="text-[var(--text-secondary)]">{e.approvedBy || 'Pending'}</p>
                  </div>
                </div>

                {e.status === 'UNDER_REVIEW' && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleApproveExpense(e.id)}
                      className="btn-tactile-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Disbursement</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Daily Closings */}
      {activeTab === 'DAILY_CLOSING' && (
        <div className="ui-card-tactile p-6 sm:p-7 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Verified Daily Financial Closings</h3>
          <div className="space-y-3.5">
            {mockDailyClosings.map((c) => (
              <div key={c.id} className="p-4.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-base)] space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-primary)]">{c.companyId.toUpperCase()} • Closing {c.date}</span>
                  <StatusBadge status={c.status} size="xs" />
                </div>
                <div className="grid grid-cols-3 gap-3 bg-[var(--bg-subtle)] p-3.5 rounded-2xl text-xs">
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Total Collections</p>
                    <p className="font-bold text-[var(--success-text)] text-sm">PKR {c.totalReceiptsPKR.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Total Payments</p>
                    <p className="font-bold text-[var(--danger-dot)] text-sm">PKR {c.totalExpensesPKR.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Closing Balance</p>
                    <p className="font-extrabold text-[var(--text-primary)] text-sm">PKR {c.closingBankBalancePKR.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reversal Modal */}
      {reversingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
          <div className="ui-surface-elevated rounded-[24px] p-6 max-w-lg w-full shadow-2xl space-y-4 border border-[var(--border-base)]">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)]">Confirm Paired Financial Reversal</h3>
              <button onClick={() => setReversingReceipt(null)} className="p-1 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)]">✕</button>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--warning-bg)] border border-[var(--warning-border)] text-xs text-[var(--warning-text)] space-y-1">
              <strong>Immutable Audit Requirement:</strong>
              <p>State specific justification for reversing receipt {reversingReceipt.receiptNumber} (PKR {reversingReceipt.amountPKR.toLocaleString()}).</p>
            </div>

            <textarea
              rows={3}
              required
              placeholder="e.g. Bank dishonored cheque #88192; replaced with cash receipt..."
              value={reversalReason}
              onChange={(e) => setReversalReason(e.target.value)}
              className="w-full px-3 py-2 input-tactile text-xs text-[var(--text-primary)]"
            />

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setReversingReceipt(null)}
                className="btn-tactile-secondary px-4 py-2.5 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePerformReversal}
                className="btn-tactile-danger px-5 py-2.5 text-xs font-bold flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Authorize Reversal (MFA)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
