import React, { useState } from 'react';
import {
  Receipt,
  RotateCcw,
  CheckCircle2,
  Lock,
  ShieldAlert
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
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--border-base)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-5 h-5 text-[#10B981]" />
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Finance, Approvals & Immutable Reversals</h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Rule: Deletion is strictly prohibited. Corrective adjustments execute via paired immutable reversals.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-base)] text-xs">
          <button
            onClick={() => setActiveTab('RECEIPTS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'RECEIPTS' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Receipts Schedule
          </button>
          <button
            onClick={() => setActiveTab('EXPENSES')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'EXPENSES' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Expense Vouchers
          </button>
          <button
            onClick={() => setActiveTab('DAILY_CLOSING')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'DAILY_CLOSING' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Daily Closing
          </button>
        </div>
      </div>

      {/* Tab 1: Receipts & Reversal Flow */}
      {activeTab === 'RECEIPTS' && (
        <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Customer & Commercial Receipts</h3>
          <div className="space-y-3">
            {receipts.map((rec) => (
              <div
                key={rec.id}
                className={`p-4 rounded-xl border space-y-3 transition ${
                  rec.status === 'REVERSED'
                    ? 'bg-[var(--danger-bg)] border-[var(--danger-border)] opacity-75'
                    : 'ui-surface'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#6366F1]">{rec.receiptNumber}</span>
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">{rec.customerOrPayee}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={rec.status} size="xs" />
                    <span className="text-xs text-[var(--text-muted)]">{rec.date}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[var(--bg-subtle)] p-3 rounded-xl text-xs">
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Amount Received</p>
                    <p className="text-base font-extrabold text-[#10B981]">
                      PKR {rec.amountPKR.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Payment Mode & Ref</p>
                    <p className="text-[var(--text-secondary)]">{rec.paymentMethod} • {rec.referenceNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Account Classification</p>
                    <p className="text-[#6366F1] truncate">{rec.accountCategory}</p>
                  </div>
                </div>

                {rec.status === 'REVERSED' && (
                  <div className="p-2.5 rounded-lg bg-[var(--danger-bg)] text-xs text-[var(--danger-text)] space-y-0.5">
                    <strong>Reversal Reason:</strong> {rec.reversalReason} (Authorized by: {rec.reversedBy})
                  </div>
                )}

                {rec.status === 'POSTED' && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setReversingReceipt(rec)}
                      className="px-3 py-1.5 rounded-xl bg-[var(--danger-bg)] text-[var(--danger-text)] border border-[var(--danger-border)] hover:brightness-105 font-semibold text-xs transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Execute Reversal Voucher</span>
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
        <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Vendor Expense Vouchers</h3>
          <div className="space-y-3">
            {expenses.map((exp) => (
              <div key={exp.id} className="p-4 rounded-xl ui-surface border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#F59E0B]">{exp.voucherNumber}</span>
                    <span className="text-sm font-bold text-[var(--text-primary)]">{exp.vendorName}</span>
                  </div>
                  <StatusBadge status={exp.status} size="xs" />
                </div>

                <div className="flex items-center justify-between text-xs bg-[var(--bg-subtle)] p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Category</span>
                    <p className="text-[var(--text-secondary)] font-semibold">{exp.category}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Amount (PKR)</span>
                    <p className="font-extrabold text-[#F59E0B] text-sm">PKR {exp.amountPKR.toLocaleString()}</p>
                  </div>
                </div>

                {exp.status === 'SUBMITTED' && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleApproveExpense(exp.id)}
                      className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Expense Voucher</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Daily Closing */}
      {activeTab === 'DAILY_CLOSING' && (
        <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Daily Financial Closing & Reconciliation</h3>
          {mockDailyClosings.map((cls) => (
            <div key={cls.id} className="p-5 rounded-xl ui-surface border space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--text-primary)]">Closing Date: {cls.closingDate}</span>
                <StatusBadge status={cls.status} size="xs" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[var(--bg-subtle)] p-4 rounded-xl text-xs">
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Opening Balance</p>
                  <p className="font-bold text-[var(--text-secondary)]">PKR {(cls.openingBalancePKR / 1000000).toFixed(2)}M</p>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Total Receipts</p>
                  <p className="font-bold text-[#10B981]">+ PKR {(cls.totalReceiptsPKR / 1000000).toFixed(2)}M</p>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Total Expenses</p>
                  <p className="font-bold text-[#EF4444]">- PKR {(cls.totalExpensesPKR / 1000000).toFixed(2)}M</p>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase font-semibold">Closing Balance</p>
                  <p className="font-extrabold text-[var(--text-primary)] text-base">PKR {(cls.closingBalancePKR / 1000000).toFixed(2)}M</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reversal Confirmation Modal */}
      {reversingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="ui-surface-elevated rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#EF4444]" />
                <h3 className="text-base font-bold text-[var(--text-primary)]">Execute Immutable Reversal</h3>
              </div>
              <button onClick={() => setReversingReceipt(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">✕</button>
            </div>

            <div className="p-3 bg-[var(--bg-subtle)] rounded-xl text-xs text-[var(--text-secondary)] space-y-1">
              <p>Receipt: <strong className="text-[var(--text-primary)]">{reversingReceipt.receiptNumber}</strong></p>
              <p>Customer: <strong className="text-[var(--text-primary)]">{reversingReceipt.customerOrPayee}</strong></p>
              <p>Amount: <strong className="text-[#EF4444]">PKR {reversingReceipt.amountPKR.toLocaleString()}</strong></p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Mandatory Reversal Justification Reason
              </label>
              <textarea
                rows={3}
                required
                placeholder="Explain reason for reversal..."
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-base)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#EF4444]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setReversingReceipt(null)}
                className="px-4 py-2 rounded-xl ui-surface hover:bg-[var(--bg-hover)] text-xs text-[var(--text-secondary)] font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePerformReversal}
                className="px-5 py-2 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-xs transition flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Verify & Execute Reversal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
