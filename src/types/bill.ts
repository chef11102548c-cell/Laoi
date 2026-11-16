export type ExpenseCategory = 'alcohol' | 'shared';

export interface Member {
  id: string;
  name: string;
  isDrinker: boolean;
  paidAmount: number; // เงินที่ออกกองกลางล่วงหน้าไปก่อน
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
}

export interface BillConfig {
  partyName: string;
  promptPayId: string;
  promptPayName: string;
  roundUp: boolean;
}

export interface MemberCalculation {
  memberId: string;
  name: string;
  isDrinker: boolean;
  sharedShare: number;   // ยอดค่าน้ำแข็ง/มิกเซอร์/กองกลาง
  alcoholShare: number;  // ยอดค่าเหล้า/เบียร์
  totalOwed: number;     // ยอดรวมที่ต้องร่วมจ่าย
  paidAmount: number;    // จ่ายล่วงหน้าไปแล้ว
  netAmount: number;     // ยอดสุทธิที่ต้องโอนเพิ่ม (> 0) หรือต้องได้เงินคืน (< 0)
}

export interface BillSummary {
  totalAmount: number;
  totalAlcohol: number;
  totalShared: number;
  drinkerCount: number;
  nonDrinkerCount: number;
  totalMembers: number;
  calculations: MemberCalculation[];
}
