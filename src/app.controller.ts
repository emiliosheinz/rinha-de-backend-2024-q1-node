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
    return this.appService.getStatement({ customerId });
  }
}
