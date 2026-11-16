import { Member, ExpenseItem, MemberCalculation, BillSummary } from '../types/bill';

export function calculateBill(
  members: Member[],
  items: ExpenseItem[] = [],
  roundUp: boolean = false,
  directAlcohol: number = 0,
  directShared: number = 0
): BillSummary {
  const itemsAlcohol = items
    .filter(item => item.category === 'alcohol')
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const itemsShared = items
    .filter(item => item.category === 'shared')
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const totalAlcohol = (Number(directAlcohol) || 0) + itemsAlcohol;
  const totalShared = (Number(directShared) || 0) + itemsShared;

  const totalAmount = totalAlcohol + totalShared;
  const totalMembers = members.length;
  const drinkers = members.filter(m => m.isDrinker);
  const drinkerCount = drinkers.length;
  const nonDrinkerCount = totalMembers - drinkerCount;

  const sharedPerPerson = totalMembers > 0 ? totalShared / totalMembers : 0;
  const alcoholPerDrinker = drinkerCount > 0 ? totalAlcohol / drinkerCount : 0;

  const calculations: MemberCalculation[] = members.map(m => {
    const rawAlcoholShare = m.isDrinker ? alcoholPerDrinker : 0;
    const rawSharedShare = sharedPerPerson;
    const rawTotal = rawAlcoholShare + rawSharedShare;

    let totalOwed: number;
    if (roundUp) {
      totalOwed = Math.ceil(rawTotal);
    } else {
      totalOwed = Math.round(rawTotal * 100) / 100;
    }

    const paidAmount = Number(m.paidAmount) || 0;
    const netAmount = Math.round((totalOwed - paidAmount) * 100) / 100;

    return {
      memberId: m.id,
      name: m.name,
      isDrinker: m.isDrinker,
      sharedShare: Math.round(rawSharedShare * 100) / 100,
      alcoholShare: Math.round(rawAlcoholShare * 100) / 100,
      totalOwed,
      paidAmount,
      netAmount,
    };
  });

  return {
    totalAmount,
    totalAlcohol,
    totalShared,
    drinkerCount,
    nonDrinkerCount,
    totalMembers,
    calculations,
  };
}
