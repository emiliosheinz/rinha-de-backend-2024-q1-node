import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateTransactionDto } from './transaction/create-transaction.dto';
import { CustomerService } from './customer/customer.service';
import { TransactionService } from './transaction/transaction.service';
import { DbService } from './db/db.service';

@Injectable()
export class AppService {
  constructor(
    private customerService: CustomerService,
    private transactionService: TransactionService,
    private dbService: DbService,
  ) {}

  async createTransaction(customerId: number, dto: CreateTransactionDto) {
    this.checkCustomerExists(customerId);

    const transaction = await this.dbService.startTransaction();

    try {
      const customer = await this.customerService.findByIdForUpdate(
        customerId,
        transaction,
      );
      const newBalance = this.customerService.calculateNewBalance(
        customer.saldo,
        dto.tipo,
        dto.valor,
      );
      this.checkCreditLimitExceeded(customer.limite, newBalance);

      await Promise.all([
        this.customerService.updateBalance(customerId, newBalance, transaction),
        this.transactionService.create(customerId, dto, transaction),
      ]);

      await this.dbService.commit(transaction);

      return {
        limite: customer.limite,
        saldo: newBalance,
      };
    } catch (error) {
      await this.dbService.rollback(transaction);
      throw error;
    }
  }

  async getStatement({ customerId }: { customerId: number }) {
    this.checkCustomerExists(customerId);
    const [customer, transactions] = await Promise.all([
      this.customerService.findById(customerId),
      this.transactionService.getTransactions({
        customerId,
        limit: 10,
      }),
    ]);
    return {
      saldo: {
        total: customer.saldo,
        data_extrato: new Date(),
        limite: customer.limite,
      },
      ultimas_transacoes: transactions,
    };
  }

  private checkCustomerExists(customerId: number): void {
    const isValidCustomerId = customerId >= 1 && customerId <= 5;
    if (!isValidCustomerId) {
      throw new NotFoundException('Cliente não encontrado');
    }
  }

  private checkCreditLimitExceeded(limit: number, newBalance: number): void {
    if (newBalance < -limit) {
      throw new UnprocessableEntityException('Limite excedido');
    }
  }
}
