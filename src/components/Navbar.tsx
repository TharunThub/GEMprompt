import React from 'react';
import {
  Gem,
  Plus,
  Bookmark,
  Settings,
  FileText,
  UserCheck,
  Search,
  Building2,
  Mail,
  ListChecks,
  Sparkles
} from 'lucide-react';
import { PRESET_REQUISITIONS } from '../data/presets';
import { PresetRequisition } from '../types/sourcing';

export type NavSection = 'studio' | 'persona' | 'boolean' | 'companies' | 'outreach' | 'checklist';

interface NavbarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  onSelectPreset: (preset: PresetRequisition) => void;
  onOpenSettings: () => void;
  onOpenSaved: () => void;
  onNewRequisition: () => void;
  savedCount: number;
  hasActivePlan: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onSelectSection,
  onSelectPreset,
  onOpenSettings,
  onOpenSaved,
  onNewRequisition,
  savedCount,
  hasActivePlan
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-3">
          
          {/* Brand Logo & New Button */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div
              className="flex items-center space-x-2.5 cursor-pointer select-none group"
              onClick={() => onSelectSection('studio')}
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white group-hover:scale-105 transition">
                <Gem className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-xl text-slate-900 tracking-tight font-sans">
                    GEM<span className="text-blue-600 font-bold">prompt</span>
                  </span>
                  <span className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    v1.2
                  </span>
                </div>
              </div>
            </div>

            {/* Prominent & Highly Accessible + New Requisition Button */}
            <button
              onClick={onNewRequisition}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition transform hover:-translate-y-0.5"
              title="Create New Requisition Plan"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Intake</span>
            </button>
          </div>

          {/* Center Section Links */}
          {hasActivePlan && (
            <nav className="hidden xl:flex items-center space-x-1 bg-slate-100/90 border border-slate-200/80 p-1 rounded-xl">
              <button
                onClick={() => onSelectSection('persona')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                  activeSection === 'persona'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>1. Persona</span>
              </button>

              <button
                onClick={() => onSelectSection('boolean')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                  activeSection === 'boolean'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>2. Boolean</span>
              </button>

              <button
                onClick={() => onSelectSection('companies')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                  activeSection === 'companies'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>3. Companies</span>
              </button>

              <button
                onClick={() => onSelectSection('outreach')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                  activeSection === 'outreach'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>4. Outreach</span>
              </button>

              <button
                onClick={() => onSelectSection('checklist')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
                  activeSection === 'checklist'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <ListChecks className="w-3.5 h-3.5" />
                <span>5. Checklist</span>
              </button>
            </nav>
          )}

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2">
            {/* Quick Sample Selector */}
            <div className="relative hidden md:block">
              <select
                className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg px-3 py-1.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs transition"
                defaultValue=""
                onChange={(e) => {
                  const found = PRESET_REQUISITIONS.find(p => p.id === e.target.value);
                  if (found) {
                    onSelectPreset(found);
                    e.target.value = '';
                  }
                }}
              >
                <option value="" disabled>⚡ Sample Requisitions...</option>
                {PRESET_REQUISITIONS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.badge} — {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Vault Button */}
            <button
              onClick={onOpenSaved}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 shadow-2xs transition"
              title="Saved Plans Vault"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>Vault</span>
              {savedCount > 0 && (
                <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 shadow-2xs transition"
              title="Settings & AI Engine"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
