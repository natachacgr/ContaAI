export type TransactionType = "credit" | "debit";

export interface Transaction {
  id: number;
  date: string;
  description: string;
  value: number;
  type: TransactionType;
}

export interface FilterState {
  month: string;
  year: string;
}

export interface MonthSummary {
  credits: number;
  debits: number;
  balance: number;
}
