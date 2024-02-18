import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DATABASE_CONNECTION } from './db/db.constants';
import { Database } from './db/db.types';
import { CreateTransactionDto } from './transaction/create-transaction.dto';
import { Customer } from './customer/customer.entity';
import { CustomerService } from './customer/customer.service';
import { TransactionService } from './transaction/transaction.service';

@Injectable()
export class AppService {
  constructor(
    @Inject(DATABASE_CONNECTION) private db: Database,
    private customerService: CustomerService,
    private transactionService: TransactionService,
  ) {}

  async createTransaction(customerId: number, dto: CreateTransactionDto) {
    const customer = await this.customerService.findById(customerId);
    this.checkCustomerExists(customer);
    const newBalance = this.customerService.calculateNewBalance(
      customer.saldo,
      dto.tipo,
      dto.valor,
    );
    this.checkCreditLimitExceeded(customer.limite, newBalance);

    await Promise.all([
      this.customerService.updateBalance(customerId, newBalance),
      this.transactionService.create(customerId, dto),
    ]);

    return {
      limite: customer.limite,
      saldo: newBalance,
    };
  }

  async getStatement({ customerId }: { customerId: number }) {
    const customer = await this.customerService.findById(customerId);
    this.checkCustomerExists(customer);
    const transactions = await this.transactionService.getTransactions({
      customerId,
      limit: 10,
    });

    return {
      saldo: {
        total: customer.saldo,
        data_extrato: new Date(),
        limite: customer.limite,
      },
      ultimas_transacoes: transactions,
    };
  }

  private checkCustomerExists(customer: Customer): void {
    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }
  }

  private checkCreditLimitExceeded(limit: number, newBalance: number): void {
    if (newBalance < -limit) {
      throw new UnprocessableEntityException('Limite excedido');
    }
  }
}
