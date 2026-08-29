import React from 'react';
import { AlertTriangle, X, Save, Trash2 } from 'lucide-react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAndContinue: () => void;
  onDiscardAndContinue: () => void;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onClose,
  onSaveAndContinue,
  onDiscardAndContinue
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
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Unsaved Changes</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              You haven't saved your current Sourcing Strategy to the Vault. Would you like to save it before leaving?
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition text-sm"
          >
            Cancel
          </button>
          
          <button
            onClick={onDiscardAndContinue}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition text-sm flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Don't Save</span>
          </button>

          <button
            onClick={onSaveAndContinue}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm text-sm flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save to Vault</span>
          </button>
        </div>
      </div>
    </div>
  );
};
