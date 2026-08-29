import React, { useState } from 'react';
import {
  RequisitionInput,
  SourcingActionPlan,
  ApiSettings,
  PresetRequisition
} from './types/sourcing';
import { PRESET_REQUISITIONS } from './data/presets';
import { generateSourcingStrategy } from './services/aiGenerator';
import { Navbar } from './components/Navbar';
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
  Plus,
  Bookmark,
  Sparkles,
  UserCheck,
  Search,
  Building2,
  Mail,
  ListChecks,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_SAVED_PLANS = 'gemprompt_saved_plans_v1';
const STORAGE_SETTINGS = 'gemprompt_api_settings_v1';

export type ActiveTabType = 'all' | 'persona' | 'boolean' | 'companies' | 'outreach' | 'checklist';

export function App() {
  // 1. Start on fresh New Intake form by default
  const [input, setInput] = useState<RequisitionInput>({
    title: '',
    location: '',
    seniority: '',
    workModel: 'Hybrid',
    jobDescription: '',
    intakeNotes: ''
  });
  const [activePlan, setActivePlan] = useState<SourcingActionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTabType>('all');

  // Modals & Collapse state (starts expanded on the Intake Studio form)
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
    setActiveTab('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerate = async (customInput?: RequisitionInput) => {
    const targetInput = customInput || input;
    setIsLoading(true);
    try {
      const plan = await generateSourcingStrategy(targetInput, settings);
      setActivePlan(plan);
      setIsInputCollapsed(true);
      setActiveTab('all');

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
    setActiveTab('all');
  };

  const handleDeletePlan = (id: string) => {
    setSavedPlans(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_SAVED_PLANS, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-[#f0f6ff] text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white w-full overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onHomeClick={handleNewRequisition}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        
        {/* 1. Appealing Greeting & Orderly Action Toolbar */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center space-x-2 text-blue-600 font-extrabold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4" />
              <span>AI Sourcing Strategist</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Hello, <span className="text-blue-600">Recruiter</span> ✨
            </h1>
          </div>

          {/* Cleanly Aligned & Ordered Global Action Buttons */}
          <div className="flex items-center space-x-2.5 flex-nowrap shrink-0 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={handleNewRequisition}
              className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition flex items-center space-x-1.5 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Intake</span>
            </button>

            {/* Quick Sample Selector */}
            <div className="relative shrink-0">
              <select
                className="h-10 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl px-3.5 pr-8 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs transition appearance-none"
                defaultValue=""
                onChange={(e) => {
                  const found = PRESET_REQUISITIONS.find(p => p.id === e.target.value);
                  if (found) {
                    handleSelectPreset(found);
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500 text-xs font-bold">
                ▼
              </div>
            </div>

            {/* Sourcing Vault Button */}
            <button
              onClick={() => setIsSavedOpen(true)}
              className="h-10 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 shadow-2xs transition flex items-center space-x-1.5 shrink-0"
            >
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span>Vault</span>
              {savedPlans.length > 0 && (
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {savedPlans.length}
                </span>
              )}
            </button>
          </div>
        </section>

        {/* 2. Requisition Studio Input Form (Opens by Default on First Load) */}
        {!isInputCollapsed && (
          <section id="studio" className="transition-all duration-200">
            <InputPanel
              input={input}
              onChange={handleInputChange}
              onGenerate={() => handleGenerate()}
              onSelectPreset={handleSelectPreset}
              isLoading={isLoading}
            />
          </section>
        )}

        {/* 3. Active Sourcing Plan Dashboard */}
        {activePlan && (
          <section className="space-y-8">
            
            {/* Active Role Card with Cleanly Aligned Action Buttons */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-100 pb-6">
                <div className="flex items-start space-x-4 min-w-0">
                  <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs shrink-0 mt-0.5">
                    <Gem className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex items-center space-x-3 flex-wrap">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                        {activePlan.input.title || 'Untitled Requisition'}
                      </h2>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                        Strategy Active
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-xs sm:text-sm text-slate-600 flex-wrap gap-y-1 font-medium">
                      {activePlan.input.location && (
                        <span className="flex items-center space-x-1.5">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span>{activePlan.input.location}</span>
                        </span>
                      )}
                      {activePlan.input.seniority && (
                        <span className="flex items-center space-x-1.5">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          <span>{activePlan.input.seniority}</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>Generated at {new Date(activePlan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cleanly Aligned In-Order Role Action Buttons */}
                <div className="flex items-center space-x-2 flex-nowrap shrink-0 overflow-x-auto pb-1 lg:pb-0">
                  <button
                    onClick={() => {
                      setIsInputCollapsed(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="h-9 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 flex items-center space-x-1.5 transition shadow-2xs shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Edit JD / Notes</span>
                  </button>

                  <button
                    onClick={() => handleGenerate()}
                    disabled={isLoading}
                    className="h-9 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 flex items-center space-x-1.5 transition shadow-2xs shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Regenerate</span>
                  </button>

                  <button
                    onClick={() => setIsExportOpen(true)}
                    className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-sm shrink-0"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Export Brief</span>
                  </button>
                </div>
              </div>

              {/* Sourcing Pillars Tabs Under the Role Card */}
              <div className="pt-1">
                <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition whitespace-nowrap ${
                      activeTab === 'all'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>All 5 Pillars</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('persona')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition whitespace-nowrap ${
                      activeTab === 'persona'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>1. Persona & Criteria</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('boolean')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition whitespace-nowrap ${
                      activeTab === 'boolean'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Search className="w-4 h-4" />
                    <span>2. Boolean Strings</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('companies')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition whitespace-nowrap ${
                      activeTab === 'companies'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>3. Target Companies</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('outreach')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition whitespace-nowrap ${
                      activeTab === 'outreach'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span>4. Outreach & InMail</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('checklist')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition whitespace-nowrap ${
                      activeTab === 'checklist'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ListChecks className="w-4 h-4" />
                    <span>5. Day-1 Checklist</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Sourcing Content Cards */}
            <div className="space-y-8">
              {(activeTab === 'all' || activeTab === 'persona') && (
                <PersonaSummaryCard summary={activePlan.personaSummary} />
              )}

              {(activeTab === 'all' || activeTab === 'boolean') && (
                <BooleanStringsCard booleanStrings={activePlan.booleanStrings} />
              )}

              {(activeTab === 'all' || activeTab === 'companies') && (
                <CompanyMappingCard companyMapping={activePlan.companyMapping} />
              )}

              {(activeTab === 'all' || activeTab === 'outreach') && (
                <OutreachStrategyCard outreach={activePlan.outreachStrategy} />
              )}

              {(activeTab === 'all' || activeTab === 'checklist') && (
                <DayOneChecklistCard checklist={activePlan.dayOneChecklist} />
              )}
            </div>

          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-blue-100 bg-white py-6 text-center text-xs text-slate-500 shadow-2xs mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Gem className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900">GEMprompt</span>
            <span>— Talent Sourcing Intelligence System</span>
          </div>
          <span className="text-slate-500 font-medium">Built for Talent Sourcers, Recruiters & Hiring Teams</span>
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
