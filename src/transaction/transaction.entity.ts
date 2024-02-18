export enum TransactionType {
  Credit = 'c',
  Debit = 'd',
}

export class Transaction {
  id: number;
  valor: number;
  tipo: TransactionType;
  descricao: string;
  realizada_em: Date;
  customerId: number;
}
