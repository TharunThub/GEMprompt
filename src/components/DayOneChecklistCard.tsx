import React, { useState, useEffect } from 'react';
import { ListChecks, CheckCircle, Circle, Trophy, Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChecklistItem } from '../types/sourcing';

interface DayOneChecklistCardProps {
  checklist: ChecklistItem[];
  onUpdate?: (data: ChecklistItem[]) => void;
}

export const DayOneChecklistCard: React.FC<DayOneChecklistCardProps> = ({ checklist, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ChecklistItem[]>(checklist);

  useEffect(() => {
    setEditedData(checklist);
  }, [checklist]);

  const toggleItem = (id: string) => {
    if (isEditing) return;

    const updated = editedData.map(item => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    setEditedData(updated);
    if (onUpdate) {
      onUpdate(updated);
    }

    const allCompleted = updated.length > 0 && updated.every(i => i.completed);
    if (allCompleted) {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.8 }
      });
    }
  };

  const handleSave = () => {
    const cleaned = editedData.filter(item => item.text.trim() !== '');
    if (onUpdate) {
      onUpdate(cleaned);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(checklist);
    setIsEditing(false);
  };

  const handleItemChange = (index: number, field: 'text' | 'category', value: string) => {
    setEditedData(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddItem = () => {
    const newItem: ChecklistItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      text: '',
      category: 'Sourcing',
      completed: false
    };
    setEditedData(prev => [...prev, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setEditedData(prev => prev.filter((_, i) => i !== index));
  };

  const completedCount = editedData.filter(i => i.completed).length;
  const progressPercent = editedData.length > 0 ? Math.round((completedCount / editedData.length) * 100) : 0;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Sourcing':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Outreach':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Pipeline':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Sync':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="checklist" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
            <ListChecks className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Day-1 Execution Checklist
            </h3>
          </div>
        </div>

        {/* Action and Progress Area */}
        <div className="flex items-center space-x-4">
          {/* Edit / Save Button Group */}
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

          {/* Progress Badge */}
          <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
            <div className="text-right">
              <div className="text-sm font-extrabold text-slate-900">{completedCount} / {editedData.length} Done</div>
              <div className="text-xs text-slate-500 font-medium">{progressPercent}% Completed</div>
            </div>
            {progressPercent === 100 && editedData.length > 0 && (
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center animate-bounce shadow-sm">
                <Trophy className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
        <div
          className="bg-emerald-600 h-full transition-all duration-300 rounded-full shadow-xs"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {isEditing && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Manage Checklist Steps ({editedData.length})
            </span>
            <button
              onClick={handleAddItem}
              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Step</span>
            </button>
          </div>
        )}

        {editedData.map((item, idx) => (
          <div
            key={item.id || idx}
            onClick={() => !isEditing && toggleItem(item.id)}
            className={`p-4 sm:p-4.5 rounded-xl border transition ${
              isEditing ? 'bg-slate-50 border-slate-300 shadow-2xs' : 'cursor-pointer select-none'
            } ${
              !isEditing && item.completed
                ? 'bg-emerald-50/30 border-emerald-200 text-slate-500'
                : !isEditing
                ? 'bg-slate-50/70 border-slate-200 hover:border-blue-300 hover:bg-white text-slate-900 shadow-2xs'
                : ''
            }`}
          >
            {isEditing ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step {idx + 1}</span>
                    <select
                      value={item.category}
                      onChange={(e) => handleItemChange(idx, 'category', e.target.value as any)}
                      className="bg-white border border-slate-300 text-xs font-bold rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs cursor-pointer"
                    >
                      <option value="Sourcing">Sourcing</option>
                      <option value="Outreach">Outreach</option>
                      <option value="Pipeline">Pipeline</option>
                      <option value="Sync">Sync</option>
                    </select>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(idx);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Remove Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleItemChange(idx, 'text', e.target.value)}
                  placeholder="Checklist step description..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                />
              </div>
            ) : (
              <div className="flex items-start space-x-4">
                <div className="mt-0.5 flex-shrink-0">
                  {item.completed ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step {idx + 1}</span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${item.completed ? 'line-through text-slate-400' : 'font-bold text-slate-900'}`}>
                    {item.text}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {editedData.length === 0 && (
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl text-center text-xs text-slate-500 font-medium">
            No checklist items. {isEditing && 'Click "+ Add Step" above to create one.'}
          </div>
        )}
      </div>
    </div>
  );
};
