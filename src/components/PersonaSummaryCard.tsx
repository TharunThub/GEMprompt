import React, { useState, useEffect } from 'react';
import { UserCheck, ShieldAlert, CheckCircle2, Sliders, Edit3, Save, X } from 'lucide-react';
import { PersonaSummary } from '../types/sourcing';

interface PersonaSummaryCardProps {
  summary: PersonaSummary;
  onUpdate?: (data: PersonaSummary) => void;
}

export const PersonaSummaryCard: React.FC<PersonaSummaryCardProps> = ({ summary, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<PersonaSummary>(summary);

  useEffect(() => {
    setEditedData(summary);
  }, [summary]);

  const handleSave = () => {
    const cleanedData: PersonaSummary = {
      ...editedData,
      targetProfile: editedData.targetProfile.trim(),
      nonNegotiables: editedData.nonNegotiables.map(s => s.trim()).filter(Boolean),
      flexZones: editedData.flexZones.map(s => s.trim()).filter(Boolean),
      dealbreakers: editedData.dealbreakers.map(s => s.trim()).filter(Boolean),
    };
    if (onUpdate) {
      onUpdate(cleanedData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(summary);
    setIsEditing(false);
  };

  return (
    <div id="persona" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Core Persona & Key Criteria Summary
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCancel}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Target Profile Hero Card */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 sm:p-6 relative overflow-hidden">
        <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-blue-800 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping mr-1" />
          🎯 Target Profile Summary
        </div>
        {isEditing ? (
          <textarea
            rows={3}
            value={editedData.targetProfile}
            onChange={(e) => setEditedData({ ...editedData, targetProfile: e.target.value })}
            className="w-full p-3 bg-white border border-blue-300 rounded-xl text-sm sm:text-base text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
            placeholder="Enter target profile summary..."
          />
        ) : (
          <p className="text-base sm:text-lg text-slate-900 leading-relaxed font-semibold">
            {editedData.targetProfile}
          </p>
        )}
      </div>

      {/* Grid of 3 Pillars: Non-Negotiables, Flex Zones, Dealbreakers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pillar 1: Non-Negotiables (Must Haves) */}
        <div className="bg-emerald-50/40 border border-emerald-200 rounded-xl p-5 flex flex-col space-y-3.5 shadow-2xs">
          <div className="flex items-center space-x-2 text-emerald-900 font-extrabold text-sm uppercase tracking-wider">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Non-Negotiables (Must-Haves)</span>
          </div>
          {isEditing ? (
            <div className="flex-1 flex flex-col space-y-1.5">
              <textarea
                rows={6}
                value={editedData.nonNegotiables.join('\n')}
                onChange={(e) => setEditedData({ ...editedData, nonNegotiables: e.target.value.split('\n') })}
                className="w-full flex-1 p-3 bg-white border border-emerald-300 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
                placeholder="One requirement per line..."
              />
              <span className="text-[11px] text-emerald-800/70 font-medium">One item per line</span>
            </div>
          ) : (
            <ul className="space-y-2.5 text-sm text-slate-800 flex-1 font-medium">
              {editedData.nonNegotiables.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs">
                  <span className="text-emerald-600 font-bold text-base mt-[-2px]">•</span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pillar 2: Flex Zones (Nice to Haves) */}
        <div className="bg-blue-50/40 border border-blue-200 rounded-xl p-5 flex flex-col space-y-3.5 shadow-2xs">
          <div className="flex items-center space-x-2 text-blue-900 font-extrabold text-sm uppercase tracking-wider">
            <Sliders className="w-5 h-5 text-blue-600" />
            <span>Flex Zones (Compromises)</span>
          </div>
          {isEditing ? (
            <div className="flex-1 flex flex-col space-y-1.5">
              <textarea
                rows={6}
                value={editedData.flexZones.join('\n')}
                onChange={(e) => setEditedData({ ...editedData, flexZones: e.target.value.split('\n') })}
                className="w-full flex-1 p-3 bg-white border border-blue-300 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                placeholder="One item per line..."
              />
              <span className="text-[11px] text-blue-800/70 font-medium">One item per line</span>
            </div>
          ) : (
            <ul className="space-y-2.5 text-sm text-slate-800 flex-1 font-medium">
              {editedData.flexZones.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 bg-white p-3 rounded-lg border border-blue-100 shadow-2xs">
                  <span className="text-blue-600 font-bold text-base mt-[-2px]">•</span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pillar 3: Dealbreakers (Disqualifiers) */}
        <div className="bg-rose-50/40 border border-rose-200 rounded-xl p-5 flex flex-col space-y-3.5 shadow-2xs">
          <div className="flex items-center space-x-2 text-rose-900 font-extrabold text-sm uppercase tracking-wider">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <span>Dealbreakers (Disqualifiers)</span>
          </div>
          {isEditing ? (
            <div className="flex-1 flex flex-col space-y-1.5">
              <textarea
                rows={6}
                value={editedData.dealbreakers.join('\n')}
                onChange={(e) => setEditedData({ ...editedData, dealbreakers: e.target.value.split('\n') })}
                className="w-full flex-1 p-3 bg-white border border-rose-300 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 shadow-2xs"
                placeholder="One item per line..."
              />
              <span className="text-[11px] text-rose-800/70 font-medium">One item per line</span>
            </div>
          ) : (
            <ul className="space-y-2.5 text-sm text-slate-800 flex-1 font-medium">
              {editedData.dealbreakers.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 bg-white p-3 rounded-lg border border-rose-100 shadow-2xs">
                  <span className="text-rose-600 font-bold mt-0.5">✕</span>
                  <span className="leading-snug text-rose-950 font-semibold">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
