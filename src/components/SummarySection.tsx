import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { BillConfig, BillSummary } from '../types/bill';
import { formatLineSummary } from '../utils/lineFormatter';
import {
  Calculator,
  Share2,
  QrCode,
  Check,
  Wine,
  Snowflake,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';

interface SummarySectionProps {
  config: BillConfig;
  summary: BillSummary;
  onOpenQR: (memberId?: string) => void;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  config,
  summary,
  onOpenQR,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLINE = () => {
    const text = formatLineSummary(config, summary);
    navigator.clipboard.writeText(text);

    // Fire confetti celebration
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore in environments without canvas
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Warning when there are alcohol expenses but 0 drinkers
  const hasAlcoholWithoutDrinkers = summary.totalAlcohol > 0 && summary.drinkerCount === 0;

  return (
    <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl backdrop-blur-md">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100">สรุปยอดที่ต้องจ่ายรายคน</h2>
            <p className="text-xs text-slate-400">คำนวณแยกสายดื่มและสายไม่ดื่มเรียบร้อยแล้ว</p>
          </div>
        </div>
      </div>

      {/* Warning Box */}
      {hasAlcoholWithoutDrinkers && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">มีรายการค่าเหล้า แต่ยังไม่มี "คนดื่ม"!</div>
            <div className="text-amber-300/80 mt-0.5">
              กรุณาติ๊กให้เพื่อนอย่างน้อย 1 คนเป็นสถานะ "สายดื่ม 🍺" เพื่อให้ระบบนำค่าเหล้าไปหารได้ถูกต้อง
            </div>
          </div>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
        {/* Total Bill */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">ยอดรวมทั้งสิ้น</div>
          <div className="text-2xl font-black text-rose-400 font-mono mt-1">
            {summary.totalAmount.toLocaleString('th-TH')}{' '}
            <span className="text-xs font-normal text-slate-400">บาท</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            ทั้งหมด {summary.totalMembers} คน
          </div>
        </div>

        {/* Alcohol Share */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-rose-950/40">
          <div className="text-xs text-rose-300/80 font-medium flex items-center gap-1">
            <Wine className="w-3.5 h-3.5 text-rose-400" />
            <span>หมวดเหล้า/เบียร์</span>
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono mt-1">
            {summary.totalAlcohol.toLocaleString('th-TH')}{' '}
            <span className="text-xs font-normal text-slate-400">บาท</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            หาร {summary.drinkerCount} คนดื่ม{' '}
            {summary.drinkerCount > 0 && (
              <span className="text-rose-400">
                (~{(summary.totalAlcohol / summary.drinkerCount).toFixed(1)}฿/คน)
              </span>
            )}
          </div>
        </div>

        {/* Shared / Ice Share */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-cyan-950/40">
          <div className="text-xs text-cyan-300/80 font-medium flex items-center gap-1">
            <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
            <span>หมวดน้ำแข็ง/มิกเซอร์</span>
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono mt-1">
            {summary.totalShared.toLocaleString('th-TH')}{' '}
            <span className="text-xs font-normal text-slate-400">บาท</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            หาร {summary.totalMembers} คนเท่ากัน{' '}
            {summary.totalMembers > 0 && (
              <span className="text-cyan-400">
                (~{(summary.totalShared / summary.totalMembers).toFixed(1)}฿/คน)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Member Breakdown Cards */}
      <div className="space-y-2.5 mb-5">
        {summary.calculations.map(calc => (
          <div
            key={calc.memberId}
            className={`p-3.5 rounded-xl border transition-all ${
              calc.isDrinker
                ? 'bg-slate-950/80 border-amber-500/20 hover:border-amber-500/40'
                : 'bg-slate-950/80 border-cyan-500/20 hover:border-cyan-500/40'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              {/* Member Name and Breakdown tags */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-100 text-sm sm:text-base">
                    {calc.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                      calc.isDrinker
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                    }`}
                  >
                    {calc.isDrinker ? '🍺 สายดื่ม' : '🥤 สายน้ำแข็ง/มิกเซอร์'}
                  </span>
                </div>

                {/* Calculation breakdown */}
                <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span>น้ำแข็ง/มิกเซอร์: {calc.sharedShare.toLocaleString('th-TH')}฿</span>
                  {calc.isDrinker && (
                    <>
                      <span>+</span>
                      <span className="text-amber-400">เหล้า: {calc.alcoholShare.toLocaleString('th-TH')}฿</span>
                    </>
                  )}
                  {calc.paidAmount > 0 && (
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3 inline" />
                      หักออกก่อน {calc.paidAmount.toLocaleString('th-TH')}฿
                    </span>
                  )}
                </div>
              </div>

              {/* Net amount & QR action button */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="text-left sm:text-right">
                  {calc.netAmount > 0 ? (
                    <div>
                      <div className="text-[11px] text-slate-400">ยอดที่ต้องโอน:</div>
                      <div className="text-lg font-black text-rose-400 font-mono">
                        {calc.netAmount.toLocaleString('th-TH')}{' '}
                        <span className="text-xs font-normal text-slate-400">บาท</span>
                      </div>
                    </div>
                  ) : calc.netAmount < 0 ? (
                    <div>
                      <div className="text-[11px] text-slate-400">ต้องได้รับเงินคืน:</div>
                      <div className="text-lg font-black text-emerald-400 font-mono">
                        {Math.abs(calc.netAmount).toLocaleString('th-TH')}{' '}
                        <span className="text-xs font-normal text-slate-400">บาท</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm font-semibold text-slate-400 flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-400" /> ครบแล้ว
                    </div>
                  )}
                </div>

                {calc.netAmount > 0 && config.promptPayId && (
                  <button
                    type="button"
                    onClick={() => onOpenQR(calc.memberId)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-200 hover:text-rose-300 border border-slate-700/80 hover:border-rose-500/40 text-xs font-medium flex items-center gap-1 transition-all shadow-sm active:scale-95"
                    title={`เปิด QR โอนเงินของ ${calc.name}`}
                  >
                    <QrCode className="w-3.5 h-3.5 text-rose-400" />
                    <span>QR คนนี้</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons: LINE Copy & QR Code */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
        <button
          type="button"
          onClick={handleCopyLINE}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#06c755] to-[#05b34c] hover:from-[#05b34c] hover:to-[#049d42] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all"
        >
          {copied ? <Check className="w-5 h-5 text-white" /> : <Share2 className="w-5 h-5 text-white" />}
          <span>{copied ? 'คัดลอกสรุปส่ง LINE แล้ว! 🚀' : '📋 คัดลอกสรุปบิลส่ง LINE'}</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenQR()}
          disabled={!config.promptPayId}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-40 disabled:pointer-events-none text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 active:scale-98 transition-all"
        >
          <QrCode className="w-5 h-5" />
          <span>{config.promptPayId ? '📱 ดู QR Code พร้อมเพย์' : 'ใส่เบอร์พร้อมเพย์ก่อน'}</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </button>
      </div>
    </div>
  );
};
