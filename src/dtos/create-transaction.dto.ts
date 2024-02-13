import { TransactionType } from 'src/entities/transaction.entity';

export class CreateTransactionDto {
  valor: number;
  tipo: TransactionType;
  descricao: string;
}
