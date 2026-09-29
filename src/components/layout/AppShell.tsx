import React, { useState } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  MapPin,
  Users,
  Briefcase,
  HardHat,
  Receipt,
  Share2,
  Building2,
  Sparkles,
  ShieldAlert,
  Globe,
  Wifi,
  WifiOff,
  RefreshCw,
  UserCheck,
  ChevronDown,
  Layers,
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Monitor,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  Command,
  SlidersHorizontal,
  ChevronRight,
  Palette
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSync } from '../../context/SyncContext';
import { useTheme } from '../../context/ThemeContext';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { NotificationsFlyout } from '../common/NotificationsFlyout';
import { StepUpModal } from '../common/StepUpModal';
import { CompanyId } from '../../types';

interface AppShellProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ currentTab, onTabChange, children }) => {
  const {
    currentUser,
    activeCompanyId,
    setActiveCompanyId,
    availableCompanies,
    switchUser,
    usersList,
    isAgencyIsolated
  } = useAuth();
  const { language, setLanguage, isRTL, t } = useLanguage();
  const { isOnline, isSyncing, pendingQueue, triggerManualSync } = useSync();
  const { theme, resolvedTheme, setTheme } = useTheme();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Agency users see ONLY their Agency Portal and minimal DWR
  const navItems = isAgencyIsolated()
    ? [
        { id: 'agencies', label: t('nav.agencies'), icon: Share2 },
        { id: 'dwr', label: t('nav.dwr'), icon: ClipboardList }
      ]
    : [
        { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
        { id: 'dwr', label: t('nav.dwr'), icon: ClipboardList, badge: '2-5m' },
        { id: 'attendance', label: t('nav.attendance'), icon: MapPin },
        { id: 'hr', label: t('nav.hr'), icon: Users },
        { id: 'crm', label: t('nav.crm'), icon: Briefcase },
        { id: 'projects', label: t('nav.projects'), icon: HardHat, badge: 'MB' },
        { id: 'finance', label: t('nav.finance'), icon: Receipt },
        { id: 'agencies', label: t('nav.agencies'), icon: Share2 },
        { id: 'facilities', label: t('nav.facilities'), icon: Building2 },
        { id: 'ai', label: t('nav.ai'), icon: Sparkles, highlight: true },
        { id: 'audit', label: t('nav.audit'), icon: ShieldAlert },
        { id: 'design-system', label: '3D UI Kit', icon: Palette, badge: 'Design System' }
      ];

  const handleCompanySelect = (cid: CompanyId | 'ALL') => {
    setActiveCompanyId(cid);
    setIsCompanyDropdownOpen(false);
  };

  const handleUserSelect = (uid: string) => {
    switchUser(uid);
    setIsUserDropdownOpen(false);
  };

  const getActiveCompanyDisplay = () => {
    if (activeCompanyId === 'ALL') return t('company.all');
    const comp = availableCompanies.find((c) => c.id === activeCompanyId);
    return comp ? comp.name : t('company.all');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col antialiased selection:bg-[var(--primary-500)] selection:text-white">
      {/* 1. FLOATING TOP NAVIGATION BAR */}
      <div className="sticky top-0 z-40 px-3 sm:px-6 pt-3 pb-2">
        <header className="floating-top-bar px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3">
          {/* Left: Brand Logo & Tactile Scope Dropdown */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Logo Badge */}
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none group"
              onClick={() => onTabChange('dashboard')}
            >
              <div className="w-9 h-9 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-base)] flex items-center justify-center p-1 shadow-sm group-hover:scale-105 transition shrink-0">
                <img src="/sgc-logo.png" alt="SGC Logo" className="w-full h-full object-contain" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold tracking-tight text-sm text-[var(--text-primary)]">
                    SNAPLE-OS
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-[var(--primary-bg)] text-[var(--primary-text)] border border-[var(--primary-border)]">
                    Group OS
                  </span>
                </div>
              </div>
            </div>

            {/* Tactile Company Scope Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsCompanyDropdownOpen(!isCompanyDropdownOpen);
                  setIsUserDropdownOpen(false);
                  setIsThemeDropdownOpen(false);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-base)] hover:border-[var(--border-strong)] text-xs font-medium text-[var(--text-primary)] shadow-sm transition"
              >
                <Layers className="w-3.5 h-3.5 text-[var(--primary-500)]" />
                <span className="max-w-[120px] sm:max-w-[180px] truncate">{getActiveCompanyDisplay()}</span>
                <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
              </button>

              {isCompanyDropdownOpen && (
                <div className="absolute top-full mt-2 w-64 ui-surface-elevated rounded-2xl shadow-xl p-1.5 z-50 text-xs space-y-1 animate-fadeIn border border-[var(--border-base)]">
                  <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                    {t('app.switch_company')}
                  </div>
                  {currentUser.scope.isGroupWide && (
                    <button
                      onClick={() => handleCompanySelect('ALL')}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition ${
                        activeCompanyId === 'ALL'
                          ? 'bg-[var(--primary-500)] text-white font-semibold shadow-sm'
                          : 'hover:bg-[var(--bg-hover)] text-[var(--text-primary)]'
                      }`}
                    >
                      <span>{t('company.all')}</span>
                      {activeCompanyId === 'ALL' && <span className="text-xs">✓</span>}
                    </button>
                  )}
                  {availableCompanies.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCompanySelect(c.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition ${
                        activeCompanyId === c.id
                          ? 'bg-[var(--primary-500)] text-white font-semibold shadow-sm'
                          : 'hover:bg-[var(--bg-hover)] text-[var(--text-primary)]'
                      }`}
                    >
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-[10px] opacity-75 truncate">{c.code}</p>
                      </div>
                      {activeCompanyId === c.id && <span className="text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center: Command Search Pill */}
          <div className="flex-1 max-w-sm hidden md:block">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-base)] hover:border-[var(--border-strong)] text-xs text-[var(--text-muted)] shadow-sm transition"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span className="truncate">Search records, staff, projects...</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-base)] text-[10px] font-mono text-[var(--text-muted)]">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Tactile Quick Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mobile Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-base)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Offline / Sync Indicator */}
            <button
              onClick={triggerManualSync}
              title={isOnline ? t('app.online') : t('app.offline')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold shadow-sm transition ${
                !isOnline
                  ? 'bg-[var(--danger-bg)] text-[var(--danger-text)] border-[var(--danger-border)] animate-pulse'
                  : pendingQueue.length > 0
                  ? 'bg-[var(--warning-bg)] text-[var(--warning-text)] border-[var(--warning-border)]'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-base)]'
              }`}
            >
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-[var(--success-dot)]" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-[var(--danger-dot)]" />
              )}
              <span className="hidden xl:inline">
                {isSyncing
                  ? t('app.syncing')
                  : pendingQueue.length > 0
                  ? `${pendingQueue.length} ${t('app.pending_sync')}`
                  : t('app.synced')}
              </span>
              {pendingQueue.length > 0 && (
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-[var(--warning-dot)]' : ''}`} />
              )}
            </button>

            {/* Notification Bell with Flyout */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsCompanyDropdownOpen(false);
                  setIsUserDropdownOpen(false);
                  setIsThemeDropdownOpen(false);
                }}
                className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-base)] hover:border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-sm transition relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--danger-dot)] ring-2 ring-[var(--bg-surface)]" />
              </button>

              <NotificationsFlyout
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                onNavigate={(tab) => onTabChange(tab)}
              />
            </div>

            {/* Theme Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsThemeDropdownOpen(!isThemeDropdownOpen);
                  setIsCompanyDropdownOpen(false);
                  setIsUserDropdownOpen(false);
                  setIsNotificationsOpen(false);
                }}
                className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-base)] hover:border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-sm transition"
                title="Switch Theme"
              >
                {resolvedTheme === 'dark' ? (
                  <Moon className="w-4 h-4 text-[var(--accent-500)]" />
                ) : (
                  <Sun className="w-4 h-4 text-[var(--warning-dot)]" />
                )}
              </button>

              {isThemeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 ui-surface-elevated rounded-2xl shadow-xl p-1.5 z-50 text-xs space-y-0.5 border border-[var(--border-base)] animate-fadeIn">
                  <button
                    onClick={() => {
                      setTheme('light');
                      setIsThemeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition ${
                      theme === 'light'
                        ? 'bg-[var(--primary-500)] text-white font-semibold'
                        : 'hover:bg-[var(--bg-hover)] text-[var(--text-primary)]'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-[var(--warning-dot)]" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => {
                      setTheme('dark');
                      setIsThemeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition ${
                      theme === 'dark'
                        ? 'bg-[var(--primary-500)] text-white font-semibold'
                        : 'hover:bg-[var(--bg-hover)] text-[var(--text-primary)]'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-[var(--accent-500)]" />
                    <span>Dark</span>
                  </button>
                  <button
                    onClick={() => {
                      setTheme('system');
                      setIsThemeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition ${
                      theme === 'system'
                        ? 'bg-[var(--primary-500)] text-white font-semibold'
                        : 'hover:bg-[var(--bg-hover)] text-[var(--text-primary)]'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span>System</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bilingual Urdu Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-base)] hover:border-[var(--border-strong)] text-xs font-semibold text-[var(--text-primary)] shadow-sm transition"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-[var(--secondary-500)]" />
              <span>{language === 'en' ? 'اردو' : 'EN'}</span>
            </button>

            {/* Design System & 3D UI Kit Quick Button */}
            <button
              onClick={() => onTabChange('design-system')}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold shadow-sm transition ${
                currentTab === 'design-system'
                  ? 'bg-[var(--accent-500)] text-white border-[var(--accent-600)]'
                  : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-base)] hover:border-[var(--border-strong)]'
              }`}
              title="Interactive 3D UI Kit & Design System"
            >
              <Palette className="w-3.5 h-3.5 text-[var(--accent-500)]" />
              <span className="hidden xl:inline">3D UI Kit</span>
            </button>

            {/* User Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsUserDropdownOpen(!isUserDropdownOpen);
                  setIsCompanyDropdownOpen(false);
                  setIsThemeDropdownOpen(false);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-2 p-1 sm:pl-1.5 sm:pr-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-base)] hover:border-[var(--border-strong)] text-xs shadow-sm transition"
              >
                <div className="w-7 h-7 rounded-xl bg-[var(--primary-bg)] text-[var(--primary-text)] border border-[var(--primary-border)] flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="font-semibold text-xs leading-none text-[var(--text-primary)]">
                    {currentUser.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] font-medium leading-tight">
                    {currentUser.role}
                  </p>
                </div>
                <ChevronDown className="w-3 h-3 text-[var(--text-muted)] hidden sm:block" />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 ui-surface-elevated rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1 border border-[var(--border-base)] animate-fadeIn">
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                    {t('app.switch_role')}
                  </div>
                  {usersList.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleUserSelect(u.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition ${
                        currentUser.id === u.id
                          ? 'bg-[var(--primary-500)] text-white font-semibold shadow-sm'
                          : 'hover:bg-[var(--bg-hover)] text-[var(--text-primary)]'
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{u.name}</p>
                        <p className="text-[10px] opacity-80">{u.designation} • {u.role}</p>
                      </div>
                      {currentUser.id === u.id && <UserCheck className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>
      </div>

      {/* 2. MAIN LAYOUT (Tactile Sidebar + Content Workspace) */}
      <div className="flex-1 flex overflow-hidden px-3 sm:px-6 pb-4">
        {/* Tactile Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col ui-surface p-3 shrink-0 transition-all duration-200 select-none mr-4 ${
            isRTL ? 'ml-4 mr-0' : ''
          } ${isSidebarCollapsed ? 'w-18' : 'w-64'}`}
        >
          {/* Collapse Header */}
          <div className="flex items-center justify-between mb-3 px-1">
            {!isSidebarCollapsed && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Workspaces
              </span>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] mx-auto transition"
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 flex-1 overflow-y-auto pr-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  title={isSidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition ${
                    isActive
                      ? 'btn-tactile-primary shadow-sm'
                      : item.highlight
                      ? 'bg-[var(--accent-bg)] text-[var(--accent-text)] border border-[var(--accent-border)] hover:brightness-105'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : ''}`} />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  {!isSidebarCollapsed && item.badge && !isActive && (
                    <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                      {item.badge}
                    </span>
                  )}
                  {!isSidebarCollapsed && item.highlight && !isActive && (
                    <span className="ml-auto text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-[var(--accent-bg)] text-[var(--accent-text)] border border-[var(--accent-border)]">
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Scope Context Info */}
          {!isSidebarCollapsed && (
            <div className="mt-auto pt-3 border-t border-[var(--border-subtle)]">
              <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[11px] space-y-1">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[var(--text-muted)]">
                  <span>Scope Level</span>
                  <span className="text-[var(--primary-text)] font-mono">{currentUser.scope.maxConfidentiality}</span>
                </div>
                <p className="font-semibold text-[var(--text-primary)] truncate">{currentUser.designation}</p>
                <p className="text-[10px] text-[var(--text-muted)] truncate">
                  {currentUser.scope.isGroupWide ? 'Group Consolidated' : 'Company Bound'}
                </p>
              </div>
            </div>
          )}
        </aside>

        {/* Mobile Fullscreen Slide-out Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden flex flex-col animate-fadeIn">
            <div className="p-4 ui-surface border-b flex items-center justify-between rounded-none">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-base)] flex items-center justify-center p-1 shadow-sm overflow-hidden shrink-0">
                  <img src="/sgc-logo.png" alt="SGC Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-bold text-sm text-[var(--text-primary)]">SNAPLE-OS</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-2 overflow-y-auto flex-1 bg-[var(--bg-base)]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                      isActive
                        ? 'btn-tactile-primary text-white shadow'
                        : 'ui-surface hover:bg-[var(--bg-hover)] text-[var(--text-primary)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Viewport Workspace */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6 rounded-2xl">
          {children}
        </main>
      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION (Field speed <2m workflow) */}
      <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-30 floating-top-bar px-3 py-2 flex items-center justify-around">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition ${
            currentTab === 'dashboard' ? 'text-[var(--primary-text)] font-bold' : 'text-[var(--text-muted)]'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => onTabChange('dwr')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition ${
            currentTab === 'dwr' ? 'text-[var(--primary-text)] font-bold' : 'text-[var(--text-muted)]'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>DWR</span>
        </button>
        <button
          onClick={() => onTabChange('attendance')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition ${
            currentTab === 'attendance' ? 'text-[var(--primary-text)] font-bold' : 'text-[var(--text-muted)]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Attend</span>
        </button>
        <button
          onClick={() => onTabChange('projects')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition ${
            currentTab === 'projects' ? 'text-[var(--primary-text)] font-bold' : 'text-[var(--text-muted)]'
          }`}
        >
          <HardHat className="w-4 h-4" />
          <span>Projects</span>
        </button>
        <button
          onClick={() => onTabChange('ai')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition ${
            currentTab === 'ai' ? 'text-[var(--accent-text)] font-bold' : 'text-[var(--text-muted)]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI</span>
        </button>
      </nav>

      {/* Global Command Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tab) => onTabChange(tab)}
      />

      {/* Global Step-Up MFA Dialog */}
      <StepUpModal />
    </div>
  );
};
