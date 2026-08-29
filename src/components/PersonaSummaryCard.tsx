import React from 'react';
import { UserCheck, ShieldAlert, CheckCircle2, Sliders } from 'lucide-react';
import { PersonaSummary } from '../types/sourcing';

interface PersonaSummaryCardProps {
  summary: PersonaSummary;
}

export const PersonaSummaryCard: React.FC<PersonaSummaryCardProps> = ({ summary }) => {
  return (
    <div id="persona" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-20">
      {/* Header */}
      <div className="flex items-center space-x-4 border-b border-slate-100 pb-5">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Core Persona & Key Criteria Summary
          </h3>
        </div>
      </div>

      {/* Target Profile Hero Card */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 sm:p-6 relative overflow-hidden">
        <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-blue-800 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping mr-1" />
          🎯 Target Profile Summary
        </div>
        <p className="text-base sm:text-lg text-slate-900 leading-relaxed font-semibold">
          {summary.targetProfile}
        </p>
      </div>

      {/* Grid of 3 Pillars: Non-Negotiables, Flex Zones, Dealbreakers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pillar 1: Non-Negotiables (Must Haves) */}
        <div className="bg-emerald-50/40 border border-emerald-200 rounded-xl p-5 flex flex-col space-y-3.5 shadow-2xs">
          <div className="flex items-center space-x-2 text-emerald-900 font-extrabold text-sm uppercase tracking-wider">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Non-Negotiables (Must-Haves)</span>
          </div>
          <ul className="space-y-2.5 text-sm text-slate-800 flex-1 font-medium">
            {summary.nonNegotiables.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs">
                <span className="text-emerald-600 font-bold text-base mt-[-2px]">•</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pillar 2: Flex Zones (Nice to Haves) */}
        <div className="bg-blue-50/40 border border-blue-200 rounded-xl p-5 flex flex-col space-y-3.5 shadow-2xs">
          <div className="flex items-center space-x-2 text-blue-900 font-extrabold text-sm uppercase tracking-wider">
            <Sliders className="w-5 h-5 text-blue-600" />
            <span>Flex Zones (Compromises)</span>
          </div>
          <ul className="space-y-2.5 text-sm text-slate-800 flex-1 font-medium">
            {summary.flexZones.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 bg-white p-3 rounded-lg border border-blue-100 shadow-2xs">
                <span className="text-blue-600 font-bold text-base mt-[-2px]">•</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pillar 3: Dealbreakers (Disqualifiers) */}
        <div className="bg-rose-50/40 border border-rose-200 rounded-xl p-5 flex flex-col space-y-3.5 shadow-2xs">
          <div className="flex items-center space-x-2 text-rose-900 font-extrabold text-sm uppercase tracking-wider">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>Dealbreakers (Disqualifiers)</span>
          </div>
          <ul className="space-y-2.5 text-sm text-slate-800 flex-1 font-medium">
            {summary.dealbreakers.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 bg-white p-3 rounded-lg border border-rose-100 shadow-2xs">
                <span className="text-rose-600 font-bold mt-0.5">✕</span>
                <span className="leading-snug text-rose-950 font-semibold">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
