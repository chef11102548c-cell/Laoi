import { BillConfig, BillSummary } from '../types/bill';

export function formatLineSummary(config: BillConfig, summary: BillSummary): string {
  const partyName = config.partyName.trim() || 'วงปาร์ตี้/หารค่าเหล้า';
  const lines: string[] = [];

  lines.push(`🍻 สรุปยอดบิล: ${partyName}`);
  lines.push(`━━━━━━━━━━━━━━━━━━━`);
  lines.push(`💰 ยอดรวมทั้งสิ้น: ${summary.totalAmount.toLocaleString('th-TH')} บาท`);
  lines.push(`  🍾 ค่าเหล้า/เบียร์: ${summary.totalAlcohol.toLocaleString('th-TH')} บาท (${summary.drinkerCount} คนดื่ม)`);
  lines.push(`  🧊 น้ำแข็ง/มิกเซอร์/กองกลาง: ${summary.totalShared.toLocaleString('th-TH')} บาท (${summary.totalMembers} คนหารเท่า)`);
  lines.push(`━━━━━━━━━━━━━━━━━━━`);
  lines.push(`👥 ยอดที่แต่ละคนต้องโอน:`);

  summary.calculations.forEach((calc, idx) => {
    const roleIcon = calc.isDrinker ? '🍺 สายดื่ม' : '🥤 สายน้ำแข็ง/มิกเซอร์';
    if (calc.netAmount > 0) {
      lines.push(`${idx + 1}. ${calc.name} (${roleIcon}): 👉 ${calc.netAmount.toLocaleString('th-TH')} บาท`);
    } else if (calc.netAmount < 0) {
      lines.push(`${idx + 1}. ${calc.name} (${roleIcon}): 💵 รับเงินคืน ${Math.abs(calc.netAmount).toLocaleString('th-TH')} บาท`);
    } else {
      lines.push(`${idx + 1}. ${calc.name} (${roleIcon}): ✅ ครบแล้ว (0 บาท)`);
    }
  });

  if (config.promptPayId) {
    lines.push(`━━━━━━━━━━━━━━━━━━━`);
    lines.push(`📱 พร้อมเพย์สำหรับโอน:`);
    lines.push(`เลขบัญชี/เบอร์: ${config.promptPayId}`);
    if (config.promptPayName.trim()) {
      lines.push(`ชื่อบัญชี: ${config.promptPayName}`);
    }
  }

  lines.push(`━━━━━━━━━━━━━━━━━━━`);
  lines.push(`(คำนวณโดย เว็บหารค่าเหล้า-ค่าน้ำแข็ง 🍻)`);

  return lines.join('\n');
}
