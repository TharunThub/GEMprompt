import React, { useState, useEffect } from 'react';
import {
  RequisitionInput,
  SourcingActionPlan,
  ApiSettings,
  PresetRequisition
} from './types/sourcing';
import { PRESET_REQUISITIONS } from './data/presets';
import { generateSourcingStrategy } from './services/aiGenerator';
import { Navbar, NavSection } from './components/Navbar';
import { InputPanel } from './components/InputPanel';
import { PersonaSummaryCard } from './components/PersonaSummaryCard';
import { BooleanStringsCard } from './components/BooleanStringsCard';
import { CompanyMappingCard } from './components/CompanyMappingCard';
import { OutreachStrategyCard } from './components/OutreachStrategyCard';
import { DayOneChecklistCard } from './components/DayOneChecklistCard';
import { SettingsModal } from './components/SettingsModal';
import { SavedRequisitionsModal } from './components/SavedRequisitionsModal';
import { ExportModal } from './components/ExportModal';
import {
  Share2,
  RefreshCw,
  Edit3,
  MapPin,
  Briefcase,
  Clock,
  Gem,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_SAVED_PLANS = 'gemprompt_saved_plans_v1';
const STORAGE_SETTINGS = 'gemprompt_api_settings_v1';

export function App() {
  const [input, setInput] = useState<RequisitionInput>(PRESET_REQUISITIONS[0].input);
  const [activePlan, setActivePlan] = useState<SourcingActionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSection>('studio');

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isInputCollapsed, setIsInputCollapsed] = useState(false);

  // Settings & Saved Plans
  const [settings, setSettings] = useState<ApiSettings>(() => {
    const cached = localStorage.getItem(STORAGE_SETTINGS);
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { }
    }
    return {
      provider: 'local',
      apiKey: '',
      modelName: 'gemini-1.5-flash'
    };
  });

  const [savedPlans, setSavedPlans] = useState<SourcingActionPlan[]>(() => {
    const cached = localStorage.getItem(STORAGE_SAVED_PLANS);
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { }
    }
    return [];
  });

  // Auto-generate on first load
  useEffect(() => {
    handleGenerate(PRESET_REQUISITIONS[0].input);
  }, []);

  const handleInputChange = (field: keyof RequisitionInput, value: string) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectPreset = (preset: PresetRequisition) => {
    setInput(preset.input);
    handleGenerate(preset.input);
  };

  const handleNewRequisition = () => {
    setInput({
      title: '',
      location: '',
      seniority: '',
      workModel: 'Hybrid',
      jobDescription: '',
      intakeNotes: ''
    });
    setActivePlan(null);
    setIsInputCollapsed(false);
    setActiveSection('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerate = async (customInput?: RequisitionInput) => {
    const targetInput = customInput || input;
    setIsLoading(true);
    try {
      const plan = await generateSourcingStrategy(targetInput, settings);
      setActivePlan(plan);
      setIsInputCollapsed(true);
      setActiveSection('persona');

      // Auto save to vault
      setSavedPlans(prev => {
        const filtered = prev.filter(p => p.id !== plan.id && p.input.title !== plan.input.title);
        const updated = [plan, ...filtered].slice(0, 30);
        localStorage.setItem(STORAGE_SAVED_PLANS, JSON.stringify(updated));
        return updated;
      });

      confetti({
        particleCount: 40,
        spread: 40,
        origin: { y: 0.85 }
      });
    } catch (error) {
      console.error('Failed to generate sourcing plan', error);
      alert('Error generating sourcing strategy. Please check your settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = (newSettings: ApiSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(newSettings));
  };

  const handleLoadPlan = (plan: SourcingActionPlan) => {
    setInput(plan.input);
    setActivePlan(plan);
    setIsInputCollapsed(true);
    setActiveSection('persona');
  };

  const handleDeletePlan = (id: string) => {
    setSavedPlans(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_SAVED_PLANS, JSON.stringify(updated));
      return updated;
    });
  };

  const handleSelectNavSection = (section: NavSection) => {
    setActiveSection(section);
    if (section === 'studio') {
      setIsInputCollapsed(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f6ff] text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navbar with Accessible New Button & Brand */}
      <Navbar
        activeSection={activeSection}
        onSelectSection={handleSelectNavSection}
        onSelectPreset={handleSelectPreset}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSaved={() => setIsSavedOpen(true)}
        onNewRequisition={handleNewRequisition}
        savedCount={savedPlans.length}
        hasActivePlan={!!activePlan}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-7">
        
        {/* Requisition Intake Header Summary Card */}
        {isInputCollapsed && activePlan && (
          <div className="bg-white border border-blue-100 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center space-x-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs flex-shrink-0">
                <Gem className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2.5 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
                    {activePlan.input.title || 'Untitled Requisition'}
                  </h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                    Plan Active
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs sm:text-sm text-slate-500 mt-1 flex-wrap gap-y-1 font-medium">
                  {activePlan.input.location && (
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{activePlan.input.location}</span>
                    </span>
                  )}
                  {activePlan.input.seniority && (
                    <span className="flex items-center space-x-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span>{activePlan.input.seniority}</span>
                    </span>
                  )}
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(activePlan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2.5 self-stretch sm:self-auto justify-end flex-shrink-0">
              <button
                onClick={() => {
                  setIsInputCollapsed(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 flex items-center space-x-1.5 transition shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Edit Intake</span>
              </button>

              <button
                onClick={() => handleGenerate()}
                disabled={isLoading}
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 flex items-center space-x-1.5 transition shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={() => setIsExportOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center space-x-1.5 transition shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Export Brief</span>
              </button>
            </div>
          </div>
        )}

        {/* Requisition Studio Input (when expanded) */}
        {!isInputCollapsed && (
          <section id="studio">
            <InputPanel
              input={input}
              onChange={handleInputChange}
              onGenerate={() => handleGenerate()}
              onSelectPreset={handleSelectPreset}
              isLoading={isLoading}
            />
          </section>
        )}

        {/* 5-Pillar Sourcing Action Plan View (Seamless, executive layout) */}
        {activePlan && (
          <section className="space-y-8">
            <PersonaSummaryCard summary={activePlan.personaSummary} />
            <BooleanStringsCard booleanStrings={activePlan.booleanStrings} />
            <CompanyMappingCard companyMapping={activePlan.companyMapping} />
            <OutreachStrategyCard outreach={activePlan.outreachStrategy} />
            <DayOneChecklistCard checklist={activePlan.dayOneChecklist} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-100 bg-white py-6 text-center text-xs text-slate-500 shadow-2xs mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Gem className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-800">GEMprompt</span>
            <span>— Talent Sourcing Strategy System</span>
          </div>
          <span className="text-slate-500">Built for Talent Sourcers, Recruiters & Hiring Teams</span>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />

      <SavedRequisitionsModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedPlans={savedPlans}
        onLoadPlan={handleLoadPlan}
        onDeletePlan={handleDeletePlan}
      />

      {activePlan && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          plan={activePlan}
        />
      )}
    </div>
  );
}
