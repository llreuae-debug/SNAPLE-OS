import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  ShieldCheck,
  CheckCircle2,
  Database,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  mockAIAgents,
  mockAIRunRecommendations
} from '../../db/mockData';
import { AIAgentDefinition, AIRunRecommendation } from '../../types';

export const AIAgentCenter: React.FC = () => {
  const { currentUser, activeCompanyId, requestStepUpMFA } = useAuth();
  const { t, isRTL } = useLanguage();

  const [selectedAgent, setSelectedAgent] = useState<AIAgentDefinition>(mockAIAgents[0]);
  const [recommendations, setRecommendations] = useState<AIRunRecommendation[]>(mockAIRunRecommendations);
  const [userQuery, setUserQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleApproveRecommendation = (rec: AIRunRecommendation) => {
    requestStepUpMFA(
      `Approve AI Recommendation (${rec.agentName})`,
      `Executing action for: "${rec.findingHeadline}". This applies human governance sign-off.`,
      () => {
        setRecommendations((prev) =>
          prev.map((r) =>
            r.id === rec.id
              ? {
                  ...r,
                  status: 'APPROVED_BY_USER',
                  reviewedBy: currentUser.name
                }
              : r
          )
        );
      }
    );
  };

  const handleRejectRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'REJECTED_BY_USER',
              reviewedBy: currentUser.name
            }
          : r
      )
    );
  };

  const handleRunAgentAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const newRec: AIRunRecommendation = {
        id: `ai-rec-${Date.now()}`,
        agentId: selectedAgent.id,
        agentName: selectedAgent.name,
        companyId: activeCompanyId === 'ALL' ? currentUser.companyId : activeCompanyId,
        scopeSummary: `${selectedAgent.name} • Live Query Analysis`,
        timestamp: 'Just now',
        findingHeadline: `Analysis completed: "${userQuery.slice(0, 50)}..."`,
        recommendationBody: `Based on cross-referencing recent DWRs, verified Measurement Book entries, and active CRM deals within your permitted ${currentUser.scope.maxConfidentiality} scope: zero discrepancies detected against ISO 9001 governance standards.`,
        sourceRecords: [
          { recordType: 'DWR Records', recordId: 'dwr-latest', label: 'Recent verified DWR outputs' },
          { recordType: 'Scope Policy', recordId: 'abac-01', label: 'User ABAC permission scope' }
        ],
        confidenceRating: 96,
        status: 'PENDING_HUMAN_REVIEW'
      };

      setRecommendations((prev) => [newRec, ...prev]);
      setIsAnalyzing(false);
      setUserQuery('');
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-6">
      {/* Header Banner */}
      <div className="ui-surface-elevated p-6 rounded-[24px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-[var(--accent-500)]" />
            <h1 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">SNAPLE AI Intelligence Sentinel</h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            AI operates strictly as a permission-constrained recommendation assistant. All actions require human authorization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-[var(--primary-bg)] text-[var(--primary-text)] border border-[var(--primary-border)] text-xs font-semibold flex items-center gap-1.5 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[var(--primary-500)]" />
            <span>ABAC Guard: {currentUser.scope.maxConfidentiality}</span>
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Domain Agents */}
        <div className="lg:col-span-4 space-y-3">
          <div className="ui-card-tactile p-5 space-y-3.5">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Specialized Domain Agents
            </h3>

            <div className="space-y-2">
              {mockAIAgents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition ${
                    selectedAgent.id === agent.id
                      ? 'bg-[var(--accent-bg)] border-[var(--accent-border)] text-[var(--text-primary)] shadow-sm'
                      : 'bg-[var(--bg-elevated)] border-[var(--border-base)] hover:border-[var(--border-strong)] text-[var(--text-secondary)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[var(--text-primary)]">{isRTL ? agent.nameUrdu : agent.name}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-500)]" />
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">{agent.role}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Query Box & Recommendations */}
        <div className="lg:col-span-8 space-y-5">
          {/* Query Box */}
          <div className="ui-card-tactile p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[var(--accent-500)]" />
                <h3 className="text-xs font-bold text-[var(--text-primary)]">Query {selectedAgent.name}</h3>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">
                Scope: {currentUser.scope.companyIds.join(', ').toUpperCase()}
              </span>
            </div>

            <form onSubmit={handleRunAgentAnalysis} className="space-y-3.5">
              <textarea
                rows={2}
                required
                placeholder={`Ask ${selectedAgent.name} for audit variances, risk detection, or optimization...`}
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="w-full px-4 py-3 input-tactile text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-[11px] text-[var(--text-muted)]">
                  Grounds findings only on data your role ({currentUser.role}) is permitted to view.
                </span>
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="btn-tactile-accent px-5 py-2.5 text-xs font-bold flex items-center justify-center gap-2 self-end sm:self-auto"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing ? 'Analyzing...' : 'Run Agent Analysis'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active AI Recommendations */}
          <div className="space-y-3.5">
            <h3 className="text-sm font-bold text-[var(--text-primary)] px-1">Active Recommendations</h3>

            <div className="space-y-3.5">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="ui-card-tactile p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[var(--accent-bg)] text-[var(--accent-text)] font-extrabold text-[10px] border border-[var(--accent-border)] uppercase">
                        AI RECOMMENDATION (NON-BINDING)
                      </span>
                      <span className="text-xs font-bold text-[var(--text-primary)]">{rec.agentName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--success-text)]">
                        {rec.confidenceRating}% Confidence
                      </span>
                      <StatusBadge status={rec.status} size="xs" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)] mb-1.5">{rec.findingHeadline}</h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-subtle)] p-3.5 rounded-2xl border border-[var(--border-subtle)]">
                      {rec.recommendationBody}
                    </p>
                  </div>

                  {/* Sources */}
                  <div className="p-3.5 bg-[var(--bg-subtle)] rounded-2xl space-y-1.5">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase flex items-center gap-1">
                      <Database className="w-3 h-3 text-[var(--primary-500)]" />
                      <span>Supporting Data Sources</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {rec.sourceRecords.map((src, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-base)] text-[var(--text-secondary)] text-[10px] font-mono shadow-xs"
                        >
                          {src.recordType}: {src.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Approval Controls */}
                  {rec.status === 'PENDING_HUMAN_REVIEW' && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-[var(--border-subtle)] text-xs">
                      <span className="text-[var(--text-muted)] italic">
                        Human verification required before action.
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRejectRecommendation(rec.id)}
                          className="btn-tactile-secondary px-3.5 py-2 text-xs font-medium"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleApproveRecommendation(rec)}
                          className="btn-tactile-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Approve & Authorize (MFA)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {rec.status === 'APPROVED_BY_USER' && (
                    <div className="text-xs text-[var(--success-text)] font-semibold flex items-center gap-1.5 pt-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Action Approved by {rec.reviewedBy} and recorded to Audit Log.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
