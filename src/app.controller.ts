import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';

@Controller('/clientes')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/:id/transacoes')
  createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<string> {
    console.log(createTransactionDto);
    return this.appService.createTransaction();
  }
}
