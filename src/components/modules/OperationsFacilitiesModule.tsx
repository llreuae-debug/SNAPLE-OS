import React, { useState } from 'react';
import {
  Building2,
  QrCode
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  mockWorkOrders,
  mockPatrolLogs,
  mockGatePasses
} from '../../db/mockData';
import { FacilityWorkOrder, SecurityPatrolLog, GatePass } from '../../types';

export const OperationsFacilitiesModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'WORK_ORDERS' | 'PATROL' | 'GATE_PASS'>('WORK_ORDERS');
  const [workOrders] = useState<FacilityWorkOrder[]>(mockWorkOrders);
  const [patrolLogs] = useState<SecurityPatrolLog[]>(mockPatrolLogs);
  const [gatePasses] = useState<GatePass[]>(mockGatePasses);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--border-base)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-[#6366F1]" />
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Facilities, Security Operations & Gate Passes</h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Work orders, QR security patrol verification checkpoints, and material gate passes.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-base)] text-xs">
          <button
            onClick={() => setActiveTab('WORK_ORDERS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'WORK_ORDERS' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Work Orders
          </button>
          <button
            onClick={() => setActiveTab('PATROL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'PATROL' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Security QR Patrols
          </button>
          <button
            onClick={() => setActiveTab('GATE_PASS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'GATE_PASS' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Gate Passes ({gatePasses.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Work Orders */}
      {activeTab === 'WORK_ORDERS' && (
        <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Facility Work Orders & Maintenance (PPM)</h3>
          <div className="space-y-3">
            {workOrders.map((wo) => (
              <div key={wo.id} className="p-4 rounded-xl ui-surface border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)]">{wo.title}</span>
                  <StatusBadge status={wo.status} size="xs" />
                </div>
                <div className="flex items-center justify-between text-[var(--text-muted)] pt-1 border-t border-[var(--border-subtle)]">
                  <span>Location: {wo.siteName} ({wo.location})</span>
                  <span>Assigned: <strong className="text-[var(--text-primary)]">{wo.assignedTo}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Security QR Patrol Logs */}
      {activeTab === 'PATROL' && (
        <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#06B6D4]" />
            <span>Security Guard QR Checkpoint Patrol Trail</span>
          </h3>
          <div className="space-y-3">
            {patrolLogs.map((p) => (
              <div key={p.id} className="p-4 rounded-xl ui-surface border space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)]">{p.checkpointName}</span>
                  <StatusBadge status={p.status} size="xs" />
                </div>
                <div className="flex items-center justify-between text-[var(--text-muted)]">
                  <span>Site: {p.siteName}</span>
                  <span className="font-mono text-[#06B6D4] font-semibold">{p.qrCodeScanTime}</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">Officer: {p.guardName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Gate Passes */}
      {activeTab === 'GATE_PASS' && (
        <div className="ui-surface rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Active Material & Visitor Gate Passes</h3>
          <div className="space-y-3">
            {gatePasses.map((gp) => (
              <div key={gp.id} className="p-4 rounded-xl ui-surface border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#6366F1]">{gp.passNumber}</span>
                  <StatusBadge status={gp.status} size="xs" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[var(--bg-subtle)] p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Type</span>
                    <p className="font-bold text-[var(--text-primary)]">{gp.type}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Bearer</span>
                    <p className="text-[var(--text-secondary)]">{gp.bearerName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Vehicle</span>
                    <p className="font-mono text-[var(--text-secondary)]">{gp.vehicleNo || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Valid Until</span>
                    <p className="text-[#F59E0B] font-medium">{gp.validUntil}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
