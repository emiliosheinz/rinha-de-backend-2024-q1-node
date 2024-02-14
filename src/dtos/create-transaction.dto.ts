import { IsEnum, IsInt, Length } from 'class-validator';
import { TransactionType } from 'src/entities/transaction.entity';

export class CreateTransactionDto {
  @IsInt()
  valor: number;
  @IsEnum(TransactionType)
  tipo: TransactionType;
  @Length(1, 10)
  descricao: string;
}
