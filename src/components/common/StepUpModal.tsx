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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md ui-surface-elevated rounded-2xl p-6 shadow-2xl border">
        <button
          onClick={cancelStepUpMFA}
          className="absolute top-4 right-4 p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-hover)]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-[var(--primary-bg)] border border-[var(--primary-border)] text-[#6366F1] rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">{t('security.step_up')}</h3>
            <p className="text-[11px] text-[var(--text-muted)]">Privileged Action Policy Verification</p>
          </div>
        </div>

        <div className="bg-[var(--bg-subtle)] border border-[var(--border-base)] rounded-xl p-3.5 mb-4 text-xs space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[var(--text-primary)] block font-semibold">{stepUpData.actionTitle}</strong>
              <p className="text-[var(--text-secondary)] mt-0.5">{stepUpData.actionDescription}</p>
            </div>
          </div>
          <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-between text-[11px] text-[var(--text-muted)]">
            <span>Principal:</span>
            <span className="font-semibold text-[var(--text-primary)]">{currentUser.name}</span>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 flex items-center justify-between">
              <span>Enter 6-Digit MFA Token</span>
              <span className="text-[#6366F1] text-[10px] bg-[var(--primary-bg)] px-2 py-0.2 rounded border border-[var(--primary-border)] font-mono">
                Demo: 123456
              </span>
            </label>
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
                className="w-full text-center tracking-[0.5em] text-xl font-mono font-bold py-2.5 bg-[var(--bg-base)] border border-[var(--border-base)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1]"
                autoFocus
              />
              <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {error && <p className="text-[#EF4444] text-xs mt-1.5">{error}</p>}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={cancelStepUpMFA}
              className="flex-1 px-4 py-2 rounded-xl ui-surface hover:bg-[var(--bg-hover)] text-xs text-[var(--text-secondary)] font-semibold transition"
            >
              {t('action.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
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
