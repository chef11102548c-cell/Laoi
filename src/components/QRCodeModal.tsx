import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { generatePromptPayPayload } from '../utils/promptpay';
import { MemberCalculation } from '../types/bill';
import { X, QrCode, Download, Check, ShieldCheck } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptPayId: string;
  promptPayName: string;
  totalAmount: number;
  calculations: MemberCalculation[];
  initialSelectedMemberId?: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  promptPayId,
  promptPayName,
  totalAmount,
  calculations,
  initialSelectedMemberId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedType, setSelectedType] = useState<'member' | 'total' | 'open'>(
    initialSelectedMemberId ? 'member' : 'total'
  );
  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    initialSelectedMemberId || (calculations[0]?.memberId ?? '')
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialSelectedMemberId) {
      setSelectedType('member');
      setSelectedMemberId(initialSelectedMemberId);
    }
  }, [initialSelectedMemberId]);

  const selectedMember = calculations.find(c => c.memberId === selectedMemberId);

  // Compute current display amount
  let currentAmount: number | undefined;
  let targetLabel = '';

  if (selectedType === 'total') {
    currentAmount = totalAmount;
    targetLabel = 'ยอดรวมทั้งสิ้น';
  } else if (selectedType === 'member' && selectedMember) {
    currentAmount = selectedMember.netAmount > 0 ? selectedMember.netAmount : 0;
    targetLabel = `ยอดของ ${selectedMember.name}`;
  } else {
    currentAmount = undefined;
    targetLabel = 'ไม่ระบุยอดเงิน (โอนตามใจ)';
  }

  // Draw QR code
  useEffect(() => {
    if (!isOpen || !promptPayId) return;

    const payload = generatePromptPayPayload(promptPayId, currentAmount);
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        payload,
        {
          width: 240,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        },
        error => {
          if (error) console.error('Failed to generate QR Code:', error);
        }
      );
    }
  }, [isOpen, promptPayId, currentAmount]);

  if (!isOpen) return null;

  const handleDownloadQR = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `PromptPay_${promptPayId}_${targetLabel}.png`;
    a.click();
  };

  const handleCopyPromptPay = () => {
    navigator.clipboard.writeText(promptPayId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl p-5 shadow-2xl flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-3 text-rose-400 font-semibold text-base">
          <QrCode className="w-5 h-5" />
          <span>สแกนจ่ายผ่าน PromptPay</span>
        </div>

        {/* Mode Selector */}
        <div className="w-full flex rounded-xl bg-slate-950 p-1 border border-slate-800 mb-3 text-xs">
          <button
            type="button"
            onClick={() => setSelectedType('member')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
              selectedType === 'member'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            รายบุคคล
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('total')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
              selectedType === 'total'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ยอดรวมทั้งบิล
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('open')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
              selectedType === 'open'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ไม่ระบุยอด
          </button>
        </div>

        {/* Member selector dropdown if 'member' mode */}
        {selectedType === 'member' && calculations.length > 0 && (
          <div className="w-full mb-3">
            <select
              value={selectedMemberId}
              onChange={e => setSelectedMemberId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            >
              {calculations.map(calc => (
                <option key={calc.memberId} value={calc.memberId}>
                  {calc.name} ({calc.netAmount > 0 ? `${calc.netAmount.toLocaleString('th-TH')} ฿` : 'ครบแล้ว'})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* QR Code Canvas Box */}
        <div className="bg-white p-3.5 rounded-2xl shadow-lg border-2 border-rose-500/30 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-[#003b70] font-bold text-xs mb-1.5 tracking-wider">
            <span className="bg-[#003b70] text-white text-[10px] px-1 rounded">TH</span>
            <span>PROMPTPAY</span>
          </div>

          <canvas ref={canvasRef} className="rounded-lg" />

          {currentAmount !== undefined && currentAmount > 0 ? (
            <div className="mt-2 text-center text-slate-900 font-extrabold text-lg">
              {currentAmount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              <span className="text-sm font-normal text-slate-600">บาท</span>
            </div>
          ) : (
            <div className="mt-2 text-center text-xs font-medium text-slate-500">
              ผู้โอนระบุยอดเงินเอง
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="w-full mt-3.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center text-xs space-y-1">
          <div className="text-slate-400">
            บัญชีพร้อมเพย์:{' '}
            <span
              onClick={handleCopyPromptPay}
              className="font-mono text-slate-200 font-semibold cursor-pointer hover:text-rose-400 underline decoration-dotted"
              title="คลิกเพื่อคัดลอกเลขบัญชี"
            >
              {promptPayId || '(ยังไม่ได้ระบุเบอร์พร้อมเพย์)'}
            </span>
          </div>
          {promptPayName && (
            <div className="text-slate-300 font-medium flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{promptPayName}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="w-full grid grid-cols-2 gap-2 mt-3.5">
          <button
            type="button"
            onClick={handleCopyPromptPay}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
            <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกเลข'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadQR}
            className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-rose-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>โหลดรูป QR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
