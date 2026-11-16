# Design Spec: เว็บแอปหารค่าเหล้า-ค่าน้ำแข็ง (Alcohol & Ice Party Bill Splitter)

**Date:** 2026-11-14  
**Status:** Approved  
**Platform:** Web (Client-side Single Page Application)  
**Tech Stack:** React 19 + Vite + Tailwind CSS + Lucide React + canvas-confetti + promptpay-qr / qrcode

---

## 1. Overview & Goals
เว็บแอปพลิเคชันสำหรับสายปาร์ตี้/วงเหล้า ออกแบบมาเพื่อแก้ปัญหาการหารบิลที่มักมีทั้ง "คนดื่มเหล้า/เบียร์" และ "คนไม่ดื่ม (กินแต่น้ำแข็ง โซดา น้ำเปล่า หรือกับแกล้ม)" โดยช่วยคำนวณยอดเงินอย่างเป็นธรรมและโปร่งใส พร้อมทั้งสร้าง PromptPay QR Code และข้อความสรุปพร้อมส่งเข้ากลุ่ม LINE ทันที

### Primary Goals:
1. **การคำนวณแยกสายดื่ม / สายไม่ดื่ม:**
   - หมวดแอลกอฮอล์: หารเฉพาะคนดื่ม
   - หมวดกองกลาง (น้ำแข็ง/มิกเซอร์/กับแกล้ม): หารทุกคนเท่ากัน
2. **ระบบคิดเงินและ PromptPay QR Code:**
   - ผู้ใช้ใส่เบอร์โทรศัพท์/เลขบัตรประชาชนสำหรับรับเงิน
   - แสดง QR Code พร้อมเพย์ตามยอดของแต่ละคน หรือ QR Code รวม เพื่อความสะดวกรวดเร็ว
3. **ฟังก์ชันคัดลอกสรุปส่ง LINE:**
   - คัดลอกสรุปรายการและยอดที่แต่ละคนต้องจ่ายในรูปแบบข้อความพร้อมไอโมจิสวยงาม
4. **ความง่ายในการใช้งานบนมือถือ (Mobile-First):**
   - UI สวยงาม โทน Neon Dark / Party Vibe ใช้งานง่ายแม้อยู่ในวงเหล้า
   - บันทึกข้อมูลลง LocalStorage อัตโนมัติ ป้องกันข้อมูลหายเมื่อรีเฟรช

---

## 2. Architecture & Components

### 2.1 File Structure
```
/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   └── bill.ts
│   ├── utils/
│   │   ├── calculation.ts
│   │   ├── promptpay.ts
│   │   └── formatters.ts
│   └── components/
│       ├── Header.tsx
│       ├── PartyInfoCard.tsx
│       ├── MemberSection.tsx
│       ├── ExpenseSection.tsx
│       ├── SummarySection.tsx
│       ├── MemberDetailModal.tsx
│       └── QRCodeModal.tsx
└── docs/
    └── superpowers/specs/2026-11-14-alcohol-ice-bill-splitter-design.md
```

### 2.2 Component Hierarchy & Responsibilities
- **`App.tsx`**: State container หลัก จัดการโหลด/บันทึก LocalStorage และประสานงานระหว่าง Component ต่างๆ
- **`Header.tsx`**: โลโก้ ชื่อแอป ("หารค่าเหล้า-น้ำแข็ง") ปุ่มรีเซ็ตบิลใหม่ (New Bill) และ Dark/Light Party mode
- **`PartyInfoCard.tsx`**: ตั้งชื่องาน/วง และกรอกเบอร์พร้อมเพย์ + ชื่อบัญชีของผู้รับเงิน
- **`MemberSection.tsx`**: 
  - เพิ่ม/ลบรายชื่อเพื่อน
  - ปุ่ม Toggle สถานะ "🍻 ดื่มเหล้า" หรือ "🥤 ไม่ดื่ม (เน้นน้ำแข็ง/มิกเซอร์)"
  - แสดงจำนวนสรุปคนดื่ม vs ไม่ดื่ม
- **`ExpenseSection.tsx`**:
  - รายการค่าใช้จ่าย แบ่งแท็บหรือ Badge:
    - 🍾 ค่าเหล้า / เบียร์ (Alcohol)
    - 🧊 ค่าน้ำแข็ง / มิกเซอร์ / ของกิน (Shared)
  - Quick presets: ปุ่มลัดเพิ่มรายการยอดฮิต (เช่น น้ำแข็ง 1 ถัง 30.-, โซดา 1 ลัง 240.-, Blend 285 390.-)
- **`SummarySection.tsx`**:
  - ยอดรวมทั้งหมด, ยอดรวมค่าเหล้า, ยอดรวมค่าน้ำแข็ง/กองกลาง
  - การ์ดสรุปยอดรายคน: แสดงชัดเจนว่าใครต้องจ่ายกี่บาท (พร้อมรายละเอียดว่าคิดจากค่าอะไร)
  - ปุ่ม "📋 คัดลอกสรุปส่ง LINE"
  - ปุ่ม "📱 ดู QR Code พร้อมเพย์"
- **`QRCodeModal.tsx`**: แสดง QR Code พร้อมเพย์สำหรับสแกนจ่าย สามารถเลือกดู QR รวม หรือ QR ตามยอดรายบุคคล

---

## 3. Data Model & Calculations

