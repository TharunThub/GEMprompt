import React, { useState } from 'react';
import { Search, Copy, Check, ExternalLink } from 'lucide-react';
import { BooleanSearchSection, BooleanStringPlatformVariants } from '../types/sourcing';

interface BooleanStringsCardProps {
  booleanStrings: BooleanSearchSection;
}

type PlatformTab = 'linkedInRecruiter' | 'naukri' | 'googleXray' | 'standard';

export const BooleanStringsCard: React.FC<BooleanStringsCardProps> = ({ booleanStrings }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [platform1, setPlatform1] = useState<PlatformTab>('linkedInRecruiter');
  const [platform2, setPlatform2] = useState<PlatformTab>('linkedInRecruiter');
  const [platform3, setPlatform3] = useState<PlatformTab>('linkedInRecruiter');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const renderStringBlock = (
    title: string,
    badgeText: string,
    badgeColor: string,
    stringData: BooleanStringPlatformVariants & { description: string },
    currentPlatform: PlatformTab,
    setPlatform: (p: PlatformTab) => void,
    sectionKey: string
  ) => {
    const activeString = stringData[currentPlatform] || stringData.standard;
    const isCopied = copiedKey === `${sectionKey}-${currentPlatform}`;

    return (
      <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-5 space-y-3.5 shadow-2xs">
        {/* Header with Title & Platform Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${badgeColor} border shadow-2xs`}>
                {badgeText}
              </span>
              <h4 className="text-base font-bold text-slate-900">{title}</h4>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">{stringData.description}</p>
          </div>

          {/* Platform Tabs */}
          <div className="flex items-center bg-white border border-slate-200 p-1 rounded-lg self-start sm:self-auto shadow-2xs">
            <button
              onClick={() => setPlatform('linkedInRecruiter')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                currentPlatform === 'linkedInRecruiter'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              LinkedIn
            </button>
            <button
              onClick={() => setPlatform('naukri')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                currentPlatform === 'naukri'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Naukri
            </button>
            <button
              onClick={() => setPlatform('googleXray')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                currentPlatform === 'googleXray'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Google X-Ray
            </button>
            <button
              onClick={() => setPlatform('standard')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                currentPlatform === 'standard'
                  ? 'bg-slate-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Standard
            </button>
          </div>
        </div>

        {/* Code / String Preview Box */}
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
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition shadow-2xs ${
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
      </div>
    );
  };

  return (
    <div id="boolean" className="bg-white border border-blue-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                Section 2
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Boolean Search Strings Engine
              </h3>
            </div>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Copy-paste ready search strings tailored for LinkedIn Recruiter, Naukri, and Google X-ray
            </p>
          </div>
        </div>
      </div>

      {/* 3 Tier Strings */}
      <div className="space-y-4">
        {renderStringBlock(
          'String 1: Broad / Standard Search',
          'Standard Reach',
          'bg-blue-50 text-blue-700 border-blue-200',
          booleanStrings.broadSearch,
          platform1,
          setPlatform1,
          'str1'
        )}

        {renderStringBlock(
          'String 2: Targeted / Niche Search',
          'High Precision',
          'bg-purple-50 text-purple-700 border-purple-200',
          booleanStrings.targetedSearch,
          platform2,
          setPlatform2,
          'str2'
        )}

        {renderStringBlock(
          'String 3: Diversity / Out-of-the-Box Search',
          'Adjacent Pools',
          'bg-emerald-50 text-emerald-700 border-emerald-200',
          booleanStrings.diversitySearch,
          platform3,
          setPlatform3,
          'str3'
        )}
      </div>
    </div>
  );
};
