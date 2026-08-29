import React, { useState, useEffect } from 'react';
import { Building2, Ban, Target, AlertOctagon, Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import { CompanyMapping } from '../types/sourcing';

interface CompanyMappingCardProps {
  companyMapping: CompanyMapping;
  onUpdate?: (data: CompanyMapping) => void;
}

export const CompanyMappingCard: React.FC<CompanyMappingCardProps> = ({ companyMapping, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<CompanyMapping>(companyMapping);

  useEffect(() => {
    setEditedData(companyMapping);
  }, [companyMapping]);

  const handleSave = () => {
    const cleanedData: CompanyMapping = {
      targetCompanies: editedData.targetCompanies.filter(c => c.name.trim() !== ''),
      exclusions: editedData.exclusions.filter(e => e.name.trim() !== '')
    };
    if (onUpdate) {
      onUpdate(cleanedData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(companyMapping);
    setIsEditing(false);
  };

  const handleTargetCompanyChange = (index: number, field: 'name' | 'category' | 'rationale', value: string) => {
    setEditedData(prev => {
      const updated = [...prev.targetCompanies];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, targetCompanies: updated };
    });
  };

  const handleAddTargetCompany = () => {
    setEditedData(prev => ({
      ...prev,
      targetCompanies: [...prev.targetCompanies, { name: '', category: 'Direct Competitor', rationale: '' }]
    }));
  };

  const handleRemoveTargetCompany = (index: number) => {
    setEditedData(prev => ({
      ...prev,
      targetCompanies: prev.targetCompanies.filter((_, i) => i !== index)
    }));
  };

  const handleExclusionChange = (index: number, field: 'name' | 'reason', value: string) => {
    setEditedData(prev => {
      const updated = [...prev.exclusions];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, exclusions: updated };
    });
  };

  const handleAddExclusion = () => {
    setEditedData(prev => ({
      ...prev,
      exclusions: [...prev.exclusions, { name: '', reason: '' }]
    }));
  };

  const handleRemoveExclusion = (index: number) => {
    setEditedData(prev => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, i) => i !== index)
    }));
  };

  return (
    <div id="companies" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Target Company Mapping
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Target Companies */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm font-extrabold uppercase tracking-wider text-emerald-800">
              <Target className="w-4 h-4 text-emerald-600" />
              <span>Target Companies to Poach From ({editedData.targetCompanies.length})</span>
            </div>
            {isEditing && (
              <button
                onClick={handleAddTargetCompany}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center space-x-1 transition shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Company</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {editedData.targetCompanies.map((company, idx) => (
              <div
                key={idx}
                className="bg-slate-50/80 border border-slate-200 hover:border-blue-300 p-4 rounded-xl transition space-y-2.5 shadow-2xs"
              >
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={company.name}
                        onChange={(e) => handleTargetCompanyChange(idx, 'name', e.target.value)}
                        placeholder="Company Name"
                        className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                      />
                      <button
                        onClick={() => handleRemoveTargetCompany(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Remove Company"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={company.category}
                      onChange={(e) => handleTargetCompanyChange(idx, 'category', e.target.value)}
                      placeholder="Category e.g. Tier 1 Unicorn / FinTech"
                      className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1 text-xs font-medium text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
                    />
                    <textarea
                      rows={2}
                      value={company.rationale}
                      onChange={(e) => handleTargetCompanyChange(idx, 'rationale', e.target.value)}
                      placeholder="Talent fit / rationale..."
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-base text-slate-900">{company.name}</span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {company.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {company.rationale}
                    </p>
                  </>
                )}
              </div>
            ))}

            {editedData.targetCompanies.length === 0 && (
              <div className="sm:col-span-2 bg-slate-50 border border-slate-200 p-6 rounded-xl text-center text-xs text-slate-500 font-medium">
                No target companies listed.
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Exclusions & Off-Limits */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm font-extrabold uppercase tracking-wider text-rose-800">
              <Ban className="w-4 h-4 text-rose-600" />
              <span>Exclusions & Off-Limits ({editedData.exclusions.length})</span>
            </div>
            {isEditing && (
              <button
                onClick={handleAddExclusion}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center space-x-1 transition shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Exclusion</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {editedData.exclusions.map((exclusion, idx) => (
              <div
                key={idx}
                className="bg-rose-50/50 border border-rose-200 p-4 rounded-xl space-y-2 shadow-2xs"
              >
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={exclusion.name}
                        onChange={(e) => handleExclusionChange(idx, 'name', e.target.value)}
                        placeholder="Excluded Company Name"
                        className="flex-1 bg-white border border-rose-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500/20 shadow-2xs"
                      />
                      <button
                        onClick={() => handleRemoveExclusion(idx)}
                        className="p-1.5 text-rose-400 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                        title="Remove Exclusion"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={exclusion.reason}
                      onChange={(e) => handleExclusionChange(idx, 'reason', e.target.value)}
                      placeholder="Reason (e.g. Non-poach pact, poor cultural fit)..."
                      className="w-full bg-white border border-rose-300 rounded-lg p-2 text-xs text-rose-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 shadow-2xs"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-2 text-rose-950 font-bold text-sm">
                      <AlertOctagon className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>{exclusion.name}</span>
                    </div>
                    <p className="text-xs text-rose-800/80 leading-relaxed font-medium">
                      {exclusion.reason}
                    </p>
                  </>
                )}
              </div>
            ))}

            {editedData.exclusions.length === 0 && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center text-xs text-slate-500 font-medium">
                No off-limits companies specified.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
