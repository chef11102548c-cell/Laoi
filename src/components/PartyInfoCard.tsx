import React from 'react';
import { BillConfig } from '../types/bill';
import { isValidPromptPayId } from '../utils/promptpay';
import { PartyPopper, QrCode, User, CheckCircle2, AlertCircle } from 'lucide-react';

interface PartyInfoCardProps {
  config: BillConfig;
  onChange: (updated: Partial<BillConfig>) => void;
}

export const PartyInfoCard: React.FC<PartyInfoCardProps> = ({ config, onChange }) => {
  const isIdValid = !config.promptPayId || isValidPromptPayId(config.promptPayId);

  return (
    <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4 text-rose-400 font-semibold text-sm">
        <PartyPopper className="w-4 h-4" />
        <span>ข้อมูลวง & บัญชีรับเงิน</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* Party Name */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            ชื่องาน / ชื่อวง
          </label>
          <div className="relative">
            <input
              type="text"
              value={config.partyName}
              onChange={e => onChange({ partyName: e.target.value })}
              placeholder="เช่น ปาร์ตี้วันศุกร์, วงหลังเลิกงาน"
              className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>
        </div>

        {/* PromptPay Number */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
            <span>เบอร์พร้อมเพย์ / เลขบัตร ปชช.</span>
            {config.promptPayId && (
              <span className="flex items-center gap-1 text-[11px]">
                {isIdValid ? (
                  <span className="text-emerald-400 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> ถูกต้อง
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-0.5">
                    <AlertCircle className="w-3 h-3" /> 10 หรือ 13 หลัก
                  </span>
                )}
              </span>
            )}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <QrCode className="w-4 h-4" />
            </div>
            <input
              type="tel"
              value={config.promptPayId}
              onChange={e => onChange({ promptPayId: e.target.value })}
              placeholder="08X-XXX-XXXX (สำหรับทำ QR)"
              className="w-full pl-9 bg-slate-950/70 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors font-mono"
            />
          </div>
        </div>

        {/* PromptPay Account Name */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            ชื่อบัญชีรับโอน (ใส่เพื่อความชัดเจน)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={config.promptPayName}
              onChange={e => onChange({ promptPayName: e.target.value })}
              placeholder="เช่น นายสมชาย (บัญชีคนเก็บเงิน)"
              className="w-full pl-9 bg-slate-950/70 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Round up checkbox */}
      <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none text-xs sm:text-sm text-slate-300">
          <input
            type="checkbox"
            checked={config.roundUp}
            onChange={e => onChange({ roundUp: e.target.checked })}
            className="w-4 h-4 rounded text-rose-500 bg-slate-950 border-slate-700 focus:ring-rose-500 focus:ring-offset-slate-900"
          />
          <span>ปัดเศษสตางค์ขึ้นเป็นจำนวนเต็มบาท (โอนง่าย ไม่ต้องมีเศษสตางค์)</span>
        </label>
      </div>
    </div>
  );
};
