# Alcohol & Ice Party Bill Splitter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a sleek, mobile-friendly client-side React web application for splitting alcohol, ice, mixers, and party expenses fairly between drinkers and non-drinkers, with PromptPay QR generation and LINE summary copy.

**Architecture:** Client-side React 19 + TypeScript SPA built with Vite and styled with Tailwind CSS. State is stored locally in `localStorage`. Calculation logic and PromptPay EMVCo QR code payload generator are pure TypeScript utilities with automated unit tests.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React, qrcode, canvas-confetti, vitest.

## Global Constraints
- Target platform: Modern mobile and desktop web browsers.
- No backend required (fully offline/client-side capable).
- Exact formula: Drinkers pay $(T_{shared}/N_{total}) + (T_{alc}/N_{drinker})$; Non-drinkers pay $(T_{shared}/N_{total})$.
- PromptPay must support Thai mobile number (10 digits) and Citizen ID (13 digits) using standard EMVCo payload format with CRC16-CCITT.
- Language of UI: Thai (friendly party tone with emojis 🍻, 🧊, 🍾, 💰).

---

### Task 1: Project Scaffolding & Dependencies

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/index.css`
- Create: `src/App.tsx`

**Interfaces:**
- Produces: Working React + Vite + Tailwind CSS development environment with `vitest`, `lucide-react`, `qrcode`, and `canvas-confetti`.

- [ ] **Step 1: Write `package.json` with all dependencies and scripts**

```json
{
  "name": "laoi-bill-splitter",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "canvas-confetti": "^1.9.4",
    "clsx": "^2.1.1",
    "lucide-react": "^1.16.0",
    "qrcode": "^1.5.4",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^3.0.2"
  },
  "devDependencies": {
    "@types/canvas-confetti": "^1.9.0",
    "@types/node": "^22.13.1",
    "@types/qrcode": "^1.5.5",
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.1",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.7.2",
    "vite": "^6.1.0",
    "vitest": "^3.0.5"
  }
}
```

- [ ] **Step 2: Configure Vite, TypeScript, Tailwind, and PostCSS**
- Write `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `tailwind.config.js`, `postcss.config.js`.
- Write `index.html` titled "หารค่าเหล้า-ค่าน้ำแข็ง 🍻🧊".
- Write `src/index.css` with `@tailwind base; @tailwind components; @tailwind utilities;` and custom party theme colors.
- Write initial `src/main.tsx` and `src/App.tsx`.

- [ ] **Step 3: Install dependencies and verify environment**
Run: `npm install`
Run: `npm run build`
Expected: Build succeeds.

---

### Task 2: Data Models & Calculation Engine with Unit Tests

**Files:**
- Create: `src/types/bill.ts`
- Create: `src/utils/calculation.ts`
- Create: `src/utils/calculation.test.ts`

**Interfaces:**
- Produces: `Member`, `ExpenseItem`, `BillConfig`, `SplitResult`, `calculateSplit(members, items, roundUp)`.

- [ ] **Step 1: Write `src/types/bill.ts` defining all types**
- [ ] **Step 2: Write failing unit tests in `src/utils/calculation.test.ts`**
  - Test case 1: Even split when everyone drinks.
  - Test case 2: Separate alcohol vs shared ice/mixer when some do not drink.
  - Test case 3: Edge case where alcohol exists but 0 drinkers.
  - Test case 4: Round up handling.
  - Test case 5: Paid in advance deduction.
- [ ] **Step 3: Run test to verify failure**
Run: `npm run test`
Expected: FAIL (modules not found / not implemented)
- [ ] **Step 4: Implement `src/utils/calculation.ts`**
- [ ] **Step 5: Run tests to verify they pass**
Run: `npm run test`
Expected: PASS (all tests green)

---

### Task 3: PromptPay EMVCo QR Code Payload Generator with Unit Tests

**Files:**
- Create: `src/utils/promptpay.ts`
- Create: `src/utils/promptpay.test.ts`

