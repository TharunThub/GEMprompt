import React, { useState, useEffect } from 'react';
import { Building2, Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import { CompanyMappingMatrix, TargetSegment } from '../types/sourcing';

interface CompanyMappingCardProps {
  companyMapping: CompanyMappingMatrix;
  onUpdate?: (data: CompanyMappingMatrix) => void;
}

export const CompanyMappingCard: React.FC<CompanyMappingCardProps> = ({ companyMapping, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<CompanyMappingMatrix>(companyMapping);

  useEffect(() => {
    // Graceful fallback during transition
    if (companyMapping && Array.isArray((companyMapping as any).segments)) {
      setEditedData(companyMapping);
    } else {
      setEditedData({ segments: [] });
    }
  }, [companyMapping]);

  const handleSave = () => {
    if (onUpdate) onUpdate(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(companyMapping);
    setIsEditing(false);
  };

  const updateSegment = (index: number, field: keyof TargetSegment, value: any) => {
    setEditedData(prev => {
      const newSegments = [...prev.segments];
      newSegments[index] = { ...newSegments[index], [field]: value };
      return { ...prev, segments: newSegments };
    });
  };

  const addSegment = () => {
    setEditedData(prev => ({
      ...prev,
      segments: [
        ...prev.segments,
        { segment: 'New Segment', companies: [], businessUnits: '', targetDesignations: '', exclusions: '' }
      ]
    }));
  };

  const removeSegment = (index: number) => {
    setEditedData(prev => ({
      ...prev,
      segments: prev.segments.filter((_, i) => i !== index)
    }));
  };

  const segments = Array.isArray(editedData.segments) ? editedData.segments : [];

  return (
    <div id="companies" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Market Talent Mapping & Target Matrix
            </h3>
          </div>
        </div>

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

      <div className="space-y-4">
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-left text-sm whitespace-nowrap sm:whitespace-normal">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold w-1/5">Target Segment</th>
                <th className="px-4 py-3 font-semibold w-1/5">Priority Companies</th>
                <th className="px-4 py-3 font-semibold w-1/5">Target BU / Teams</th>
                <th className="px-4 py-3 font-semibold w-1/5">Target Designations</th>
                <th className="px-4 py-3 font-semibold w-1/5">Exclusions</th>
                {isEditing && <th className="px-4 py-3 font-semibold w-12 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {segments.map((seg, idx) => (
                <tr key={idx} className="bg-white">
                  <td className="px-4 py-4 align-top">
                    {!isEditing ? (
                      <span className="font-bold text-slate-900">{seg.segment}</span>
                    ) : (
                      <input
                        type="text"
                        className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                        value={seg.segment}
                        onChange={(e) => updateSegment(idx, 'segment', e.target.value)}
                      />
                    )}
                  </td>
                  <td className="px-4 py-4 align-top text-purple-900 font-medium">
                    {!isEditing ? (
                      <div className="flex flex-wrap gap-1">
                        {seg.companies.map((c, i) => (
                          <span key={i} className="bg-purple-50 border border-purple-200 text-purple-800 text-xs px-2 py-0.5 rounded">
                            {c}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <textarea
                        className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 min-h-[60px]"
                        value={seg.companies.join('\n')}
                        onChange={(e) => updateSegment(idx, 'companies', e.target.value.split('\n').filter(Boolean))}
                        placeholder="One company per line"
                      />
                    )}
                  </td>
                  <td className="px-4 py-4 align-top text-slate-700 font-medium">
                    {!isEditing ? (
                      seg.businessUnits
                    ) : (
                      <textarea
                        className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 min-h-[60px]"
                        value={seg.businessUnits}
                        onChange={(e) => updateSegment(idx, 'businessUnits', e.target.value)}
                      />
                    )}
                  </td>
                  <td className="px-4 py-4 align-top text-emerald-800 font-medium">
                    {!isEditing ? (
                      seg.targetDesignations
                    ) : (
                      <textarea
                        className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 min-h-[60px]"
                        value={seg.targetDesignations}
                        onChange={(e) => updateSegment(idx, 'targetDesignations', e.target.value)}
                      />
                    )}
                  </td>
                  <td className="px-4 py-4 align-top text-rose-800 font-medium bg-rose-50/20">
                    {!isEditing ? (
                      seg.exclusions
                    ) : (
                      <textarea
                        className="w-full text-sm p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 min-h-[60px]"
                        value={seg.exclusions}
                        onChange={(e) => updateSegment(idx, 'exclusions', e.target.value)}
                      />
                    )}
                  </td>
                  {isEditing && (
                    <td className="px-4 py-4 align-top text-center">
                      <button
                        onClick={() => removeSegment(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                        title="Remove Segment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {segments.length === 0 && !isEditing && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-400 text-sm">
                    No company segments defined
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {isEditing && (
          <button
            onClick={addSegment}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-dashed border-slate-300 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition text-sm font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Add Segment</span>
          </button>
        )}
      </div>
    </div>
  );
};
