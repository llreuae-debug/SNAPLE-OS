import React, { useState, useEffect } from 'react';
import {
  Search,
  Users,
  Briefcase,
  HardHat,
  FileText,
  Settings,
  X,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import { mockEmployees, mockLeads, mockDrawings, mockSOPs } from '../../db/mockData';

interface SearchResultItem {
  id: string;
  category: 'People' | 'Leads' | 'Projects' | 'Documents' | 'DWR' | 'Settings';
  title: string;
  subtitle: string;
  tabId: string;
  icon: any;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build searchable index
  const allItems: SearchResultItem[] = [
    ...mockEmployees.map((e) => ({
      id: e.id,
      category: 'People' as const,
      title: e.name,
      subtitle: `${e.jobTitle} • ${e.companyId.toUpperCase()} (${e.departmentId})`,
      tabId: 'hr',
      icon: Users
    })),
    ...mockLeads.map((l) => ({
      id: l.id,
      category: 'Leads' as const,
      title: l.customerName,
      subtitle: `${l.projectName} • PKR ${(l.potentialValue / 1000000).toFixed(0)}M • ${l.stage}`,
      tabId: 'crm',
      icon: Briefcase
    })),
    ...mockDrawings.map((d) => ({
      id: d.id,
      category: 'Projects' as const,
      title: d.title,
      subtitle: `${d.drawingNo} • ${d.discipline} • ${d.status}`,
      tabId: 'projects',
      icon: HardHat
    })),
    ...mockSOPs.map((s) => ({
      id: s.id,
      category: 'Documents' as const,
      title: s.title,
      subtitle: `${s.sopNumber} • v${s.version}.0 • RACI Governance`,
      tabId: 'hr',
      icon: FileText
    })),
    {
      id: 'set-1',
      category: 'Settings' as const,
      title: 'Audit Logs & Append-Only History',
      subtitle: 'Inspect immutable actor changes and IP records',
      tabId: 'audit',
      icon: Settings
    },
    {
      id: 'dwr-1',
      category: 'DWR' as const,
      title: 'Daily Work Records & Rubric Evaluation',
      subtitle: 'Office 2-5m and Field <2m daily output submission',
      tabId: 'dwr',
      icon: ClipboardList
    }
  ];

  const filteredItems = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 6);

  const categories = Array.from(new Set(filteredItems.map((i) => i.category)));

  const handleSelect = (tabId: string) => {
    onNavigate(tabId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl ui-surface-elevated rounded-[24px] shadow-2xl border border-[var(--border-base)] overflow-hidden">
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border-base)]">
          <Search className="w-5 h-5 text-[var(--text-muted)] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search records, people, leads, projects, drawings, SOPs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
          <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
            ESC
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-muted)] text-xs">
              No matching records found for "{query}".
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat} className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {cat}
                </div>
                {filteredItems
                  .filter((i) => i.category === cat)
                  .map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.tabId)}
                        className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-[var(--bg-hover)] text-left transition group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] shrink-0 group-hover:text-[var(--primary-text)] group-hover:border-[var(--primary-border)] transition">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-[var(--text-muted)] truncate">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                      </button>
                    );
                  })}
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-3 bg-[var(--bg-subtle)] border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span>Navigate:</span>
            <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-base)] text-[10px] font-mono">↑</kbd>
            <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-base)] text-[10px] font-mono">↓</kbd>
            <span>Select:</span>
            <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-base)] text-[10px] font-mono">↵</kbd>
          </div>
          <span className="font-semibold text-[var(--text-secondary)]">SNAPLE Command Index</span>
        </div>
      </div>
    </div>
  );
};
