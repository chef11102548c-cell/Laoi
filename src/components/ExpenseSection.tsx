import React, { useState } from 'react';
import { ExpenseCategory, ExpenseItem } from '../types/bill';
import {
  Receipt,
  Plus,
  Trash2,
  Wine,
  Snowflake,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';

interface ExpenseSectionProps {
  alcoholAmount: number;
  sharedAmount: number;
  onUpdateAlcoholAmount: (amount: number) => void;
  onUpdateSharedAmount: (amount: number) => void;
  items: ExpenseItem[];
  onAddItem: (title: string, category: ExpenseCategory, amount: number) => void;
  onUpdateItem: (id: string, updated: Partial<ExpenseItem>) => void;
  onRemoveItem: (id: string) => void;
}

export const ExpenseSection: React.FC<ExpenseSectionProps> = ({
  alcoholAmount,
  sharedAmount,
  onUpdateAlcoholAmount,
  onUpdateSharedAmount,
  items,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}) => {
  const [showDetailedItems, setShowDetailedItems] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ExpenseCategory>('shared');
  const [newAmount, setNewAmount] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(newAmount);
    if (!newTitle.trim() || isNaN(parsed) || parsed <= 0) return;

    onAddItem(newTitle.trim(), newCategory, parsed);
    setNewTitle('');
    setNewAmount('');
  };

  // Quick adjust alcohol
  const addAlcohol = (val: number) => {
    onUpdateAlcoholAmount(Math.max(0, (alcoholAmount || 0) + val));
  };

  // Quick adjust shared
  const addShared = (val: number) => {
    onUpdateSharedAmount(Math.max(0, (sharedAmount || 0) + val));
  };

  const itemsAlcohol = items
    .filter(i => i.category === 'alcohol')
    .reduce((s, i) => s + i.amount, 0);

  const itemsShared = items
    .filter(i => i.category === 'shared')
    .reduce((s, i) => s + i.amount, 0);

  const totalAlcohol = (alcoholAmount || 0) + itemsAlcohol;
  const totalShared = (sharedAmount || 0) + itemsShared;

  return (
    <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <span>ค่าเหล้า & ค่าน้ำแข็ง</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono">
                กรอกยอดได้เอง
              </span>
            </h2>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>พิมพ์แก้ไขตัวเลขได้ทันที</span>
        </div>
      </div>

      {/* Main Direct Inputs: Alcohol & Ice */}
      <div className="grid grid-cols-1 gap-3.5">
        {/* 1. Alcohol Input Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-950/80 to-slate-900 border-2 border-rose-500/30 shadow-lg hover:border-rose-500/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-rose-300 flex items-center gap-1.5">
              <Wine className="w-4 h-4 text-rose-400" />
              <span>ค่าเหล้า / เบียร์ (Alcohol)</span>
            </label>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-medium border border-rose-500/30">
              🍺 คิดเฉพาะคนดื่ม
            </span>
          </div>

          <div className="relative mb-2.5">
            <input
              type="number"
              min="0"
              step="any"
              value={alcoholAmount === 0 ? '' : alcoholAmount}
              onChange={e => onUpdateAlcoholAmount(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-full bg-slate-950 border border-rose-500/40 focus:border-rose-400 rounded-xl px-4 py-2.5 text-2xl font-extrabold font-mono text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all placeholder-slate-700"
            />
            <span className="absolute right-4 top-3 text-sm font-semibold text-slate-400">
              บาท
            </span>
          </div>

          {/* Quick Add Buttons for Alcohol */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-400 mr-1">ปุ่มลัด:</span>
            <button
              type="button"
              onClick={() => addAlcohol(100)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-300 hover:text-rose-200 border border-slate-700/80 hover:border-rose-500/40 transition-all active:scale-95"
            >
              +100
            </button>
            <button
              type="button"
              onClick={() => addAlcohol(390)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-300 hover:text-rose-200 border border-slate-700/80 hover:border-rose-500/40 transition-all active:scale-95"
            >
              +390 (Blend)
            </button>
            <button
              type="button"
              onClick={() => addAlcohol(500)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-300 hover:text-rose-200 border border-slate-700/80 hover:border-rose-500/40 transition-all active:scale-95"
            >
              +500
            </button>
            <button
              type="button"
              onClick={() => addAlcohol(680)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-300 hover:text-rose-200 border border-slate-700/80 hover:border-rose-500/40 transition-all active:scale-95"
            >
              +680 (เบียร์ลัง)
            </button>
            <button
              type="button"
              onClick={() => onUpdateAlcoholAmount(0)}
              className="px-2 py-1 rounded-lg bg-slate-900/80 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-slate-800 transition-all ml-auto flex items-center gap-1 active:scale-95"
              title="รีเซ็ตค่าเหล้าเป็น 0"
            >
              <RotateCcw className="w-3 h-3" />
              ล้าง
            </button>
          </div>
        </div>

        {/* 2. Ice / Mixer Input Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-950/80 to-slate-900 border-2 border-cyan-500/30 shadow-lg hover:border-cyan-500/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
              <Snowflake className="w-4 h-4 text-cyan-400" />
              <span>ค่าน้ำแข็ง / มิกเซอร์ / กองกลาง (Shared)</span>
            </label>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-medium border border-cyan-500/30">
              🥤 หารทุกคนเท่ากัน
            </span>
          </div>

          <div className="relative mb-2.5">
            <input
              type="number"
              min="0"
              step="any"
              value={sharedAmount === 0 ? '' : sharedAmount}
              onChange={e => onUpdateSharedAmount(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="w-full bg-slate-950 border border-cyan-500/40 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-2xl font-extrabold font-mono text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder-slate-700"
            />
            <span className="absolute right-4 top-3 text-sm font-semibold text-slate-400">
              บาท
            </span>
          </div>

          {/* Quick Add Buttons for Shared / Ice */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-400 mr-1">ปุ่มลัด:</span>
            <button
              type="button"
              onClick={() => addShared(30)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-200 border border-slate-700/80 hover:border-cyan-500/40 transition-all active:scale-95"
            >
              🧊 +30 (น้ำแข็ง)
            </button>
            <button
              type="button"
              onClick={() => addShared(60)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-200 border border-slate-700/80 hover:border-cyan-500/40 transition-all active:scale-95"
            >
              💧 +60 (น้ำเปล่า)
            </button>
            <button
              type="button"
              onClick={() => addShared(240)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-200 border border-slate-700/80 hover:border-cyan-500/40 transition-all active:scale-95"
            >
              🥤 +240 (โซดาลัง)
            </button>
            <button
              type="button"
              onClick={() => addShared(150)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-200 border border-slate-700/80 hover:border-cyan-500/40 transition-all active:scale-95"
            >
              🍟 +150 (กับแกล้ม)
            </button>
            <button
              type="button"
              onClick={() => onUpdateSharedAmount(0)}
              className="px-2 py-1 rounded-lg bg-slate-900/80 hover:bg-red-950 text-slate-400 hover:text-red-300 border border-slate-800 transition-all ml-auto flex items-center gap-1 active:scale-95"
              title="รีเซ็ตค่าน้ำแข็งเป็น 0"
            >
              <RotateCcw className="w-3 h-3" />
              ล้าง
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Section: Extra Itemized Expenses */}
      <div className="pt-2 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => setShowDetailedItems(!showDetailedItems)}
          className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 py-1 transition-colors"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <Receipt className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {showDetailedItems
                ? 'ซ่อนรายการแจกแจงย่อย'
                : `แจกแจงรายการย่อยเพิ่มเติม (${items.length} รายการ)`}
            </span>
          </span>
          {showDetailedItems ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDetailedItems && (
          <div className="mt-3 space-y-3 animate-fadeIn">
            {/* Form to add item */}
            <form onSubmit={handleAddItem} className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="ชื่อรายการ เช่น น้ำแข็งถัง 2, เบียร์เพิ่ม"
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="sm:col-span-4 flex rounded-xl bg-slate-950/80 p-0.5 border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setNewCategory('shared')}
                    className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 ${
                      newCategory === 'shared'
                        ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400'
                    }`}
                  >
                    <Snowflake className="w-3 h-3" />
                    <span>น้ำแข็ง/มิกเซอร์</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCategory('alcohol')}
                    className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 ${
                      newCategory === 'alcohol'
                        ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                        : 'text-slate-400'
                    }`}
                  >
                    <Wine className="w-3 h-3" />
                    <span>เหล้า/เบียร์</span>
                  </button>
                </div>

                <div className="sm:col-span-3 flex gap-1.5">
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    placeholder="ราคา (฿)"
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={!newTitle.trim() || !newAmount}
                    className="px-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white rounded-xl text-xs flex items-center justify-center shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>

            {/* Item list with inline edit */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {items.length === 0 ? (
                <div className="text-center py-4 text-slate-600 text-xs border border-dashed border-slate-800 rounded-xl">
                  ยังไม่มีรายการย่อยเพิ่มเติม (ใช้ 2 ช่องด้านบนเป็นหลักได้เลย)
                </div>
              ) : (
                items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                          item.category === 'alcohol'
                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                        }`}
                      >
                        {item.category === 'alcohol' ? 'เหล้า' : 'น้ำแข็ง'}
                      </span>
                      <span className="text-slate-300 font-medium truncate">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.amount}
                        onChange={e =>
                          onUpdateItem(item.id, { amount: parseFloat(e.target.value) || 0 })
                        }
                        className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-1.5 py-0.5 text-right text-xs font-mono text-slate-100 focus:outline-none focus:border-rose-500"
                      />
                      <span className="text-slate-500 text-[11px]">฿</span>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 text-slate-500 hover:text-rose-400"
                        title="ลบรายการ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Subtotal Summary Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>รวมค่าเหล้า: <b className="text-rose-400 font-mono">{totalAlcohol.toLocaleString('th-TH')}</b> ฿</span>
        <span>รวมค่าน้ำแข็ง: <b className="text-cyan-400 font-mono">{totalShared.toLocaleString('th-TH')}</b> ฿</span>
      </div>
    </div>
  );
};
