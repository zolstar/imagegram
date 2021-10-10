import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { SuccessResponse } from '../common/helpers/response';

@Controller('accounts')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() createAccountDto: CreateAccountDto) {
    const data = await this.accountService.create(createAccountDto);
    return new SuccessResponse(data);
  }
}
