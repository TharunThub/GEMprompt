import React, { useRef, useState } from 'react';
import { Sparkles, FileText, ClipboardList, MapPin, Briefcase, Zap, ArrowRight, Paperclip, Loader2 } from 'lucide-react';
import { RequisitionInput, PresetRequisition } from '../types/sourcing';
import { PRESET_REQUISITIONS } from '../data/presets';
import { parseFileToText } from '../services/fileParser';

interface InputPanelProps {
  input: RequisitionInput;
  onChange: (field: keyof RequisitionInput, value: string) => void;
  onGenerate: () => void;
  onSelectPreset: (preset: PresetRequisition) => void;
  isLoading: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  input,
  onChange,
  onGenerate,
  onSelectPreset,
  isLoading
}) => {
  const isReady = input.jobDescription.trim().length > 15 || input.intakeNotes.trim().length > 15;

  const jdFileInputRef = useRef<HTMLInputElement>(null);
  const hmFileInputRef = useRef<HTMLInputElement>(null);

  const [isParsingJD, setIsParsingJD] = useState(false);
  const [isParsingHM, setIsParsingHM] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'jobDescription' | 'intakeNotes') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (field === 'jobDescription') setIsParsingJD(true);
    else setIsParsingHM(true);

    try {
      const extractedText = await parseFileToText(file);
      // Append text with a newline if there's already content, or just set it
      const currentText = input[field];
      const newText = currentText ? `${currentText}\n\n--- Extracted from ${file.name} ---\n${extractedText}` : extractedText;
      onChange(field, newText);
    } catch (error: any) {
      alert(`Error parsing file: ${error.message}`);
    } finally {
      if (field === 'jobDescription') setIsParsingJD(false);
      else setIsParsingHM(false);
      // Reset input so the same file can be selected again
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
      {/* Top Banner & Quick Presets */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-600" />
              Requisition Intake Studio
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your Job Description and Hiring Manager Intake notes to generate the structured 5-pillar sourcing strategy.
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mr-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Quick Samples:
            </span>
            {PRESET_REQUISITIONS.slice(0, 3).map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPreset(p)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 transition font-medium shadow-2xs"
              >
                {p.badge}
              </button>
            ))}
          </div>
        </div>

        {/* Metadata Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100/80">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Job Title / Role *
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Golang Engineer"
              value={input.title}
              onChange={(e) => onChange('title', e.target.value)}
              className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Location / Geo
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="e.g. Bengaluru, India or US Remote"
                value={input.location || ''}
                onChange={(e) => onChange('location', e.target.value)}
                className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Target Seniority
            </label>
            <div className="relative">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="e.g. Senior / Staff (5-8+ YOE)"
                value={input.seniority || ''}
                onChange={(e) => onChange('seniority', e.target.value)}
                className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Work Model
            </label>
            <select
              value={input.workModel || 'Hybrid'}
              onChange={(e) => onChange('workModel', e.target.value)}
              className="w-full bg-white border border-slate-300 focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs"
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dual Textareas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Job Description */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-blue-600" />
              1. Job Description (JD)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">
                {input.jobDescription.length > 0 ? `${input.jobDescription.length} chars` : 'Paste official JD'}
              </span>
              <button
                type="button"
                onClick={() => jdFileInputRef.current?.click()}
                disabled={isParsingJD}
                className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition border border-slate-200"
                title="Attach PDF or DOCX"
              >
                {isParsingJD ? <Loader2 className="w-3 h-3 animate-spin" /> : <Paperclip className="w-3 h-3" />}
                Attach
              </button>
              <input 
                type="file" 
                ref={jdFileInputRef} 
                accept=".pdf,.docx,.txt" 
                className="hidden" 
                onChange={(e) => handleFileUpload(e, 'jobDescription')}
              />
            </div>
          </div>
          <textarea
            rows={10}
            placeholder="Paste complete Job Description here (Role summary, responsibilities, technical requirements, tech stack) OR attach a file..."
            value={input.jobDescription}
            onChange={(e) => onChange('jobDescription', e.target.value)}
            className="w-full bg-slate-50/70 border border-slate-250 hover:border-slate-300 focus:bg-white focus:border-blue-500 rounded-xl p-3.5 text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition resize-y leading-relaxed"
          />
        </div>

        {/* Right: Hiring Manager Intake Notes */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              2. Hiring Manager Intake Notes
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">
                {input.intakeNotes.length > 0 ? `${input.intakeNotes.length} chars` : 'Crucial context'}
              </span>
              <button
                type="button"
                onClick={() => hmFileInputRef.current?.click()}
                disabled={isParsingHM}
                className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition border border-slate-200"
                title="Attach PDF or DOCX"
              >
                {isParsingHM ? <Loader2 className="w-3 h-3 animate-spin" /> : <Paperclip className="w-3 h-3" />}
                Attach
              </button>
              <input 
                type="file" 
                ref={hmFileInputRef} 
                accept=".pdf,.docx,.txt" 
                className="hidden" 
                onChange={(e) => handleFileUpload(e, 'intakeNotes')}
              />
            </div>
          </div>
          <textarea
            rows={10}
            placeholder={`Paste Hiring Manager intake call notes OR attach a file...
- Must-Haves vs Flex Zones (e.g. Willing to relax YOE for tier-1 pedigree)
- Dealbreakers / Disqualifiers (e.g. No service companies, notice < 60 days)
- Target Companies to poach from (e.g. Razorpay, Swiggy, CRED)
- Off-limits companies to avoid`}
            value={input.intakeNotes}
            onChange={(e) => onChange('intakeNotes', e.target.value)}
            className="w-full bg-slate-50/70 border border-slate-250 hover:border-slate-300 focus:bg-white focus:border-amber-500 rounded-xl p-3.5 text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition resize-y leading-relaxed"
          />
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100">
        <p className="text-xs text-slate-500 text-center sm:text-left">
          Generates Core Persona, Platform-tailored Boolean Strings, Target Company Maps, InMail, and Day-1 Checklist.
        </p>

        <button
          type="button"
          onClick={onGenerate}
          disabled={!isReady || isLoading}
          className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-sm transition duration-200 ${
            !isReady || isLoading
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 hover:shadow-blue-600/30'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Analyzing & Synthesizing Strategy...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Sourcing Action Plan</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
