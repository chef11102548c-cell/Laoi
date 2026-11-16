import React from 'react';
import { Wine, RotateCcw, Sparkles } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border-b border-rose-500/20 py-5 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/25 ring-2 ring-rose-400/30">
            <Wine className="w-7 h-7 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-rose-100 to-rose-400 bg-clip-text text-transparent">
                หารค่าเหล้า-ค่าน้ำแข็ง
              </h1>
              <span className="text-xl">🍻🧊</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-1 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 inline" />
              แยกสายดื่ม & สายมิกเซอร์ โปร่งใส จ่ายง่าย สบายใจทั้งวง
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-800/80 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700/60 hover:border-rose-500/30 transition-all shadow-sm active:scale-95"
          title="เริ่มบิลใหม่"
        >
          <RotateCcw className="w-4 h-4 text-rose-400" />
          ล้างบิล / เริ่มใหม่
        </button>
      </div>
    </header>
  );
};
