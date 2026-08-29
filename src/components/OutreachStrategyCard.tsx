import React, { useState, useEffect } from 'react';
import { Mail, Copy, Check, Flame, Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import { OutreachStrategy } from '../types/sourcing';

interface OutreachStrategyCardProps {
  outreach: OutreachStrategy;
  onUpdate?: (data: OutreachStrategy) => void;
}

export const OutreachStrategyCard: React.FC<OutreachStrategyCardProps> = ({ outreach, onUpdate }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<OutreachStrategy>(outreach);

  useEffect(() => {
    setEditedData(outreach);
  }, [outreach]);

  const copyFullMessage = () => {
    const fullText = `Subject: ${editedData.inMailTemplate.subject}\n\n${editedData.inMailTemplate.body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const cleanedData: OutreachStrategy = {
      ...editedData,
      valueProposition: editedData.valueProposition.map(s => s.trim()).filter(Boolean),
      inMailTemplate: {
        subject: editedData.inMailTemplate.subject.trim(),
        body: editedData.inMailTemplate.body.trim()
      }
    };
    if (onUpdate) {
      onUpdate(cleanedData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(outreach);
    setIsEditing(false);
  };

  const handleHookChange = (index: number, value: string) => {
    const updated = [...editedData.valueProposition];
    updated[index] = value;
    setEditedData({ ...editedData, valueProposition: updated });
  };

  const handleAddHook = () => {
    setEditedData({
      ...editedData,
      valueProposition: [...editedData.valueProposition, '']
    });
  };

  const handleRemoveHook = (index: number) => {
    setEditedData({
      ...editedData,
      valueProposition: editedData.valueProposition.filter((_, i) => i !== index)
    });
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
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

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
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

          {/* Copy All Button */}
          <button
            onClick={copyFullMessage}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-2xs cursor-pointer ${
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
      </div>

      {/* Value Proposition / Hooks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm font-extrabold uppercase tracking-wider text-amber-800">
            <Flame className="w-4 h-4 text-amber-600" />
            <span>Top Value Proposition Selling Hooks</span>
          </div>
          {isEditing && (
            <button
              onClick={handleAddHook}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 flex items-center space-x-1 transition shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Hook</span>
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {editedData.valueProposition.map((hook, idx) => (
            <div
              key={idx}
              className="bg-amber-50/50 border border-amber-200 p-4 rounded-xl flex items-start space-x-3 shadow-2xs"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-200 text-amber-950 font-extrabold text-xs flex items-center justify-center mt-0.5">
                {idx + 1}
              </span>
              {isEditing ? (
                <div className="flex-1 flex items-start space-x-2">
                  <textarea
                    rows={3}
                    value={hook}
                    onChange={(e) => handleHookChange(idx, e.target.value)}
                    placeholder={`Selling hook #${idx + 1}...`}
                    className="flex-1 bg-white border border-amber-300 rounded-lg p-2.5 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
                  />
                  <button
                    onClick={() => handleRemoveHook(idx)}
                    className="p-1.5 text-amber-700/60 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Remove Hook"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className="text-sm text-slate-800 font-medium leading-relaxed">
                  {hook}
                </span>
              )}
            </div>
          ))}

          {editedData.valueProposition.length === 0 && (
            <div className="md:col-span-2 bg-amber-50/30 border border-amber-200 p-4 rounded-xl text-center text-xs text-amber-800/80 font-medium">
              No value proposition selling hooks specified.
            </div>
          )}
        </div>
      </div>

      {/* Cold Outreach InMail Template */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-blue-600" />
            3-Paragraph Cold InMail Template
          </span>
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
                value={editedData.inMailTemplate.subject}
                onChange={(e) => setEditedData({
                  ...editedData,
                  inMailTemplate: { ...editedData.inMailTemplate, subject: e.target.value }
                })}
                placeholder="Subject line with [Placeholders]..."
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            ) : (
              <div className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 select-all shadow-2xs">
                {renderFormattedBody(editedData.inMailTemplate.subject)}
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
                value={editedData.inMailTemplate.body}
                onChange={(e) => setEditedData({
                  ...editedData,
                  inMailTemplate: { ...editedData.inMailTemplate, body: e.target.value }
                })}
                placeholder="InMail body template with [Candidate Name], [Company], etc..."
                className="w-full bg-white border border-slate-300 rounded-lg p-3.5 text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
            ) : (
              <div className="bg-white border border-slate-200 rounded-lg p-5 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap select-all font-sans shadow-2xs">
                {renderFormattedBody(editedData.inMailTemplate.body)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
