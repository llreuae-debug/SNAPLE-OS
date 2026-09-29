import React, { useState } from 'react';
import {
  Building2,
  QrCode,
  ShieldCheck,
  Truck,
  Wrench
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
    <div className="space-y-6 animate-fadeIn pb-6">
      {/* Top Header */}
      <div className="ui-surface-elevated p-6 rounded-[24px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-[var(--primary-500)]" />
            <h1 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">Facilities, Security Operations & Gate Passes</h1>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Work orders, QR security patrol verification checkpoints, and material gate passes.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-subtle)] rounded-2xl border border-[var(--border-base)] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('WORK_ORDERS')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'WORK_ORDERS' ? 'btn-tactile-primary text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Work Orders
          </button>
          <button
            onClick={() => setActiveTab('PATROL')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'PATROL' ? 'btn-tactile-primary text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Security QR Patrols
          </button>
          <button
            onClick={() => setActiveTab('GATE_PASS')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              activeTab === 'GATE_PASS' ? 'btn-tactile-primary text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Gate Passes ({gatePasses.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Work Orders */}
      {activeTab === 'WORK_ORDERS' && (
        <div className="ui-card-tactile p-6 sm:p-7 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Facility Work Orders & Maintenance (PPM)</h3>
          <div className="space-y-3.5">
            {workOrders.map((wo) => (
              <div key={wo.id} className="p-4.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-base)] space-y-2.5 text-xs shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)]">{wo.title}</span>
                  <StatusBadge status={wo.status} size="xs" />
                </div>
                <div className="flex items-center justify-between text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
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
        <div className="ui-card-tactile p-6 sm:p-7 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[var(--secondary-500)]" />
            <span>Security Guard QR Checkpoint Patrol Trail</span>
          </h3>
          <div className="space-y-3.5">
            {patrolLogs.map((p) => (
              <div key={p.id} className="p-4.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-base)] space-y-2 text-xs shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)]">{p.checkpointName}</span>
                  <StatusBadge status={p.status} size="xs" />
                </div>
                <div className="flex items-center justify-between text-[var(--text-muted)]">
                  <span>Guard: {p.guardName}</span>
                  <span className="font-mono text-[var(--primary-text)] font-semibold">{p.scannedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Gate Passes */}
      {activeTab === 'GATE_PASS' && (
        <div className="ui-card-tactile p-6 sm:p-7 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Truck className="w-4 h-4 text-[var(--primary-500)]" />
            <span>Material & Equipment Gate Passes</span>
          </h3>
          <div className="space-y-3.5">
            {gatePasses.map((gp) => (
              <div key={gp.id} className="p-4.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-base)] space-y-3 text-xs shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[var(--primary-text)]">{gp.passNumber}</span>
                  <StatusBadge status={gp.status} size="xs" />
                </div>
                <p className="font-semibold text-[var(--text-primary)]">{gp.materialsSummary}</p>
                <div className="flex items-center justify-between text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
                  <span>Vehicle: {gp.vehicleNumber} ({gp.driverName})</span>
                  <span>Auth by: <strong className="text-[var(--text-primary)]">{gp.authorizedBy}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
