export enum TransactionType {
  Credit = 'c',
  Debit = 'd',
}

export class Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  description: string;
  date: Date;
  customerId: number;
}
