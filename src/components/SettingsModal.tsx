import React, { useState } from 'react';
import { X, Key, Cpu, ShieldCheck, ExternalLink, Save } from 'lucide-react';
import { ApiSettings } from '../types/sourcing';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ApiSettings;
  onSave: (settings: ApiSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings: initialSettings,
  onSave
}) => {
  const [settings, setSettings] = useState<ApiSettings>(initialSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">AI Engine Configuration</h3>
            <p className="text-xs text-slate-500">Choose your intelligence provider</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Intelligence Engine
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSettings({ ...settings, provider: 'local' })}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  settings.provider === 'local'
                    ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Cpu className="w-4 h-4 text-blue-600" />
                <span className="text-xs">Local Engine</span>
                <span className="text-[10px] text-slate-400">Zero Setup</span>
              </button>

              <button
                type="button"
                onClick={() => setSettings({ ...settings, provider: 'gemini' })}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  settings.provider === 'gemini'
                    ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Key className="w-4 h-4 text-blue-600" />
                <span className="text-xs">Gemini API</span>
                <span className="text-[10px] text-slate-400">Google AI</span>
              </button>

              <button
                type="button"
                onClick={() => setSettings({ ...settings, provider: 'openai' })}
                className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  settings.provider === 'openai'
                    ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Key className="w-4 h-4 text-emerald-600" />
                <span className="text-xs">OpenAI API</span>
                <span className="text-[10px] text-slate-400">GPT-4o</span>
              </button>
            </div>
          </div>

          {/* Provider Specific Settings */}
          {settings.provider !== 'local' ? (
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    {settings.provider === 'gemini' ? 'Gemini API Key' : 'OpenAI API Key'}
                  </label>
                  <a
                    href={
                      settings.provider === 'gemini'
                        ? 'https://aistudio.google.com/app/apikey'
                        : 'https://platform.openai.com/api-keys'
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Get API key <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <input
                  type="password"
                  placeholder={settings.provider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                  value={settings.apiKey}
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Model Name
                </label>
                <input
                  type="text"
                  placeholder={settings.provider === 'gemini' ? 'gemini-1.5-flash' : 'gpt-4o-mini'}
                  value={settings.modelName}
                  onChange={(e) => setSettings({ ...settings, modelName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Keys are stored locally in your browser and never sent elsewhere.</span>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 text-xs text-slate-600 space-y-1.5">
              <p className="font-bold text-blue-900">⚡ Built-in Intelligent Rule Engine</p>
              <p className="leading-relaxed">
                Extracts JD requirements, builds multi-tier Boolean strings for LinkedIn Recruiter, Naukri, and Google X-ray, identifies target poaching companies, and formats InMail templates instantly with zero API keys required.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center space-x-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savedSuccess ? 'Saved!' : 'Save Preferences'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
