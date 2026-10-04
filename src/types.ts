export type SplitType = 'equal' | 'portions' | 'exact' | 'percentage';

export interface Person {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  color?: string;
}

export interface SplitShare {
  personId: string;
  amount: number;      // Calculated exact share in currency
  portion?: number;    // Shares/portions (e.g. 2 shares vs 1 share)
  percentage?: number; // % share (e.g. 50%)
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string; // ISO string
  category: string;
  paidBy: string; // personId
  splitType: SplitType;
  splits: SplitShare[];
  notes?: string;
}

export interface Settlement {
  id: string;
  fromPersonId: string;
  toPersonId: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface SpendProject {
  id: string;
  title: string;
  description: string;
  category: 'trip' | 'home' | 'event' | 'couple' | 'other';
  coverGradient: string;
  currency: string;
  createdAt: string;
  members: Person[];
  expenses: Expense[];
  settlements: Settlement[];
}

export interface NetBalance {
  personId: string;
  balance: number; // positive = owed to person, negative = owes
}

export interface DebtSimplification {
  from: string; // personId
  to: string;   // personId
  amount: number;
}
