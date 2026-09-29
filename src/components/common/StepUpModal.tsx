import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const StepUpModal: React.FC = () => {
  const { isStepUpOpen, stepUpData, confirmStepUpMFA, cancelStepUpMFA, currentUser } = useAuth();
  const { t } = useLanguage();
  const [otp, setOtp] = useState<string>('123456');
  const [error, setError] = useState<string | null>(null);

  if (!isStepUpOpen || !stepUpData) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError('Please enter a valid 6-digit authentication token.');
      return;
    }
    const success = confirmStepUpMFA(otp);
    if (!success) {
      setError('Invalid token. Verification failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md ui-surface-elevated rounded-[24px] p-6 sm:p-7 shadow-2xl border border-[var(--border-base)]">
        <button
          onClick={cancelStepUpMFA}
          className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-hover)] transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-[var(--primary-bg)] border border-[var(--primary-border)] text-[var(--primary-text)] rounded-2xl shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">{t('security.step_up')}</h3>
            <p className="text-[11px] text-[var(--text-muted)]">Privileged Action Policy Verification</p>
          </div>
        </div>

        <div className="bg-[var(--bg-subtle)] border border-[var(--border-base)] rounded-2xl p-4 mb-4 text-xs space-y-2">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[var(--warning-dot)] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[var(--text-primary)] block font-semibold">{stepUpData.actionTitle}</strong>
              <p className="text-[var(--text-secondary)] mt-0.5">{stepUpData.actionDescription}</p>
            </div>
          </div>
          <div className="pt-2.5 border-t border-[var(--border-subtle)] flex justify-between text-[11px] text-[var(--text-muted)]">
            <span>Principal:</span>
            <span className="font-semibold text-[var(--text-primary)]">{currentUser.name}</span>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">
                Enter 6-Digit MFA Token
              </label>
              <span className="text-[var(--primary-text)] text-[10px] bg-[var(--primary-bg)] px-2 py-0.5 rounded-full border border-[var(--primary-border)] font-mono font-bold">
                Demo: 123456
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError(null);
                }}
                placeholder="123456"
                className="w-full text-center tracking-[0.5em] text-xl font-mono font-bold py-3 input-tactile text-[var(--text-primary)]"
                autoFocus
              />
              <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {error && <p className="text-[var(--danger-dot)] text-xs mt-1.5 font-medium">{error}</p>}
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={cancelStepUpMFA}
              className="btn-tactile-secondary flex-1 py-2.5 text-xs font-semibold"
            >
              {t('action.cancel')}
            </button>
            <button
              type="submit"
              className="btn-tactile-primary flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('security.verify_btn')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
