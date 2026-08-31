import React, { useState, useEffect } from 'react';
import { Search, Copy, Check, ExternalLink, Edit3, Save, X } from 'lucide-react';
import { BooleanSearchSection, BooleanStringPlatformVariants } from '../types/sourcing';

interface BooleanStringsCardProps {
  booleanStrings: BooleanSearchSection;
  onUpdate?: (data: BooleanSearchSection) => void;
}

type PlatformTab = 'linkedInRecruiter' | 'naukri' | 'googleXray';

export const BooleanStringsCard: React.FC<BooleanStringsCardProps> = ({ booleanStrings, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<BooleanSearchSection>(booleanStrings);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [platform1, setPlatform1] = useState<PlatformTab>('linkedInRecruiter');
  const [platform2, setPlatform2] = useState<PlatformTab>('linkedInRecruiter');
  const [platform3, setPlatform3] = useState<PlatformTab>('linkedInRecruiter');

  useEffect(() => {
    setEditedData(booleanStrings);
  }, [booleanStrings]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(booleanStrings);
    setIsEditing(false);
  };

  const handleStringChange = (
    sectionKey: 'broadSearch' | 'targetedSearch' | 'diversitySearch',
    platform: PlatformTab,
    val: string
  ) => {
    setEditedData(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [platform]: val
      }
    }));
  };

  const handleDescChange = (
    sectionKey: 'broadSearch' | 'targetedSearch' | 'diversitySearch',
    val: string
  ) => {
    setEditedData(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        description: val
      }
    }));
  };

  const handleNaukriFilterChange = (
    key: keyof BooleanSearchSection['naukriFilters'],
    value: string
  ) => {
    setEditedData(prev => ({
      ...prev,
      naukriFilters: {
        ...(prev.naukriFilters || {
          experience: '',
          location: '',
          noticePeriod: '',
          salary: '',
          activePeriod: ''
        }),
        [key]: value
      }
    }));
  };

  const renderStringBlock = (
    title: string,
    badgeText: string,
    badgeColor: string,
    stringData: BooleanStringPlatformVariants & { description: string },
    currentPlatform: PlatformTab,
    setPlatform: (p: PlatformTab) => void,
    sectionKey: 'broadSearch' | 'targetedSearch' | 'diversitySearch'
  ) => {
    const activeString = stringData[currentPlatform] || '';
    const isCopied = copiedKey === `${sectionKey}-${currentPlatform}`;

    return (
      <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-5 space-y-3.5 shadow-2xs">
        {/* Header with Title & Platform Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 min-w-0 mr-2">
            <div className="flex items-center space-x-2.5">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${badgeColor} border shadow-2xs`}>
                {badgeText}
              </span>
              <h4 className="text-base font-bold text-slate-900">{title}</h4>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={stringData.description}
                onChange={(e) => handleDescChange(sectionKey, e.target.value)}
                placeholder="Description / use case..."
                className="mt-1.5 w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            ) : (
              <p className="text-xs text-slate-500 font-medium mt-1">{stringData.description}</p>
            )}
          </div>

          {/* Platform Tabs */}
          <div className="flex items-center bg-white border border-slate-200 p-1 rounded-lg self-start sm:self-auto shadow-2xs shrink-0">
            <button
              onClick={() => setPlatform('linkedInRecruiter')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
                currentPlatform === 'linkedInRecruiter'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              LinkedIn
            </button>
            <button
              onClick={() => setPlatform('naukri')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
                currentPlatform === 'naukri'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Naukri
            </button>
            <button
              onClick={() => setPlatform('googleXray')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
                currentPlatform === 'googleXray'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Google X-Ray
            </button>
          </div>
        </div>

        {/* Code / String Preview & Edit Box */}
        {isEditing ? (
          <div className="space-y-1.5">
            <textarea
              rows={4}
              value={activeString}
              onChange={(e) => handleStringChange(sectionKey, currentPlatform, e.target.value)}
              className="w-full bg-white border border-blue-300 rounded-xl p-3.5 font-mono text-xs sm:text-[13px] text-blue-950 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              placeholder={`Enter ${currentPlatform} boolean search string...`}
            />
            <div className="text-[11px] text-slate-500 font-medium flex justify-between">
              <span>Editing: <strong className="text-slate-700">{currentPlatform}</strong> variant</span>
              <span>Switch tabs above to edit other platform variants</span>
            </div>
          </div>
        ) : (
          <div className="relative group bg-white border border-blue-150 rounded-xl p-4 shadow-2xs">
            <div className="font-mono text-xs sm:text-[13px] text-blue-950 break-words leading-relaxed pr-24 whitespace-pre-wrap select-all font-semibold">
              {activeString}
            </div>

            <div className="absolute top-3 right-3 flex items-center space-x-1.5">
              {currentPlatform === 'googleXray' && (
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(activeString)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 flex items-center space-x-1 transition shadow-2xs"
                  title="Search X-Ray on Google"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Search</span>
                </a>
              )}

              <button
                onClick={() => copyToClipboard(activeString, `${sectionKey}-${currentPlatform}`)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition shadow-2xs cursor-pointer ${
                  isCopied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="boolean" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Boolean Search Strings
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

      {/* 3 Tier Strings */}
      <div className="space-y-4">
        {renderStringBlock(
          'String 1: Broad / Standard Search',
          'Standard Reach',
          'bg-blue-50 text-blue-700 border-blue-200',
          editedData.broadSearch,
          platform1,
          setPlatform1,
          'broadSearch'
        )}

        {renderStringBlock(
          'String 2: Targeted / Niche Search',
          'High Precision',
          'bg-purple-50 text-purple-700 border-purple-200',
          editedData.targetedSearch,
          platform2,
          setPlatform2,
          'targetedSearch'
        )}

        {renderStringBlock(
          'String 3: Diversity / Out-of-the-Box Search',
          'Adjacent Pools',
          'bg-emerald-50 text-emerald-700 border-emerald-200',
          editedData.diversitySearch,
          platform3,
          setPlatform3,
          'diversitySearch'
        )}
      </div>

      {/* Naukri Resdex Platform Filters */}
      <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl p-5 space-y-3.5 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs">
            Naukri Filters
          </span>
          <h4 className="text-base font-bold text-slate-900">Resdex Search & Sourcing Filters</h4>
        </div>

        {!isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Experience</span>
              <p className="text-xs font-semibold text-slate-800">{editedData.naukriFilters?.experience || 'N/A'}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Location Hubs</span>
              <p className="text-xs font-semibold text-slate-800">{editedData.naukriFilters?.location || 'N/A'}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Notice Period</span>
              <p className="text-xs font-semibold text-slate-800">{editedData.naukriFilters?.noticePeriod || 'N/A'}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Salary / CTC Band</span>
              <p className="text-xs font-semibold text-slate-800">{editedData.naukriFilters?.salary || 'N/A'}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs space-y-1 sm:col-span-2 lg:col-span-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Candidate Activity</span>
              <p className="text-xs font-semibold text-slate-800">{editedData.naukriFilters?.activePeriod || 'N/A'}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Experience</label>
              <input
                type="text"
                value={editedData.naukriFilters?.experience || ''}
                onChange={(e) => handleNaukriFilterChange('experience', e.target.value)}
                placeholder="e.g. 5-8 Years"
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Location Hubs</label>
              <input
                type="text"
                value={editedData.naukriFilters?.location || ''}
                onChange={(e) => handleNaukriFilterChange('location', e.target.value)}
                placeholder="e.g. Bengaluru, Hyderabad"
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Notice Period</label>
              <input
                type="text"
                value={editedData.naukriFilters?.noticePeriod || ''}
                onChange={(e) => handleNaukriFilterChange('noticePeriod', e.target.value)}
                placeholder="e.g. 0-30 Days / Serving"
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Salary / CTC Band</label>
              <input
                type="text"
                value={editedData.naukriFilters?.salary || ''}
                onChange={(e) => handleNaukriFilterChange('salary', e.target.value)}
                placeholder="e.g. 35-50 LPA"
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
              />
            </div>
            <div className="space-y-1 sm:col-span-2 lg:col-span-2">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Candidate Activity</label>
              <input
                type="text"
                value={editedData.naukriFilters?.activePeriod || ''}
                onChange={(e) => handleNaukriFilterChange('activePeriod', e.target.value)}
                placeholder="e.g. Active in last 30 days"
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
