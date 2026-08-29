import React, { useState } from 'react';
import { Mail, Copy, Check, Flame, Edit3, Eye } from 'lucide-react';
import { OutreachStrategy } from '../types/sourcing';

interface OutreachStrategyCardProps {
  outreach: OutreachStrategy;
}

export const OutreachStrategyCard: React.FC<OutreachStrategyCardProps> = ({ outreach }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [subject, setSubject] = useState(outreach.inMailTemplate.subject);
  const [body, setBody] = useState(outreach.inMailTemplate.body);

  const copyFullMessage = () => {
    const fullText = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderFormattedBody = (text: string) => {
    const parts = text.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span
            key={index}
            className="inline-block px-2 py-0.5 mx-0.5 rounded-md bg-blue-100 text-blue-900 border border-blue-250 font-mono text-xs font-bold shadow-2xs"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div id="outreach" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Outreach Strategy & InMail
            </h3>
          </div>
        </div>

        {/* Copy All Button */}
        <button
          onClick={copyFullMessage}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-2xs ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied InMail!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-amber-500" />
              <span>Copy Template</span>
            </>
          )}
        </button>
      </div>

      {/* Value Proposition / Hooks */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm font-extrabold uppercase tracking-wider text-amber-800">
          <Flame className="w-4 h-4 text-amber-600" />
          <span>Top 2 Value Proposition Selling Hooks</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outreach.valueProposition.map((hook, idx) => (
            <div
              key={idx}
              className="bg-amber-50/50 border border-amber-200 p-4 rounded-xl flex items-start space-x-3 shadow-2xs"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-200 text-amber-950 font-extrabold text-xs flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="text-sm text-slate-800 font-medium leading-relaxed">
                {hook}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cold Outreach InMail Template */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-blue-600" />
            3-Paragraph Cold InMail Template
          </span>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1 font-bold"
          >
            {isEditing ? (
              <>
                <Eye className="w-4 h-4" />
                <span>Preview Mode</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Edit Template</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-5 space-y-4">
          {/* Subject Line */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Subject Line
            </label>
            {isEditing ? (
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            ) : (
              <div className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 select-all shadow-2xs">
                {renderFormattedBody(subject)}
              </div>
            )}
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              InMail Body
            </label>
            {isEditing ? (
              <textarea
                rows={8}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-3.5 text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            ) : (
              <div className="bg-white border border-slate-200 rounded-lg p-5 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap select-all font-sans shadow-2xs">
                {renderFormattedBody(body)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
