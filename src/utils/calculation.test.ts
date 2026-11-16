import { describe, it, expect } from 'vitest';
import { calculateBill } from './calculation';
import { Member, ExpenseItem } from '../types/bill';

describe('calculateBill', () => {
  it('calculates evenly when all members are drinkers', () => {
    const members: Member[] = [
      { id: '1', name: 'Alice', isDrinker: true, paidAmount: 0 },
      { id: '2', name: 'Bob', isDrinker: true, paidAmount: 0 },
    ];
    const items: ExpenseItem[] = [
      { id: '1', title: 'Beer', category: 'alcohol', amount: 200 },
      { id: '2', title: 'Ice', category: 'shared', amount: 100 },
    ];

    const result = calculateBill(members, items, false);
    expect(result.totalAmount).toBe(300);
    expect(result.totalAlcohol).toBe(200);
    expect(result.totalShared).toBe(100);
    expect(result.calculations[0].totalOwed).toBe(150);
    expect(result.calculations[1].totalOwed).toBe(150);
  });

  it('supports direct input for alcohol and ice/shared costs', () => {
    const members: Member[] = [
      { id: '1', name: 'Drinker', isDrinker: true, paidAmount: 0 },
      { id: '2', name: 'Non Drinker', isDrinker: false, paidAmount: 0 },
    ];

    // directAlcohol = 800, directShared = 200
    const result = calculateBill(members, [], false, 800, 200);
    expect(result.totalAmount).toBe(1000);
    expect(result.totalAlcohol).toBe(800);
    expect(result.totalShared).toBe(200);

    // Non drinker pays shared (200 / 2 = 100)
    // Drinker pays shared (100) + alcohol (800 / 1 = 800) = 900
    expect(result.calculations[0].totalOwed).toBe(900);
    expect(result.calculations[1].totalOwed).toBe(100);
  });

  it('correctly splits between drinkers and non-drinkers', () => {
    const members: Member[] = [
      { id: '1', name: 'Drinker 1', isDrinker: true, paidAmount: 0 },
      { id: '2', name: 'Drinker 2', isDrinker: true, paidAmount: 0 },
      { id: '3', name: 'Non Drinker', isDrinker: false, paidAmount: 0 },
    ];
    const items: ExpenseItem[] = [
      { id: '1', title: 'Whiskey', category: 'alcohol', amount: 600 },
      { id: '2', title: 'Ice & Soda', category: 'shared', amount: 300 },
    ];

    const result = calculateBill(members, items, false);
    expect(result.calculations[0].totalOwed).toBe(400);
    expect(result.calculations[1].totalOwed).toBe(400);
    expect(result.calculations[2].totalOwed).toBe(100);
  });

  it('deducts paid amount correctly', () => {
    const members: Member[] = [
      { id: '1', name: 'Drinker 1', isDrinker: true, paidAmount: 500 },
      { id: '2', name: 'Drinker 2', isDrinker: true, paidAmount: 0 },
    ];
    const items: ExpenseItem[] = [
      { id: '1', title: 'Whiskey', category: 'alcohol', amount: 500 },
    ];

    const result = calculateBill(members, items, false);
    expect(result.calculations[0].netAmount).toBe(-250);
    expect(result.calculations[1].netAmount).toBe(250);
  });

  it('rounds up total owed when roundUp is enabled', () => {
    const members: Member[] = [
      { id: '1', name: 'A', isDrinker: true, paidAmount: 0 },
      { id: '2', name: 'B', isDrinker: true, paidAmount: 0 },
      { id: '3', name: 'C', isDrinker: true, paidAmount: 0 },
    ];
    const items: ExpenseItem[] = [
      { id: '1', title: 'Beer', category: 'alcohol', amount: 100 },
    ];

    const result = calculateBill(members, items, true);
    expect(result.calculations[0].totalOwed).toBe(34);
  });
});
