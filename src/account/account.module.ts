import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { Account } from '../common/entities/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [AccountService],
  controllers: [AccountController],
  imports: [TypeOrmModule.forFeature([Account])],
})
export class AccountModule {}
