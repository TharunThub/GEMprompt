import React, { useState } from 'react';
import { X, Bookmark, Trash2, Calendar, MapPin, ArrowRight, Search, FileText } from 'lucide-react';
import { SourcingActionPlan } from '../types/sourcing';

interface SavedRequisitionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlans: SourcingActionPlan[];
  onLoadPlan: (plan: SourcingActionPlan) => void;
  onDeletePlan: (id: string) => void;
}

export const SavedRequisitionsModal: React.FC<SavedRequisitionsModalProps> = ({
  isOpen,
  onClose,
  savedPlans,
  onLoadPlan,
  onDeletePlan
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredPlans = savedPlans.filter(p =>
    p.input.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.input.location && p.input.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 relative max-h-[85vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Requisition Sourcing Vault</h3>
            <p className="text-xs text-slate-500">
              {savedPlans.length} saved sourcing action {savedPlans.length === 1 ? 'plan' : 'plans'}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search saved requisitions by role title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* List of Plans */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredPlans.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              {savedPlans.length === 0
                ? 'No saved plans yet. Generate a sourcing action plan and it will be saved to your vault automatically.'
                : 'No requisitions matching your search filter.'}
            </div>
          ) : (
            filteredPlans.map(plan => (
              <div
                key={plan.id}
                className="bg-slate-50/70 border border-slate-200 hover:border-blue-300 p-4 rounded-xl flex items-center justify-between gap-4 transition group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 truncate group-hover:text-blue-600 transition">
                    {plan.input.title}
                  </h4>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-500 flex-wrap gap-y-1">
                    {plan.input.location && (
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{plan.input.location}</span>
                      </span>
                    )}
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{new Date(plan.createdAt).toLocaleDateString()}</span>
                    </span>
                    <span className="px-2 py-0.2 rounded bg-white text-slate-600 border border-slate-200 font-mono text-[10px]">
                      {plan.companyMapping.targetCompanies.length} Target Co.
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => onDeletePlan(plan.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      onLoadPlan(plan);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1 transition shadow-2xs"
                  >
                    <span>Load</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
