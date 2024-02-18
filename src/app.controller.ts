import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTransactionDto } from './transaction/create-transaction.dto';

@Controller('/clientes')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/:id/transacoes')
  @HttpCode(200)
  async createTransaction(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    customerId: number,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    console.log(
      `[API] Create transaction endpoint called for customer ID [${customerId}]`,
    );
    const response = await this.appService.createTransaction(
      customerId,
      createTransactionDto,
    );
    return response;
  }

  @Get('/:id/extrato')
  async getStatement(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    customerId: number,
  ) {
    console.log(
      `[API] Get statement endpoint called for customer ID [${customerId}]`,
    );
    return this.appService.getStatement({ customerId });
  }
}
