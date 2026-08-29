import React from 'react';
import { RefreshCw, FileWarning, Edit3, X } from 'lucide-react';

interface RegeneratePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (keepEdits: boolean) => void;
}

export const RegeneratePromptModal: React.FC<RegeneratePromptModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 border border-amber-100">
            <FileWarning className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Regenerate Action Plan</h3>
            <p className="text-sm text-slate-500 mt-0.5">How would you like to handle your existing plan data?</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onConfirm(true)}
            className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-900 group-hover:text-blue-700">Keep manual edits (Merge)</span>
              <Edit3 className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
            </div>
            <p className="text-xs text-slate-500 group-hover:text-blue-600">
              Only regenerate missing or unedited parts. Preserve any manual changes made to the current sections.
            </p>
          </button>

          <button
            onClick={() => onConfirm(false)}
            className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-red-500 hover:bg-red-50 transition group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-900 group-hover:text-red-700">Completely new (Overwrite)</span>
              <RefreshCw className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
            </div>
            <p className="text-xs text-slate-500 group-hover:text-red-600">
              Discard all current sections and manual edits, and write a completely fresh plan from scratch.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
