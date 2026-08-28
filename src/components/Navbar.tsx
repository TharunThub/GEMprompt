import React, { useState, useRef, useEffect } from 'react';
import {
  Gem,
  Settings,
  User,
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onOpenSettings: () => void;
  onHomeClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSettings,
  onHomeClick
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-blue-100/80 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          
          {/* Left: GEMprompt Logo Only */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none group"
            onClick={onHomeClick}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white group-hover:scale-105 transition">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight font-sans">
                  GEM<span className="text-blue-600 font-bold">prompt</span>
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  AI Sourcing
                </span>
              </div>
            </div>
          </div>

          {/* Right: Account / Profile Avatar with Settings Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-100 border border-slate-200/80 transition shadow-2xs"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                GR
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-800 leading-tight">GEM Recruiter</div>
                <div className="text-[10px] text-slate-500 font-medium">Talent Lead</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">GEM Recruiter Workspace</p>
                  <p className="text-[11px] text-slate-500">recruiter@company.com</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                  >
                    <Settings className="w-4 h-4 text-blue-600" />
                    <span>AI Engine & API Settings</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <div className="px-3 py-1.5 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Engine: Local Smart NLP</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
