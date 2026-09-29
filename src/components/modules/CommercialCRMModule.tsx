import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Building,
  CheckCircle,
  FileCheck,
  Tag,
  DollarSign,
  TrendingUp,
  Clock,
  Phone,
  UserCheck,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  mockLeads,
  mockCustomers,
  mockApprovedClaims,
  mockUnitInventory
} from '../../db/mockData';
import { Lead, LeadStage, ApprovedMarketingClaim, UnitInventory } from '../../types';

export const CommercialCRMModule: React.FC = () => {
  const { currentUser, activeCompanyId } = useAuth();
  const { t, isRTL } = useLanguage();

  const [activeTab, setActiveTab] = useState<'PIPELINE' | 'CLAIMS_LIBRARY' | 'UNITS'>('PIPELINE');
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [units, setUnits] = useState<UnitInventory[]>(mockUnitInventory);

  // New Lead Modal & Duplicate Detection
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [budgetRange, setBudgetRange] = useState('PKR 50M - 80M');
  const [potentialValue, setPotentialValue] = useState(65000000);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const stages: { stage: LeadStage; label: string; count: number }[] = [
    { stage: 'NEW_ENQUIRY', label: 'New Enquiry', count: leads.filter((l) => l.stage === 'NEW_ENQUIRY').length },
    { stage: 'CONTACTED', label: 'Contacted', count: leads.filter((l) => l.stage === 'CONTACTED').length },
    { stage: 'QUALIFIED', label: 'Qualified', count: leads.filter((l) => l.stage === 'QUALIFIED').length },
    { stage: 'SITE_VISIT', label: 'Site Visit', count: leads.filter((l) => l.stage === 'SITE_VISIT').length },
    { stage: 'OFFER_MADE', label: 'Offer Out', count: leads.filter((l) => l.stage === 'OFFER_MADE').length },
    { stage: 'BOOKED', label: 'Closed / Booked', count: leads.filter((l) => l.stage === 'BOOKED').length }
  ];

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    const existing = mockCustomers.find((c) => c.phone.replace(/\s+/g, '') === val.replace(/\s+/g, ''));
    if (existing) {
      setDuplicateWarning(`Duplicate Alert: Customer "${existing.name}" already exists under ${existing.companyId.toUpperCase()}.`);
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      customerId: `cust-${Date.now()}`,
      customerName,
      phone,
      companyId: activeCompanyId === 'ALL' ? currentUser.companyId : activeCompanyId,
      projectName: activeCompanyId === 'pixel-park-stz' ? 'Pixel Park STZ' : 'GCH Commercial Tower',
      budgetRange,
      stage: 'QUALIFIED',
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      source: 'WALK_IN',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      lastActivityNote: 'Initial consultation and requirements captured.',
      potentialValue
    };

    setLeads((prev) => [newLead, ...prev]);
    setIsNewLeadOpen(false);
    setCustomerName('');
    setPhone('');
    setDuplicateWarning(null);
  };

  const filteredLeads = leads.filter((l) => {
    if (activeCompanyId !== 'ALL' && l.companyId !== activeCompanyId) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-6">
      {/* Top Header & Tabs */}
      <div className="ui-surface-elevated p-6 rounded-[24px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-5 h-5 text-[var(--primary-500)]" />
            <h1 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">Commercial Operations & CRM Pipeline</h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Multi-company sales attribution, duplicate detection, and approved marketing claims library.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-subtle)] rounded-2xl border border-[var(--border-base)] text-xs font-semibold">
            <button
              onClick={() => setActiveTab('PIPELINE')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                activeTab === 'PIPELINE' ? 'btn-tactile-primary text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Pipeline Kanban
            </button>
            <button
              onClick={() => setActiveTab('CLAIMS_LIBRARY')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                activeTab === 'CLAIMS_LIBRARY' ? 'btn-tactile-primary text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Approved Claims
            </button>
            <button
              onClick={() => setActiveTab('UNITS')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                activeTab === 'UNITS' ? 'btn-tactile-primary text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Units Inventory
            </button>
          </div>

          <button
            onClick={() => setIsNewLeadOpen(true)}
            className="btn-tactile-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Lead</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Pipeline Kanban */}
      {activeTab === 'PIPELINE' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {stages.map((stg) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === stg.stage);
            return (
              <div key={stg.stage} className="bg-[var(--bg-subtle)] rounded-[22px] p-3.5 border border-[var(--border-base)] flex flex-col">
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[var(--border-subtle)]">
                  <span className="text-xs font-bold text-[var(--text-primary)]">{stg.label}</span>
                  <span className="w-5 h-5 rounded-full bg-[var(--primary-bg)] text-[var(--primary-text)] font-bold text-[10px] flex items-center justify-center border border-[var(--primary-border)] shadow-xs">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {stageLeads.length === 0 ? (
                    <div className="p-5 text-center text-[var(--text-muted)] text-[11px] italic">No active deals</div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-3.5 ui-card-tactile space-y-2.5 shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--primary-bg)] text-[var(--primary-text)] border border-[var(--primary-border)]">
                            {lead.companyId.toUpperCase()}
                          </span>
                          <span className="text-[11px] font-bold text-[var(--success-text)]">
                            PKR {(lead.potentialValue / 1000000).toFixed(0)}M
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-[var(--text-primary)] leading-tight">{lead.customerName}</h4>
                        <p className="text-[11px] text-[var(--text-muted)]">{lead.projectName}</p>

                        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-secondary)]">
                          <span>Owner: {lead.ownerName.split(' ')[0]}</span>
                          {lead.agencyName && (
                            <span className="text-[var(--secondary-text)] font-medium truncate max-w-[80px]">
                              {lead.agencyName.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Approved Marketing Claims */}
      {activeTab === 'CLAIMS_LIBRARY' && (
        <div className="ui-card-tactile p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[var(--primary-500)]" />
                <span>Approved Marketing Claims Library</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Rule: All external advertising copy and agency campaigns must utilize vetted legal claims.
              </p>
            </div>
            <StatusBadge status="ACTIVE" size="xs" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockApprovedClaims.map((claim) => (
              <div key={claim.id} className="p-4.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-base)] space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[var(--primary-text)]">{claim.claimCode}</span>
                  <span className="text-[11px] text-[var(--text-muted)]">Approved: {claim.approvedDate}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[var(--text-primary)] bg-[var(--bg-subtle)] p-3 rounded-xl border border-[var(--border-subtle)]">
                    "{claim.claimText}"
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] font-urdu bg-[var(--bg-subtle)] p-3 rounded-xl border border-[var(--border-subtle)] text-right">
                    "{claim.claimTextUrdu}"
                  </p>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] pt-1 flex items-center justify-between">
                  <span>Authorized by: {claim.legalApprovedBy}</span>
                  <StatusBadge status={claim.status} size="xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Units Inventory */}
      {activeTab === 'UNITS' && (
        <div className="ui-card-tactile p-6 sm:p-7 space-y-5">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[var(--primary-500)]" />
            <span>Unit Inventory</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {units.map((u) => (
              <div key={u.id} className="p-4.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-base)] space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[var(--primary-text)]">{u.unitCode}</span>
                  <StatusBadge status={u.status} size="xs" />
                </div>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">{u.category} • {u.floor}</h4>
                <p className="text-xs text-[var(--text-muted)]">{u.projectName} ({u.areaSqFt} Sq.Ft)</p>
                <div className="pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Price:</span>
                  <span className="font-bold text-[var(--success-text)]">PKR {(u.basePrice / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Lead Modal */}
      {isNewLeadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
          <div className="ui-surface-elevated rounded-[24px] p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-4 border border-[var(--border-base)]">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)]">Create New Commercial Lead</h3>
              <button onClick={() => setIsNewLeadOpen(false)} className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)]">✕</button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Customer / Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Crescent Textiles Corp"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2.5 input-tactile text-xs text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Phone Number (With Duplicate Check)</label>
                <input
                  type="text"
                  required
                  placeholder="+92 300 1122334"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full px-3 py-2.5 input-tactile text-xs text-[var(--text-primary)]"
                />
              </div>

              {duplicateWarning && (
                <div className="p-3.5 bg-[var(--warning-bg)] border border-[var(--warning-border)] text-[var(--warning-text)] rounded-2xl text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-[var(--warning-dot)] shrink-0 mt-0.5" />
                  <span>{duplicateWarning}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Budget Range</label>
                  <input
                    type="text"
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full px-3 py-2.5 input-tactile text-xs text-[var(--text-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Est. Value (PKR)</label>
                  <input
                    type="number"
                    value={potentialValue}
                    onChange={(e) => setPotentialValue(Number(e.target.value))}
                    className="w-full px-3 py-2.5 input-tactile text-xs text-[var(--text-primary)] font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewLeadOpen(false)}
                  className="btn-tactile-secondary px-4 py-2.5 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-tactile-primary px-5 py-2.5 text-xs font-bold"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