**Interfaces:**
- Produces: `formatPromptPayId(id: string): string`, `generatePromptPayPayload(target: string, amount?: number): string`.

- [ ] **Step 1: Write failing unit test in `src/utils/promptpay.test.ts`**
  - Verify phone number formatting (e.g., `0812345678` -> `0066812345678`).
  - Verify national ID formatting (13 digits).
  - Verify EMVCo tags 00, 01, 29, 53, 54, 58, 63 (CRC16).
- [ ] **Step 2: Run test to verify failure**
Run: `npm run test`
Expected: FAIL
- [ ] **Step 3: Implement `src/utils/promptpay.ts` with standard CRC16 checksum calculation**
- [ ] **Step 4: Run test to verify pass**
Run: `npm run test`
Expected: PASS

---

### Task 4: UI Components - Header, Party Setup, Member Management & Expense Items

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/PartyInfoCard.tsx`
- Create: `src/components/MemberSection.tsx`
- Create: `src/components/ExpenseSection.tsx`

**Interfaces:**
- Consumes: `Member`, `ExpenseItem`, `BillConfig` from `src/types/bill.ts`.
- Produces:
  - `Header`: Title, reset action, party badges.
  - `PartyInfoCard`: Party name, PromptPay phone/ID input, PromptPay account name.
  - `MemberSection`: Member list, add member input, toggle "🍻 ดื่ม" / "🥤 ไม่ดื่ม", delete member.
  - `ExpenseSection`: Item list, category toggle ("🍾 ค่าเหล้า" / "🧊 น้ำแข็ง-มิกเซอร์"), quick presets (+น้ำแข็ง, +โซดา, +น้ำเปล่า, +เหล้า).

- [ ] **Step 1: Create `src/components/Header.tsx`**
- [ ] **Step 2: Create `src/components/PartyInfoCard.tsx` with PromptPay input validation**
- [ ] **Step 3: Create `src/components/MemberSection.tsx` with intuitive status toggles**
- [ ] **Step 4: Create `src/components/ExpenseSection.tsx` with quick addition presets**

---

### Task 5: UI Components - Summary Section, LINE Share Formatter & QR Code Modal

**Files:**
- Create: `src/utils/lineFormatter.ts`
- Create: `src/components/SummarySection.tsx`
- Create: `src/components/QRCodeModal.tsx`

**Interfaces:**
- Consumes: `calculateSplit`, `generatePromptPayPayload`, `qrcode`.
- Produces:
  - `formatLineMessage(...)`: Formats bill details into a LINE-ready text with emojis.
  - `SummarySection`: Total overview cards, member breakdown cards with badges, Copy LINE button, Open QR button.
  - `QRCodeModal`: Modal rendering dynamic canvas QR Code for selected member or overall bill.

- [ ] **Step 1: Implement `src/utils/lineFormatter.ts`**
- [ ] **Step 2: Implement `src/components/QRCodeModal.tsx` using `qrcode` library**
- [ ] **Step 3: Implement `src/components/SummarySection.tsx` with copy-to-clipboard toast feedback**

---

### Task 6: App Assembly, LocalStorage Sync & Polish

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Combines all components into a cohesive, responsive experience.
- Handles default template data so the user opens the app and immediately understands how it works.
- Saves and loads state from `localStorage`.
- Includes celebration animation (`canvas-confetti`) when copying the summary or completing bill split.

- [ ] **Step 1: Wire all components and state in `src/App.tsx`**
- [ ] **Step 2: Add default demo data on first load**
- [ ] **Step 3: Implement LocalStorage persistence and Reset Bill modal**
- [ ] **Step 4: Verify mobile responsiveness (responsive grid, touch targets, sticky summary bar)**

---

### Task 7: Verification & Build Check

**Files:**
- All project files

- [ ] **Step 1: Run all unit tests**
Run: `npm run test`
Expected: All tests pass.
- [ ] **Step 2: Run production TypeScript compile & Vite build**
Run: `npm run build`
Expected: Build succeeds with zero errors.
- [ ] **Step 3: Test local server with sample bill**
Run dev/preview server and check response.
