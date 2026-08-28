import React from 'react';
import { Building2, Ban, Target, AlertOctagon } from 'lucide-react';
import { CompanyMapping } from '../types/sourcing';

interface CompanyMappingCardProps {
  companyMapping: CompanyMapping;
}

export const CompanyMappingCard: React.FC<CompanyMappingCardProps> = ({ companyMapping }) => {
  return (
    <div id="companies" className="bg-white border border-blue-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shadow-2xs">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                Section 3
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Target & Off-Limits Company Mapping
              </h3>
            </div>
            <p className="text-sm text-slate-500 font-medium mt-1">
              High-conviction talent poaching grounds and restricted organizations
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Target Companies */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center space-x-2 text-sm font-extrabold uppercase tracking-wider text-emerald-800">
            <Target className="w-4 h-4 text-emerald-600" />
            <span>Target Companies to Poach From ({companyMapping.targetCompanies.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {companyMapping.targetCompanies.map((company, idx) => (
              <div
                key={idx}
                className="bg-slate-50/80 border border-slate-200 hover:border-blue-300 p-4 rounded-xl transition space-y-1.5 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-base text-slate-900">{company.name}</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {company.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {company.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Exclusions & Off-Limits */}
        <div className="space-y-3.5">
          <div className="flex items-center space-x-2 text-sm font-extrabold uppercase tracking-wider text-rose-800">
            <Ban className="w-4 h-4 text-rose-600" />
            <span>Exclusions & Off-Limits</span>
          </div>

          <div className="space-y-3">
            {companyMapping.exclusions.map((exclusion, idx) => (
              <div
                key={idx}
                className="bg-rose-50/50 border border-rose-200 p-4 rounded-xl space-y-1 shadow-2xs"
              >
                <div className="flex items-center space-x-2 text-rose-950 font-bold text-sm">
                  <AlertOctagon className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{exclusion.name}</span>
                </div>
                <p className="text-xs text-rose-800/80 leading-relaxed font-medium">
                  {exclusion.reason}
                </p>
              </div>
            ))}

            {companyMapping.exclusions.length === 0 && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center text-xs text-slate-500 font-medium">
                No off-limits companies specified in intake notes.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
