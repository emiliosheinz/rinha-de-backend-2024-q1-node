export enum TransactionType {
  Credit = 'c',
  Debit = 'd',
}

export class Transaction {
  id: number;
  value: number;
  type: TransactionType;
  description: string;
  date: Date;
  clientId: number;
}
