import { useState, useEffect } from 'react';
import { BillConfig, ExpenseCategory, ExpenseItem, Member } from './types/bill';
import { calculateBill } from './utils/calculation';
import { Header } from './components/Header';
import { PartyInfoCard } from './components/PartyInfoCard';
import { MemberSection } from './components/MemberSection';
import { ExpenseSection } from './components/ExpenseSection';
import { SummarySection } from './components/SummarySection';
import { QRCodeModal } from './components/QRCodeModal';
import { Wine, QrCode } from 'lucide-react';

const STORAGE_KEY = 'laoi_bill_splitter_data_v2';

const DEFAULT_CONFIG: BillConfig = {
  partyName: 'ปาร์ตี้วันศุกร์หรรษา 🍻',
  promptPayId: '0812345678',
  promptPayName: 'นายสมชาย (คนคุมบิล)',
  roundUp: true,
};

const DEFAULT_MEMBERS: Member[] = [
  { id: '1', name: 'บอล', isDrinker: true, paidAmount: 0 },
  { id: '2', name: 'ตาล', isDrinker: true, paidAmount: 0 },
  { id: '3', name: 'บอส', isDrinker: true, paidAmount: 0 },
  { id: '4', name: 'นุ่น (ขับรถ/เน้นมิกเซอร์)', isDrinker: false, paidAmount: 0 },
];

export default function App() {
  const [config, setConfig] = useState<BillConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('laoi_bill_splitter_data_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.config || DEFAULT_CONFIG;
      }
    } catch {}
    return DEFAULT_CONFIG;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('laoi_bill_splitter_data_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.members || DEFAULT_MEMBERS;
      }
    } catch {}
    return DEFAULT_MEMBERS;
  });

  // Direct editable costs for Alcohol and Shared/Ice
  const [alcoholAmount, setAlcoholAmount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.alcoholAmount === 'number') return parsed.alcoholAmount;
      }
    } catch {}
    return 390;
  });

  const [sharedAmount, setSharedAmount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.sharedAmount === 'number') return parsed.sharedAmount;
      }
    } catch {}
    return 300;
  });

  // Extra items (if user wants to itemize specific receipts)
  const [items, setItems] = useState<ExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.items || [];
      }
    } catch {}
    return [];
  });

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedMemberIdForQR, setSelectedMemberIdForQR] = useState<string | undefined>(undefined);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ config, members, alcoholAmount, sharedAmount, items })
      );
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [config, members, alcoholAmount, sharedAmount, items]);

  // Recalculate bill summary
  const summary = calculateBill(members, items, config.roundUp, alcoholAmount, sharedAmount);

  // Member handlers
  const handleAddMember = (name: string, isDrinker: boolean) => {
    const newMember: Member = {
      id: Date.now().toString(),
      name,
      isDrinker,
      paidAmount: 0,
    };
    setMembers(prev => [...prev, newMember]);
  };

  const handleUpdateMember = (id: string, updated: Partial<Member>) => {
    setMembers(prev => prev.map(m => (m.id === id ? { ...m, ...updated } : m)));
  };

  const handleRemoveMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  // Expense handlers
  const handleAddItem = (title: string, category: ExpenseCategory, amount: number) => {
    const newItem: ExpenseItem = {
      id: Date.now().toString(),
      title,
      category,
      amount,
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleUpdateItem = (id: string, updated: Partial<ExpenseItem>) => {
    setItems(prev => prev.map(item => (item.id === id ? { ...item, ...updated } : item)));
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  // Reset bill handler
  const handleReset = () => {
    if (window.confirm('คุณต้องการล้างข้อมูลแล้วเริ่มบิลใหม่ใช่หรือไม่?')) {
      setMembers([]);
      setAlcoholAmount(0);
      setSharedAmount(0);
      setItems([]);
      setConfig(prev => ({ ...prev, partyName: '' }));
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleOpenQR = (memberId?: string) => {
    setSelectedMemberIdForQR(memberId);
    setQrModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Top Header */}
      <Header onReset={handleReset} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-5 pb-24">
        {/* Party Info & PromptPay */}
        <PartyInfoCard
          config={config}
          onChange={updated => setConfig(prev => ({ ...prev, ...updated }))}
        />

        {/* 2-Column Responsive Layout: Members & Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <MemberSection
            members={members}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onRemoveMember={handleRemoveMember}
          />

          <ExpenseSection
            alcoholAmount={alcoholAmount}
            sharedAmount={sharedAmount}
            onUpdateAlcoholAmount={setAlcoholAmount}
            onUpdateSharedAmount={setSharedAmount}
            items={items}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
          />
        </div>

        {/* Bill Summary & Share Section */}
        <SummarySection
          config={config}
          summary={summary}
          onOpenQR={handleOpenQR}
        />
      </main>

      {/* Floating Bottom Bar for Mobile Convenience */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 z-40 flex items-center justify-between shadow-2xl">
        <div>
          <div className="text-[11px] text-slate-400">ยอดรวมทั้งบิล</div>
          <div className="text-lg font-bold text-rose-400 font-mono">
            {summary.totalAmount.toLocaleString('th-TH')} ฿
          </div>
        </div>

        <div className="flex items-center gap-2">
          {config.promptPayId && (
            <button
              onClick={() => handleOpenQR()}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <QrCode className="w-4 h-4 text-rose-400" />
              <span>QR</span>
            </button>
          )}

          <button
            onClick={() => {
              const el = document.querySelector('button[title*="LINE"], button:has(svg)');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 text-xs font-semibold text-white flex items-center gap-1.5 shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
          >
            <span>ดูสรุปรายคน</span>
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        promptPayId={config.promptPayId}
        promptPayName={config.promptPayName}
        totalAmount={summary.totalAmount}
        calculations={summary.calculations}
        initialSelectedMemberId={selectedMemberIdForQR}
      />

      {/* Footer */}
      <footer className="text-center text-xs text-slate-600 py-6 border-t border-slate-900 mt-auto">
        <p className="flex items-center justify-center gap-1">
          <Wine className="w-3.5 h-3.5 text-rose-500 inline" />
          <span>เว็บหารค่าเหล้า-ค่าน้ำแข็ง • สร้างด้วย React & Tailwind CSS</span>
        </p>
      </footer>
    </div>
  );
}
