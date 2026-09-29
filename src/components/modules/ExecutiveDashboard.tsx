import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  FileCheck2,
  Users2,
  Building,
  DollarSign,
  Download,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  ArrowUpRight,
  Filter,
  Layers,
  Calendar,
  ChevronRight,
  Clock,
  Briefcase,
  CheckSquare,
  ArrowRight
} from 'lucide-react';
import { KPICard } from '../common/KPICard';
import { StatusBadge } from '../common/StatusBadge';
import { AreaTrendChart, BarComparisonChart, DonutMetric } from '../common/ChartComponents';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { mockCompanies, mockAIRunRecommendations } from '../../db/mockData';

interface ExceptionRuleItem {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'NORMAL';
  title: string;
  titleUrdu: string;
  entity: string;
  ruleExplanation: string;
  actionRequired: string;
  timestamp: string;
}

export const ExecutiveDashboard: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { currentUser, activeCompanyId, currentCompany, requestStepUpMFA } = useAuth();
  const { t, isRTL } = useLanguage();
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'WARNING'>('ALL');
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'Today' | '7D' | '30D'>('Today');

  const exceptionRules: ExceptionRuleItem[] = [
    {
      id: 'exc-01',
      severity: 'CRITICAL',
      title: 'Contractor IPC #06 Claim contains Unverified Measurements',
      titleUrdu: 'ٹھیکیدار کے بل #06 میں غیر تصدیق شدہ پیمائشیں شامل ہیں',
      entity: 'DAGMAR / GCH — Al-Madina Construction',
      ruleExplanation: 'Rule GCH-ENG-SEC4: "No contractor IPC bill can be certified or submitted to finance without verified Measurement Book (MB) sign-off by Lead QS."',
      actionRequired: 'Deduct PKR 450,000 from current bill or reject pending physical inspection.',
      timestamp: 'Today, 09:40 AM'
    },
    {
      id: 'exc-02',
      severity: 'WARNING',
      title: 'Prime Estate Agency SLA Response Breach (4.2 hrs vs 2.0 hrs target)',
      titleUrdu: 'پرائم اسٹیٹ ایجنسی نے ایس ایل اے کی خلاف ورزی کی (۴.۲ گھنٹے بمقابلہ ۲.۰ گھنٹے ہدف)',
      entity: 'DAGMAR / GCH — Retail Sales',
      ruleExplanation: 'Rule MKT-SLA-02: "Lead follow-up by agency staff must occur within 2.0 hours of digital enquiry registration."',
      actionRequired: 'Escalate to Agency Lead Mian Usman & auto-reassign stalled leads.',
      timestamp: 'Today, 08:15 AM'
    },
    {
      id: 'exc-03',
      severity: 'CRITICAL',
      title: 'Concrete Pour Beam B-12 NCR Opened (Insufficient Rebar Cover)',
      titleUrdu: 'بیم B-12 کنکریٹ پور میں این سی آر جاری (کم سریا کور)',
      entity: 'DAGMAR / GCH — 4th Floor',
      ruleExplanation: 'Rule QC-CIVIL-201: "Concrete cover below 25mm violates structural code; pour clearance blocked until spacer blocks placed."',
      actionRequired: 'Verified spacer blocks installed before 02:00 PM pour clearance.',
      timestamp: 'Yesterday, 04:30 PM'
    }
  ];

  const pendingApprovals = [
    { id: 'app-1', title: 'Contractor IPC #06 Certification', amount: 'PKR 4.2M', dept: 'Engineering / QS', urgency: 'High', tab: 'projects' },
    { id: 'app-2', title: 'Agency Commission Release #14', amount: 'PKR 850,000', dept: 'Commercial', urgency: 'Medium', tab: 'agencies' },
    { id: 'app-3', title: 'Cement Procurement Order PO-982', amount: 'PKR 1.2M', dept: 'Procurement', urgency: 'High', tab: 'finance' }
  ];

  // Chart datasets
  const dwrTrendData = [
    { label: 'Sep 24', value: 89, secondaryValue: 90 },
    { label: 'Sep 25', value: 91, secondaryValue: 90 },
    { label: 'Sep 26', value: 93, secondaryValue: 90 },
    { label: 'Sep 27', value: 90, secondaryValue: 90 },
    { label: 'Sep 28', value: 96, secondaryValue: 90 },
    { label: 'Sep 29', value: 94.2, secondaryValue: 90 }
  ];

  const financialComparisonData = [
    { label: 'DAGMAR', series1: 15.0, series2: 6.87 },
    { label: 'Pixel Park', series1: 5.5, series2: 1.45 },
    { label: 'Novelty', series1: 8.2, series2: 3.1 }
  ];

  const filteredExceptions = exceptionRules.filter((ex) => {
    if (filterSeverity === 'ALL') return true;
    return ex.severity === filterSeverity;
  });

  const handleSensitiveExport = (format: 'PDF' | 'EXCEL') => {
    requestStepUpMFA(
      `Export Consolidated ${format} Executive Management Pack`,
      'This board-level report contains unredacted financial summaries, shareholder valuations, and contractor liability disclosures.',
      () => {
        setExportMessage(`Successfully generated and downloaded encrypted ${format} Management Pack (ID: REP-${Date.now()})`);
        setTimeout(() => setExportMessage(null), 5000);
      }
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-6">
      {/* 1. Header with Executive Greeting & Context Controls */}
      <div className="ui-surface-elevated p-6 rounded-[24px] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--success-dot)] ring-4 ring-[var(--success-bg)]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {activeCompanyId === 'ALL' ? 'Group Live Governance' : `${currentCompany?.name} Scope`}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Good Morning, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Group management operating overview across daily measurable output, commercial pipeline & project governance.
          </p>
        </div>

        {/* Action Controls & Range Picker */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time Range Pills */}
          <div className="flex items-center p-1 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-semibold">
            {(['Today', '7D', '30D'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-xl transition ${
                  timeRange === range
                    ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-xs font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleSensitiveExport('PDF')}
            className="btn-tactile-secondary px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[var(--primary-500)]" />
            <span>{t('security.export_pdf')}</span>
          </button>
          <button
            onClick={() => handleSensitiveExport('EXCEL')}
            className="btn-tactile-secondary px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[var(--success-dot)]" />
            <span>{t('security.export_excel')}</span>
          </button>
          <button
            onClick={() => onNavigate('ai')}
            className="btn-tactile-accent px-4 py-2 text-xs font-bold flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask SNAPLE AI</span>
          </button>
        </div>
      </div>

      {exportMessage && (
        <div className="p-4 bg-[var(--success-bg)] border border-[var(--success-border)] text-[var(--success-text)] rounded-2xl text-xs font-semibold flex items-center justify-between animate-fadeIn shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--success-dot)]" />
            <span>{exportMessage}</span>
          </div>
          <button onClick={() => setExportMessage(null)} className="font-bold hover:opacity-75">✕</button>
        </div>
      )}

      {/* 2. Visual Hierarchy #1: Tactile Varied KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Consolidated Revenue"
          value="PKR 42.8M"
          change="↗ 12.4% vs previous"
          isPositive={true}
          target="PKR 40M"
          icon={DollarSign}
          surfaceVariant="sage"
          onClick={() => onNavigate('finance')}
        />
        <KPICard
          title="Daily Output (DWR) Compliance"
          value="94.2%"
          change="↗ 3.4% this week"
          isPositive={true}
          target="≥90%"
          icon={FileCheck2}
          surfaceVariant="blue-grey"
          onClick={() => onNavigate('dwr')}
        />
        <KPICard
          title="Active Commercial Deals"
          value="PKR 272M"
          change="3 Deals in Offer"
          isPositive={true}
          target="PKR 250M"
          icon={Briefcase}
          surfaceVariant="lavender"
          onClick={() => onNavigate('crm')}
        />
        <KPICard
          title="Construction Earned Value"
          value="0.98 SPI"
          subtitle="4th Floor Slab Poured"
          target="1.00 SPI"
          icon={Building}
          surfaceVariant="warm"
          onClick={() => onNavigate('projects')}
        />
      </div>

      {/* 3. Visual Hierarchy #2 & #3: Business Performance Curve & Sales Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* DWR 6-Day Trend Area Chart */}
        <div className="lg:col-span-8 ui-card-tactile p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Daily Work Output (DWR) 6-Day Compliance Curve
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Target benchmark: 90% measurable daily output across all 130 internal staff
              </p>
            </div>
            <span className="text-xs font-bold text-[var(--success-text)] bg-[var(--success-bg)] px-3 py-1 rounded-full border border-[var(--success-border)] shadow-xs">
              Current: 94.2%
            </span>
          </div>

          <AreaTrendChart
            data={dwrTrendData}
            height={170}
            valueSuffix="%"
            color="#7D9B91"
            secondaryColor="#8299A2"
          />
        </div>

        {/* Commercial Pipeline Breakdown */}
        <div className="lg:col-span-4 ui-card-tactile p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Commercial Pipeline Health</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Qualified deals conversion rate</p>
          </div>

          <div className="py-2 flex justify-center">
            <DonutMetric
              percentage={76}
              label="Qualified Target"
              sublabel="PKR 272M Active Volume"
              color="#7D9B91"
            />
          </div>

          <div className="space-y-2 pt-3 border-t border-[var(--border-subtle)] text-xs">
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>Offer Stage:</span>
              <strong className="text-[var(--text-primary)] font-semibold">PKR 135M</strong>
            </div>
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>Site Visit Scheduled:</span>
              <strong className="text-[var(--text-primary)] font-semibold">PKR 82M</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Visual Hierarchy #4 & #5: Multi-Company Portfolio & Financial Cash Movement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Multi-Company Portfolio Cards */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Building className="w-4 h-4 text-[var(--primary-500)]" />
              <span>Multi-Company Portfolio</span>
            </h3>
            <span className="text-xs text-[var(--text-muted)] font-medium">3 Group Entities</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {mockCompanies.map((c) => (
              <div
                key={c.id}
                className="ui-card-tactile p-4.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                      {c.code}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[var(--success-dot)]" />
                  </div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">{c.name}</h4>
                  <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 mt-1">{c.tagline}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-[var(--border-subtle)] grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)]">Staff</span>
                    <p className="font-bold text-[var(--text-primary)]">{c.activeStaffCount}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)]">Sites</span>
                    <p className="font-bold text-[var(--text-primary)]">{c.sitesCount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Cash Movement */}
        <div className="lg:col-span-5 ui-card-tactile p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Monthly Cash Movement</h3>
              <p className="text-xs text-[var(--text-muted)]">Receipts vs Expenses (PKR Millions)</p>
            </div>
          </div>

          <BarComparisonChart
            data={financialComparisonData}
            height={145}
            series1Name="Receipts"
            series2Name="Expenses"
          />
        </div>
      </div>

      {/* 5. Visual Hierarchy #6 & #7: Critical Exceptions & Pending Approvals Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Exception Sentinel Engine */}
        <div className="lg:col-span-7 ui-card-tactile p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-[var(--danger-dot)]" />
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Exception Sentinel & Policy Rule Monitor
                </h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Identifies compliance variances with exact underlying governance rules.
              </p>
            </div>

            {/* Severity Filter Pills */}
            <div className="flex items-center gap-1 p-1 bg-[var(--bg-subtle)] rounded-2xl border border-[var(--border-base)] text-xs">
              <button
                onClick={() => setFilterSeverity('ALL')}
                className={`px-3 py-1 rounded-xl font-semibold transition ${
                  filterSeverity === 'ALL'
                    ? 'btn-tactile-primary text-white shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                All ({exceptionRules.length})
              </button>
              <button
                onClick={() => setFilterSeverity('CRITICAL')}
                className={`px-3 py-1 rounded-xl font-semibold transition ${
                  filterSeverity === 'CRITICAL'
                    ? 'bg-[var(--danger-bg)] text-[var(--danger-text)] border border-[var(--danger-border)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Critical (2)
              </button>
              <button
                onClick={() => setFilterSeverity('WARNING')}
                className={`px-3 py-1 rounded-xl font-semibold transition ${
                  filterSeverity === 'WARNING'
                    ? 'bg-[var(--warning-bg)] text-[var(--warning-text)] border border-[var(--warning-border)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Warnings (1)
              </button>
            </div>
          </div>

          {/* Exceptions List */}
          <div className="space-y-3">
            {filteredExceptions.map((ex) => (
              <div
                key={ex.id}
                className={`p-4 rounded-2xl border transition shadow-xs ${
                  ex.severity === 'CRITICAL'
                    ? 'bg-[var(--danger-bg)] border-[var(--danger-border)]'
                    : 'bg-[var(--warning-bg)] border-[var(--warning-border)]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={ex.severity} size="xs" />
                    <span className="text-xs font-bold text-[var(--text-primary)]">{ex.entity}</span>
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)]">{ex.timestamp}</span>
                </div>

                <h4 className="text-xs font-bold text-[var(--text-primary)]">{isRTL ? ex.titleUrdu : ex.title}</h4>

                <div className="mt-2 p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs space-y-1">
                  <p className="text-[var(--primary-text)] font-mono text-[11px]">{ex.ruleExplanation}</p>
                  <div className="text-[var(--text-secondary)] flex items-start gap-1">
                    <strong className="text-[var(--warning-text)] shrink-0">Remediation:</strong>
                    <span>{ex.actionRequired}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals Queue */}
        <div className="lg:col-span-5 ui-card-tactile p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[var(--primary-500)]" />
                <span>Pending Approvals</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--warning-bg)] text-[var(--warning-text)] border border-[var(--warning-border)]">
                3 Pending
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">Awaiting executive or supervisory sign-off</p>
          </div>

          <div className="space-y-2.5">
            {pendingApprovals.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate(item.tab)}
                className="p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] cursor-pointer transition flex items-center justify-between group"
              >
                <div className="space-y-0.5 min-w-0 pr-2">
                  <p className="text-xs font-bold text-[var(--text-primary)] truncate">{item.title}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">{item.dept} • <strong className="text-[var(--text-secondary)]">{item.amount}</strong></p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-base)] text-[var(--text-secondary)]">
                    {item.urgency}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* AI Recommendation Banner */}
          <div className="p-4 rounded-2xl bg-[var(--accent-bg)] border border-[var(--accent-border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-text)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Recommendation
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">Verified Context</span>
            </div>
            <p className="text-xs font-medium text-[var(--text-primary)]">
              "Hold IPC #06 certification until physical re-measurement is signed off. Releasing without MB creates audit liability."
            </p>
            <button
              onClick={() => onNavigate('ai')}
              className="text-[11px] font-bold text-[var(--accent-text)] hover:underline flex items-center gap-1"
            >
              <span>Explore AI analysis</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
