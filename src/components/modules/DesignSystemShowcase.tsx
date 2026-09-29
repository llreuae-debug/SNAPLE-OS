import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Sliders,
  ChevronRight,
  Shield,
  Eye,
  Settings,
  Flame,
  Check,
  X,
  Volume2,
  Camera,
  Search,
  Filter,
  ArrowRight,
  User,
  SlidersHorizontal,
  Bookmark,
  Bell,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const DesignSystemShowcase: React.FC = () => {
  const { t } = useLanguage();

  // Interactive playground states
  const [sliderValue, setSliderValue] = useState<number>(65);
  const [switchState1, setSwitchState1] = useState<boolean>(true);
  const [switchState2, setSwitchState2] = useState<boolean>(false);
  const [selectedSegment, setSelectedSegment] = useState<'Nover' | 'Contacts' | 'Orders'>('Contacts');
  const [activeTableTab, setActiveTableTab] = useState<'On/Off' | 'Default' | 'Hover' | 'Selected'>('Hover');
  const [inputText, setInputText] = useState('Focused');

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="ui-surface-elevated p-6 sm:p-8 rounded-[28px] border border-[var(--border-base)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-primary)]/15 text-[var(--brand-primary)] border border-[var(--brand-primary)]/25 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SNAPLE-OS 3D Tactile Design System & Living Style Guide</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Soft 3D Surfaces & Hardware Tactile UI
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Derived directly from the master visual design specification. Built with layered pastel geometry, extruded tactile surfaces, halo glowing inputs, recessed tick channels, and calm enterprise contrast.
          </p>
        </div>

        {/* Quick Color Swatches */}
        <div className="flex flex-wrap gap-2 items-center bg-[var(--surface-sunken)] p-3 rounded-[20px] border border-[var(--border-subtle)]">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-[#7D9B91] shadow-md border border-white/40" />
            <span className="text-[9px] font-mono text-[var(--text-muted)]">Sage</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-[#6B878F] shadow-md border border-white/40" />
            <span className="text-[9px] font-mono text-[var(--text-muted)]">Slate</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-[#A4B9AE] shadow-md border border-white/40" />
            <span className="text-[9px] font-mono text-[var(--text-muted)]">Mint</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-[#A9A0C4] shadow-md border border-white/40" />
            <span className="text-[9px] font-mono text-[var(--text-muted)]">Lilac</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-[#F4F4EE] shadow-md border border-black/10" />
            <span className="text-[9px] font-mono text-[var(--text-muted)]">Ivory</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: 3D SOFT PASTEL SURFACES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[var(--brand-primary)]" />
            <span>1. Extruded 3D Soft Surfaces & Pill Cards</span>
          </h2>
          <span className="text-xs text-[var(--text-muted)] font-mono">24px Radius • Dual Drop & Bevel Lighting</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Sage */}
          <div className="ui-3d-card-sage p-6 flex flex-col justify-between h-36 cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="font-bold text-base tracking-tight">Tives</span>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <Palette className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <p className="text-xs text-white/80 font-medium">Limiag Enterprise</p>
              <p className="text-[10px] text-white/60 font-mono">#7D9B91 • Soft Sage</p>
            </div>
          </div>

          {/* Card 2: Mint */}
          <div className="ui-3d-card-mint p-6 flex flex-col justify-between h-36 cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="font-bold text-base tracking-tight text-[#26302F]">Sonster</span>
              <div className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4 text-[#26302F]" />
              </div>
            </div>
            <div>
              <p className="text-xs text-[#26302F]/80 font-medium">Venison Shiers Control</p>
              <p className="text-[10px] text-[#26302F]/60 font-mono">#A4B9AE • Dusty Mint</p>
            </div>
          </div>

          {/* Card 3: Slate Teal */}
          <div className="ui-3d-card-slate p-6 flex flex-col justify-between h-36 cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="font-bold text-base tracking-tight">Begeradsums</span>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <p className="text-xs text-white/80 font-medium">Formalenet Security Engine</p>
              <p className="text-[10px] text-white/60 font-mono">#6B878F • Muted Slate</p>
            </div>
          </div>

          {/* Card 4: Slate Blue Dark */}
          <div className="ui-3d-card-slate p-6 flex flex-col justify-between h-36 cursor-pointer !bg-[#536E76]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-base tracking-tight">Senterioin</span>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <p className="text-xs text-white/80 font-medium">Elevation Controls</p>
              <p className="text-[10px] text-white/60 font-mono">#536E76 • Deep Slate</p>
            </div>
          </div>

          {/* Card 5: Soft Jade Green */}
          <div className="ui-3d-card-sage p-6 flex flex-col justify-between h-36 cursor-pointer !bg-[#83A396]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-base tracking-tight">Aby</span>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <p className="text-xs text-white/80 font-medium">Elevation System</p>
              <p className="text-[10px] text-white/60 font-mono">#83A396 • Soft Jade</p>
            </div>
          </div>

          {/* Card 6: Warm Ivory */}
          <div className="ui-3d-card-ivory p-6 flex flex-col justify-between h-36 cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="font-bold text-base tracking-tight text-[var(--text-primary)]">Ressbal Phosler</span>
              <div className="w-7 h-7 rounded-full bg-[var(--surface-sunken)] flex items-center justify-center">
                <Eye className="w-4 h-4 text-[var(--text-secondary)]" />
              </div>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)] font-medium">Inspiration Surface</p>
              <p className="text-[10px] text-[var(--text-muted)] font-mono">#F4F4EE • Soft Ivory</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: TACTILE BUTTONS & DIALS */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
          <Palette className="w-4 h-4 text-[var(--brand-accent)]" />
          <span>2. Tactile Pill Buttons & Circular Dials</span>
        </h2>

        <div className="ui-surface-elevated p-6 rounded-[24px] border border-[var(--border-base)] flex flex-wrap items-center gap-4">
          {/* Lavender Pill Button */}
          <button className="btn-pill-lavender flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>+ Hover</span>
          </button>

          {/* Tactile White Pill Button */}
          <button className="btn-pill-white flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[var(--brand-primary)]" />
            <span>Hover</span>
          </button>

          {/* Pressed State Pill Button */}
          <button className="btn-pill-pressed flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span>Pressed</span>
          </button>

          {/* Sage Green Pill Button */}
          <button className="btn-pill-sage flex items-center gap-2">
            <span># Tosuben</span>
          </button>

          {/* Circular Tactile Dial Button */}
          <button className="btn-tactile-dial" title="Tactile Dial Control">
            <div className="w-7 h-7 rounded-full bg-[#7D9B91]/20 flex items-center justify-center text-[var(--brand-primary)]">
              <RefreshCw className="w-4 h-4" />
            </div>
          </button>

          {/* Secondary Lavender Pill */}
          <div className="px-5 py-2.5 rounded-full bg-[#CDC6E5] text-[#4C4266] font-semibold text-xs flex items-center gap-2 shadow-sm">
            <User className="w-4 h-4" />
            <span>Empiinoletiors</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: ILLUMINATED HALO STADIUM INPUTS & GROOVED TICK SLIDERS */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[var(--brand-secondary)]" />
          <span>3. Illuminated Halo Stadium Inputs & Grooved Tick Channels</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs Column */}
          <div className="ui-surface-elevated p-6 rounded-[24px] border border-[var(--border-base)] space-y-4">
            <h3 className="text-xs font-bold uppercase text-[var(--text-muted)]">Pill Stadium Inputs</h3>

            {/* Input 1: Default */}
            <div className="flex items-center gap-3">
              <span className="w-16 text-xs text-[var(--text-muted)]">Default</span>
              <div className="relative flex-1">
                <input
                  type="text"
                  defaultValue="Default State"
                  className="input-pill-halo w-full pl-9 pr-8"
                />
                <Bookmark className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7FA88E] absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Input 2: Focused with Active Dot */}
            <div className="flex items-center gap-3">
              <span className="w-16 text-xs text-[var(--text-muted)]">Focused</span>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="input-pill-halo w-full pl-9 pr-8 !border-[#A9A0C4] !shadow-[0_0_0_4px_rgba(169,160,196,0.35)]"
                />
                <div className="w-2.5 h-2.5 rounded-full bg-[#B97878] absolute left-3.5 top-1/2 -translate-y-1/2 animate-pulse" />
                <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Input 3: Error */}
            <div className="flex items-center gap-3">
              <span className="w-16 text-xs text-[var(--text-muted)]">Error</span>
              <div className="relative flex-1">
                <input
                  type="text"
                  defaultValue="Error state field"
                  className="input-pill-halo w-full pl-9 pr-8 !border-[#E5C3C3] !bg-[#F9EDED]"
                />
                <X className="w-3.5 h-3.5 text-[#B97878] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Input 4: Filled */}
            <div className="flex items-center gap-3">
              <span className="w-16 text-xs text-[var(--text-muted)]">Filled</span>
              <div className="relative flex-1">
                <input
                  type="text"
                  defaultValue="Completed output value"
                  className="input-pill-halo w-full pl-9 pr-8"
                />
                <Check className="w-3.5 h-3.5 text-[#7FA88E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7FA88E] absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Sliders & Switches Column */}
          <div className="ui-surface-elevated p-6 rounded-[24px] border border-[var(--border-base)] space-y-6">
            <h3 className="text-xs font-bold uppercase text-[var(--text-muted)]">Grooved Tick Sliders & Switches</h3>

            {/* Grooved Tick Track */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)]">Recessed Channel with Tick Marks</span>
                <span className="font-mono font-bold text-[var(--brand-primary)]">{sliderValue}%</span>
              </div>
              <div className="track-groove-ticks flex items-center justify-between font-mono text-[10px] select-none">
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
              </div>
            </div>

            {/* Interactive Tactile Range Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full h-3 bg-[var(--surface-sunken)] rounded-full appearance-none cursor-pointer accent-[#7D9B91]"
              />
            </div>

            {/* Tactile Switches & Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSwitchState1(!switchState1)}
                  className={`w-14 h-8 rounded-full p-1 transition duration-200 ease-in-out shadow-inner border border-black/10 ${
                    switchState1 ? 'bg-[#7FA88E]' : 'bg-[var(--surface-sunken)]'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white shadow-md transform transition duration-200 ease-in-out ${
                      switchState1 ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-xs font-medium text-[var(--text-secondary)]">Dual Tactile Switch</span>
              </div>

              {/* Two-Tone Pill Toggle */}
              <div className="flex items-center gap-2 p-1 rounded-full bg-[#3B4644] border border-[#CDC6E5] text-white text-xs px-3 shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-[#7FA88E] animate-pulse" />
                <span className="font-mono text-[11px]">AUTO</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#A9A0C4]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: MINI TACTILE WIDGET & EMPTY STATE & DATA TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Mini Phone / Card Widget */}
        <div className="ui-surface-elevated p-5 rounded-[26px] border border-[var(--border-base)] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <span className="font-bold text-xs text-[var(--text-primary)]">Quick Actions Stack</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--surface-sunken)] text-[var(--text-muted)]">
              Device UI
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-elevated)] border border-[var(--border-subtle)] transition cursor-pointer">
              <span className="font-medium text-[var(--text-primary)]">Default Setting</span>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-elevated)] border border-[var(--border-subtle)] transition cursor-pointer">
              <span className="font-medium text-[var(--text-primary)]">Regions & Boundaries</span>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-elevated)] border border-[var(--border-subtle)] transition cursor-pointer">
              <span className="font-medium text-[var(--text-primary)]">System Errors Sentinel</span>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-elevated)] border border-[var(--border-subtle)] transition cursor-pointer">
              <span className="font-medium text-[var(--text-primary)]">Focus Areas</span>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-subtle)] hover:bg-[var(--surface-elevated)] border border-[var(--border-subtle)] transition cursor-pointer">
              <span className="font-medium text-[var(--text-primary)]">Sorting & Filters</span>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </div>
          </div>

          <button className="w-full btn-tactile-primary py-2.5 text-xs font-bold">
            Select Configuration
          </button>
        </div>

        {/* 2. Illustrated Empty State Squircle */}
        <div className="empty-state-squircle flex flex-col items-center justify-center text-center space-y-3">
          {/* Clean minimal avatar line illustration */}
          <div className="w-16 h-16 rounded-full bg-[#CDC6E5]/30 border-2 border-[#A9A0C4] flex items-center justify-center text-[#594F74] shadow-inner">
            <User className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div>
            <h4 className="font-bold text-base text-[var(--text-primary)]">Empty States Card</h4>
            <p className="text-xs text-[var(--text-muted)] max-w-[200px] mx-auto mt-1">
              Soft ivory surfaces with high-clarity micro line drawings and immediate primary action triggers.
            </p>
          </div>
          <button className="btn-pill-lavender text-xs">
            Create First Record
          </button>
        </div>

        {/* 3. Segmented Pill Switcher & Tactile Data Sheet */}
        <div className="ui-surface-elevated p-5 rounded-[26px] border border-[var(--border-base)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-[var(--text-primary)]">Table Jurisdiction</span>
            <button className="p-1 rounded-full bg-[var(--surface-subtle)] hover:bg-[var(--surface-sunken)] text-[var(--text-muted)]">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Segmented Pill Control */}
          <div className="segmented-pill-container w-full justify-between">
            {(['Nover', 'Contacts', 'Orders'] as const).map((seg) => (
              <button
                key={seg}
                onClick={() => setSelectedSegment(seg)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                  selectedSegment === seg
                    ? 'bg-[#7D9B91] text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {seg}
              </button>
            ))}
          </div>

          {/* Action Pills */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(['On/Off', 'Default', 'Hover', 'Selected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTableTab(tab)}
                className={`py-1.5 px-3 rounded-xl font-medium border text-center transition ${
                  activeTableTab === tab
                    ? 'bg-[var(--brand-primary)]/15 border-[var(--brand-primary)] text-[var(--brand-primary)] font-bold'
                    : 'bg-[var(--surface-subtle)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Pastel Data Rows */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-[#EAF3EC] text-[#3D664D] border border-[#C5DFCE] text-center font-bold">
              Enclele
            </div>
            <div className="p-2.5 rounded-xl bg-[#EDF3F6] text-[#395966] border border-[#C9DAE2] text-center font-bold">
              Eaguited
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF4E9] text-[#735730] border border-[#E8D8BF] text-center font-bold">
              Houres
            </div>
            <div className="p-2.5 rounded-xl bg-[#F0EDF6] text-[#594F74] border border-[#D7D1E5] text-center font-bold">
              Stawes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
