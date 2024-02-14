import {
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';

@Controller('/clientes')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/:id/transacoes')
  createTransaction(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<string> {
    console.log(createTransactionDto);
    return this.appService.createTransaction();
  }
}
