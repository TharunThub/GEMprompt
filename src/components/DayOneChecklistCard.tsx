import React, { useState } from 'react';
import { ListChecks, CheckCircle, Circle, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChecklistItem } from '../types/sourcing';

interface DayOneChecklistCardProps {
  checklist: ChecklistItem[];
}

export const DayOneChecklistCard: React.FC<DayOneChecklistCardProps> = ({ checklist: initialList }) => {
  const [items, setItems] = useState<ChecklistItem[]>(initialList);

  const toggleItem = (id: string) => {
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    setItems(updated);

    const allCompleted = updated.every(i => i.completed);
    if (allCompleted) {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.8 }
      });
    }
  };

  const completedCount = items.filter(i => i.completed).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

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

        {/* Progress Badge */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-extrabold text-slate-900">{completedCount} / {items.length} Done</div>
            <div className="text-xs text-slate-500 font-medium">{progressPercent}% Completed</div>
          </div>
          {progressPercent === 100 && (
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center animate-bounce shadow-sm">
              <Trophy className="w-5 h-5" />
            </div>
          )}
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
        {items.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-4 sm:p-4.5 rounded-xl border transition cursor-pointer flex items-start space-x-4 select-none ${
              item.completed
                ? 'bg-emerald-50/30 border-emerald-200 text-slate-500'
                : 'bg-slate-50/70 border-slate-200 hover:border-blue-300 hover:bg-white text-slate-900 shadow-2xs'
            }`}
          >
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
        ))}
      </div>
    </div>
  );
};
