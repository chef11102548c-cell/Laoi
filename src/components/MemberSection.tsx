import React, { useState } from 'react';
import { Member } from '../types/bill';
import { Users, UserPlus, Trash2, Beer, GlassWater, DollarSign } from 'lucide-react';

interface MemberSectionProps {
  members: Member[];
  onAddMember: (name: string, isDrinker: boolean) => void;
  onUpdateMember: (id: string, updated: Partial<Member>) => void;
  onRemoveMember: (id: string) => void;
}

export const MemberSection: React.FC<MemberSectionProps> = ({
  members,
  onAddMember,
  onUpdateMember,
  onRemoveMember,
}) => {
  const [newName, setNewName] = useState('');
  const [newIsDrinker, setNewIsDrinker] = useState(true);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddMember(newName.trim(), newIsDrinker);
    setNewName('');
  };

  const drinkerCount = members.filter(m => m.isDrinker).length;
  const nonDrinkerCount = members.length - drinkerCount;

  return (
    <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl backdrop-blur-md">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <span>รายชื่อเพื่อนในวง</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {members.length} คน
              </span>
            </h2>
          </div>
        </div>

        {/* Counter badges */}
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Beer className="w-3.5 h-3.5" /> ดื่ม: {drinkerCount} คน
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <GlassWater className="w-3.5 h-3.5" /> ไม่ดื่ม: {nonDrinkerCount} คน
          </span>
        </div>
      </div>

      {/* Add Member Form */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="พิมพ์ชื่อเพื่อน..."
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Quick toggle for new member */}
          <button
            type="button"
            onClick={() => setNewIsDrinker(!newIsDrinker)}
            className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all select-none ${
              newIsDrinker
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
            }`}
          >
            {newIsDrinker ? (
              <>
                <Beer className="w-3.5 h-3.5 text-amber-400" />
                <span>สายดื่ม (หารเหล้า+น้ำแข็ง)</span>
              </>
            ) : (
              <>
                <GlassWater className="w-3.5 h-3.5 text-cyan-400" />
                <span>สายไม่ดื่ม (หารเฉพาะน้ำแข็ง)</span>
              </>
            )}
          </button>

          <button
            type="submit"
            disabled={!newName.trim()}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-rose-600/25 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>เพิ่ม</span>
          </button>
        </div>
      </form>

      {/* Member List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {members.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
            ยังไม่มีรายชื่อเพื่อน กดเพิ่มเพื่อนด้านบนได้เลย!
          </div>
        ) : (
          members.map(member => (
            <div
              key={member.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl border transition-all ${
                member.isDrinker
                  ? 'bg-slate-950/60 border-amber-500/20 hover:border-amber-500/40'
                  : 'bg-slate-950/60 border-cyan-500/20 hover:border-cyan-500/40'
              }`}
            >
              {/* Name & Drinker status button */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => onUpdateMember(member.id, { isDrinker: !member.isDrinker })}
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                    member.isDrinker
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                  }`}
                  title={member.isDrinker ? 'คลิกเพื่อสลับเป็นไม่ดื่ม' : 'คลิกเพื่อสลับเป็นดื่ม'}
                >
                  {member.isDrinker ? <Beer className="w-4 h-4" /> : <GlassWater className="w-4 h-4" />}
                </button>

                <div className="truncate">
                  <span className="font-medium text-slate-100 text-sm">{member.name}</span>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span
                      onClick={() => onUpdateMember(member.id, { isDrinker: !member.isDrinker })}
                      className="cursor-pointer hover:underline"
                    >
                      {member.isDrinker ? (
                        <span className="text-amber-400/90 font-normal">🍺 ดื่มเหล้า (หารทุกอย่าง)</span>
                      ) : (
                        <span className="text-cyan-400/90 font-normal">🥤 ไม่ดื่ม (หารแค่น้ำแข็ง/มิกเซอร์)</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Paid in advance & Delete */}
              <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
                {/* Out-of-pocket paid */}
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/60 rounded-lg px-2 py-1">
                  <span className="text-slate-400 text-[11px] flex items-center gap-0.5">
                    <DollarSign className="w-3 h-3 text-emerald-400" />
                    ออกก่อน:
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={member.paidAmount || ''}
                    onChange={e =>
                      onUpdateMember(member.id, { paidAmount: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="0"
                    className="w-16 bg-transparent text-right text-emerald-400 font-mono text-xs focus:outline-none placeholder-slate-600"
                  />
                  <span className="text-slate-500 text-[11px]">฿</span>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveMember(member.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="ลบเพื่อนคนนี้"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
