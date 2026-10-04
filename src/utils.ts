import { SpendProject, DebtSimplification, NetBalance } from './types';

// Pre-packaged gradients for dynamic visual delight
export const PROJECT_GRADIENTS = [
  'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', // Indigo Purple
  'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', // Cyan Blue
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', // Amber Red
  'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Emerald Green
  'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', // Pink Violet
  'linear-gradient(135deg, #f97316 0%, #eab308 100%)', // Orange Yellow
];

export const CATEGORY_ICONS: Record<string, string> = {
  Food: '🍕',
  Travel: '✈️',
  Stay: '🏨',
  Shopping: '🛍️',
  Entertainment: '🎟️',
  Fuel: '⛽',
  Groceries: '🛒',
  Utilities: '💡',
  Other: '✨'
};

export const INITIAL_PROJECTS: SpendProject[] = [];


/**
 * Calculates net balances for each member in a SpendProject.
 * Positive balance = member is owed money.
 * Negative balance = member owes money.
 */
export function calculateBalances(project: SpendProject): NetBalance[] {
  const balanceMap: Record<string, number> = {};
  
  // Initialize all members with 0
  project.members.forEach(member => {
    balanceMap[member.id] = 0;
  });

  // Calculate expenses
  project.expenses.forEach(exp => {
    // Payer gains credit for total amount
    if (balanceMap[exp.paidBy] !== undefined) {
      balanceMap[exp.paidBy] += exp.amount;
    }

    // Participants owe their share
    exp.splits.forEach(split => {
      if (balanceMap[split.personId] !== undefined) {
        balanceMap[split.personId] -= split.amount;
      }
    });
  });

  // Calculate settlements (direct payments made between members)
  project.settlements.forEach(s => {
    if (balanceMap[s.fromPersonId] !== undefined) {
      balanceMap[s.fromPersonId] += s.amount; // Sender reduced their debt
    }
    if (balanceMap[s.toPersonId] !== undefined) {
      balanceMap[s.toPersonId] -= s.amount; // Receiver's claim reduced
    }
  });

  return project.members.map(member => ({
    personId: member.id,
    balance: Math.round((balanceMap[member.id] || 0) * 100) / 100
  }));
}

/**
 * Greedily simplifies debts to minimize transactions.
 */
export function simplifyDebts(balances: NetBalance[]): DebtSimplification[] {
  const debtors = balances
    .filter(b => b.balance < -0.01)
    .map(b => ({ personId: b.personId, amount: -b.balance }))
    .sort((a, b) => b.amount - a.amount);

  const creditors = balances
    .filter(b => b.balance > 0.01)
    .map(b => ({ personId: b.personId, amount: b.balance }))
    .sort((a, b) => b.amount - a.amount);

  const transactions: DebtSimplification[] = [];

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const minAmount = Math.min(debtor.amount, creditor.amount);
    if (minAmount > 0.01) {
      transactions.push({
        from: debtor.personId,
        to: creditor.personId,
        amount: Math.round(minAmount * 100) / 100
      });
    }

    debtor.amount -= minAmount;
    creditor.amount -= minAmount;

    if (debtor.amount <= 0.01) i++;
    if (creditor.amount <= 0.01) j++;
  }

  return transactions;
}