### 3.1 Types (`types/bill.ts`)
```typescript
export interface Member {
  id: string;
  name: string;
  isDrinker: boolean;
  paidAmount: number; // เงินที่ออกล่วงหน้าไปก่อน (ถ้ามี)
}

export type ExpenseCategory = 'alcohol' | 'shared';

export interface ExpenseItem {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
}

export interface BillConfig {
  partyName: string;
  promptPayId: string; // Phone number or National ID
  promptPayName: string;
  roundUp: boolean;     // ปัดเศษขึ้นเป็นจำนวนเต็มบาทหรือไม่
}

export interface MemberCalculation {
  memberId: string;
  name: string;
  isDrinker: boolean;
  sharedShare: number;   // ส่วนแบ่งค่าน้ำแข็ง/กองกลาง
  alcoholShare: number;  // ส่วนแบ่งค่าเหล้า
  totalOwed: number;     // ยอดที่ต้องจ่ายทั้งหมด
  netAmount: number;     // ยอดสุทธิหลังหักลบเงินที่จ่ายไปก่อน
}
```

### 3.2 Calculation Algorithm (`utils/calculation.ts`)
```typescript
export function calculateSplit(members: Member[], items: ExpenseItem[], roundUp: boolean) {
  const totalShared = items
    .filter(i => i.category === 'shared')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalAlcohol = items
    .filter(i => i.category === 'alcohol')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalCount = members.length;
  const drinkerCount = members.filter(m => m.isDrinker).length;

  const sharedPerPerson = totalCount > 0 ? totalShared / totalCount : 0;
  const alcoholPerDrinker = drinkerCount > 0 ? totalAlcohol / drinkerCount : 0;

  return members.map(m => {
    let alcoholShare = m.isDrinker ? alcoholPerDrinker : 0;
    let sharedShare = sharedPerPerson;
    let total = alcoholShare + sharedShare;

    if (roundUp) {
      total = Math.ceil(total);
    } else {
      total = Math.round(total * 100) / 100;
    }

    const netAmount = total - (m.paidAmount || 0);

    return {
      memberId: m.id,
      name: m.name,
      isDrinker: m.isDrinker,
      sharedShare,
      alcoholShare,
      totalOwed: total,
      netAmount
    };
  });
}
```

---

## 4. PromptPay QR & LINE Sharing

### 4.1 PromptPay Payload
ใช้มาตรฐาน EMVCo PromptPay QR Code (CRC16 checksum) รองรับทั้งเบอร์โทรศัพท์ (08x-xxx-xxxx) และเลขบัตรประชาชน 13 หลัก โดยแปลงเป็น QR Code ให้สแกนได้จากแอปธนาคารทุกแห่งในไทย

### 4.2 LINE Text Template
```
🍻 สรุปยอดบิล: ปาร์ตี้วันศุกร์
━━━━━━━━━━━━━━
💰 ยอดรวมทั้งสิ้น: 1,850 บาท
  - 🍾 ค่าเหล้า/เบียร์: 1,400 บาท (หาร 4 คน)
  - 🧊 ค่าน้ำแข็ง/มิกเซอร์: 450 บาท (หาร 6 คน)

👥 ยอดที่แต่ละคนต้องโอน:
1. บอย (ดื่ม) : 425 บาท
2. ตาล (ดื่ม) : 425 บาท
3. นัท (ดื่ม) : 425 บาท
4. กานต์ (ดื่ม) : 425 บาท
5. แจน (ไม่ดื่ม เน้นน้ำแข็ง) : 75 บาท
6. เมย์ (ไม่ดื่ม เน้นน้ำแข็ง) : 75 บาท

📱 บัญชีพร้อมเพย์สำหรับโอน:
081-234-5678 (นายสมชาย)
━━━━━━━━━━━━━━
(คำนวณโดย เว็บหารค่าเหล้า-ค่าน้ำแข็ง)
```

---

## 5. Error Handling & Edge Cases
1. **ไม่มีสมาชิกเลย ($N=0$):** แสดงหน้าว่างพร้อมปุ่ม Quick Add เพื่อน
2. **ไม่มีคนดื่มเหล้าเลย ($N_{drinker}=0$ แต่มีค่าเหล้า):** แจ้งเตือน Warning เตือนผู้ใช้ว่ามีรายการค่าเหล้า แต่ยังไม่มีคนดื่ม
3. **เลขพร้อมเพย์ไม่ถูกต้อง:** ตรวจสอบความยาวเบอร์โทร (10 หลัก) หรือเลข ปชช. (13 หลัก)
4. **ตัวเลขติดลบหรือค่าไม่สมเหตุสมผล:** Input sanitize ป้องกันการกรอกตัวเลขติดลบหรือตัวอักษรที่ไม่ใช่ตัวเลข
5. **เงินทอน / คนจ่ายล่วงหน้าเกินยอด:** คำนวณยอดติดลบระบุชัดเจนว่าเป็น "ยอดที่ต้องได้รับเงินคืน"

---

## 6. Verification & Testing
- Unit tests สำหรับฟังก์ชัน `calculateSplit` ทุกกรณี (รวมกรณีปัดเศษ, คนจ่ายล่วงหน้า, กรณีมีแต่คนไม่ดื่ม)
- ตรวจสอบความถูกต้องของ PromptPay CRC16 checksum
- ทดสอบความ responsive บนหน้าจอมือถือ (Viewport 375px, 414px และ Desktop)
