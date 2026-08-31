import React, { useState, useEffect } from 'react';
import { UserCheck, Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import { PersonaScorecard, ScorecardPillar } from '../types/sourcing';

interface PersonaScorecardProps {
  scorecard: PersonaScorecard;
  onUpdate?: (data: PersonaScorecard) => void;
}

export const PersonaSummaryCard: React.FC<PersonaScorecardProps> = ({ scorecard, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<PersonaScorecard>(scorecard);

  // Sync prop changes
  useEffect(() => {
    // Graceful fallback during transition: if the app passes the old structure temporarily, 
    // it won't crash when trying to access .pillars
    if (scorecard && (scorecard as any).targetProfile && Array.isArray((scorecard as any).pillars)) {
      setEditedData(scorecard);
    }
  }, [scorecard]);

  const handleSave = () => {
    if (onUpdate) onUpdate(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(scorecard);
    setIsEditing(false);
  };

  const updatePillar = (index: number, field: keyof ScorecardPillar, value: string) => {
    setEditedData(prev => {
      const newPillars = [...prev.pillars];
      newPillars[index] = { ...newPillars[index], [field]: value };
      return { ...prev, pillars: newPillars };
    });
  };

  const addPillar = () => {
    setEditedData(prev => ({
      ...prev,
      pillars: [
        ...prev.pillars,
        { pillar: 'New Pillar', weight: '10%', mustHaves: '', flexZones: '', dealbreakers: '' }
      ]
    }));
  };

  const removePillar = (index: number) => {
    setEditedData(prev => ({
      ...prev,
      pillars: prev.pillars.filter((_, i) => i !== index)
    }));
  };

  // Safe checks in case of old data format
  const pillars = Array.isArray(editedData.pillars) ? editedData.pillars : [];

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
              Core Persona & 5-Pillar Scorecard
            </h3>
          </div>
        </div>

        {/* Edit Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg flex items-center space-x-1.5 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg flex items-center space-x-1.5 transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center space-x-1.5 transition shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Target Profile Hero Card */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 sm:p-6 relative overflow-hidden">
        <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-blue-800 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping mr-1" />
          Target Profile Narrative
        </div>
        {!isEditing ? (
          <p className="text-base sm:text-lg text-slate-900 leading-relaxed font-semibold">
            {editedData.targetProfile || scorecard.targetProfile}
          </p>
        ) : (
          <textarea
            className="w-full text-base sm:text-lg text-slate-900 leading-relaxed font-semibold bg-white border border-blue-300 rounded-lg p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editedData.targetProfile || ''}
            onChange={(e) => setEditedData({ ...editedData, targetProfile: e.target.value })}
          />
        )}
      </div>

      {/* 5-Pillar Scorecard Matrix */}
      <div className="space-y-4">
        <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Weighted Scorecard Matrix</h4>
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-left text-sm whitespace-nowrap sm:whitespace-normal">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold w-1/5">Evaluation Pillar</th>
                <th className="px-4 py-3 font-semibold w-1/12">Weight</th>
                <th className="px-4 py-3 font-semibold w-1/4">Must-Have Criteria</th>
                <th className="px-4 py-3 font-semibold w-1/4">Flex / Compromise</th>
                <th className="px-4 py-3 font-semibold w-1/4">Absolute Dealbreakers</th>
                {isEditing && <th className="px-4 py-3 font-semibold w-12 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pillars.map((pillar, idx) => (
                <tr key={idx} className="bg-white">
                  <td className="px-4 py-4 align-top">
                    {!isEditing ? (
                      <span className="font-bold text-slate-900">{pillar.pillar}</span>
                    ) : (
                      <input
                        type="text"
                        className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                        value={pillar.pillar}
                        onChange={(e) => updatePillar(idx, 'pillar', e.target.value)}
                      />
                    )}
                  </td>
                  <td className="px-4 py-4 align-top">
                    {!isEditing ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
                        {pillar.weight}
                      </span>
                    ) : (
                      <input
                        type="text"
                        className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                        value={pillar.weight}
                        onChange={(e) => updatePillar(idx, 'weight', e.target.value)}
                      />
                    )}
                  </td>
                  <td className="px-4 py-4 align-top text-emerald-800 font-medium bg-emerald-50/30">
                    {!isEditing ? (
                      pillar.mustHaves
                    ) : (
                      <textarea
                        className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 min-h-[60px]"
                        value={pillar.mustHaves}
                        onChange={(e) => updatePillar(idx, 'mustHaves', e.target.value)}
                      />
                    )}
                  </td>
                  <td className="px-4 py-4 align-top text-amber-800 font-medium bg-amber-50/30">
                    {!isEditing ? (
                      pillar.flexZones
                    ) : (
                      <textarea
                        className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 min-h-[60px]"
                        value={pillar.flexZones}
                        onChange={(e) => updatePillar(idx, 'flexZones', e.target.value)}
                      />
                    )}
                  </td>
                  <td className="px-4 py-4 align-top text-rose-800 font-medium bg-rose-50/30">
                    {!isEditing ? (
                      pillar.dealbreakers
                    ) : (
                      <textarea
                        className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 min-h-[60px]"
                        value={pillar.dealbreakers}
                        onChange={(e) => updatePillar(idx, 'dealbreakers', e.target.value)}
                      />
                    )}
                  </td>
                  {isEditing && (
                    <td className="px-4 py-4 align-top text-center">
                      <button
                        onClick={() => removePillar(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                        title="Remove Pillar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {pillars.length === 0 && !isEditing && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-400 text-sm">
                    No pillars defined
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {isEditing && (
          <button
            onClick={addPillar}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-dashed border-slate-300 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition text-sm font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pillar</span>
          </button>
        )}
      </div>
    </div>
  );
};
