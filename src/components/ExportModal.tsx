import React, { useState } from 'react';
import { X, Download, Copy, Check, FileText, Send, Share2 } from 'lucide-react';
import { SourcingActionPlan } from '../types/sourcing';
import { formatPlanAsMarkdown, downloadMarkdownFile } from '../services/exportService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SourcingActionPlan;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, plan }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const markdownContent = formatPlanAsMarkdown(plan);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const generateSlackSummary = (p: SourcingActionPlan) => {
    return `*🚀 SOURCING STRATEGY KICKOFF: ${p.input.title}*
📍 *Location:* ${p.input.location || 'Flexible'} | 💼 *Seniority:* ${p.input.seniority || 'Senior'}

*🎯 TARGET PROFILE:*
${p.personaScorecard.targetProfile}

*📋 EVALUATION PILLARS & SCORECARD:*
${p.personaScorecard.pillars.map(pillar => `• *${pillar.pillar}* (${pillar.weight})\n  - Must-Haves: ${pillar.mustHaves}\n  - Flex: ${pillar.flexZones}\n  - Dealbreaker: ${pillar.dealbreakers}`).join('\n')}

*🏢 TARGET COMPANIES & SEGMENTS:*
${p.companyMapping.segments.map(seg => `• *${seg.segment}:* ${seg.companies.join(', ')} (Designations: ${seg.targetDesignations})`).join('\n')}

*⚡ DAY-1 CHECKLIST:*
${p.dayOneChecklist.map((c, i) => `${i + 1}. [${c.category}] ${c.text}`).join('\n')}
`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 relative max-h-[90vh] flex flex-col">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Export Sourcing Action Plan</h3>
            <p className="text-xs text-slate-500">Download or copy for ATS, Hiring Manager sync, or team Slack</p>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <button
            onClick={() => downloadMarkdownFile(plan)}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 text-left transition space-y-1.5 group shadow-2xs"
          >
            <div className="flex items-center justify-between text-blue-600">
              <Download className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 px-1.5 py-0.5 rounded text-blue-800">.md</span>
            </div>
            <div className="font-bold text-xs text-slate-900 group-hover:text-blue-600">Markdown</div>
          </button>

          <button
            onClick={() => {
              import('../services/exportService').then(({ downloadPDFFile }) => downloadPDFFile(plan));
            }}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-red-400 text-left transition space-y-1.5 group shadow-2xs"
          >
            <div className="flex items-center justify-between text-red-600">
              <Download className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 px-1.5 py-0.5 rounded text-red-800">.pdf</span>
            </div>
            <div className="font-bold text-xs text-slate-900 group-hover:text-red-600">PDF Document</div>
          </button>

          <button
            onClick={() => {
              import('../services/exportService').then(({ downloadDOCXFile }) => downloadDOCXFile(plan));
            }}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 text-left transition space-y-1.5 group shadow-2xs"
          >
            <div className="flex items-center justify-between text-blue-700">
              <Download className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 px-1.5 py-0.5 rounded text-blue-800">.docx</span>
            </div>
            <div className="font-bold text-xs text-slate-900 group-hover:text-blue-700">Word Document</div>
          </button>

          <button
            onClick={() => copyToClipboard(generateSlackSummary(plan), 'slack')}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 text-left transition space-y-1.5 group shadow-2xs"
          >
            <div className="flex items-center justify-between text-amber-600">
              {copiedType === 'slack' ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 px-1.5 py-0.5 rounded text-amber-800">Slack</span>
            </div>
            <div className="font-bold text-xs text-slate-900 group-hover:text-amber-600">
              {copiedType === 'slack' ? 'Copied Note!' : 'Copy Summary'}
            </div>
          </button>
        </div>

        {/* Markdown Preview Area */}
        <div className="flex-1 overflow-hidden flex flex-col space-y-1.5 min-h-[220px]">
          <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
            <span>Markdown Preview</span>
            <span className="text-[10px] text-slate-400">{markdownContent.length} characters</span>
          </div>
          <pre className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-y-auto font-mono text-[11px] text-slate-800 leading-relaxed whitespace-pre-wrap select-all">
            {markdownContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
