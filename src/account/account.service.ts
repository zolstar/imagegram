import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Account } from '../common/entities/account.entity';
import { getConnection } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { Cache } from 'cache-manager';
import { IAuthContext } from '../common/interfaces/context.interface';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async create(createAccountDto: CreateAccountDto) {
    try {
      const newAccount = Object.assign(new Account(), createAccountDto);
      return await getConnection().transaction(async (transactionManager) => {
        const account = await transactionManager.save(Account, newAccount);
        const authContext: IAuthContext = { account };
        await this.cacheManager.set(account.id, authContext, {
          ttl: 3600 * 24,
        });
        return account;
      });
    } catch (e) {
      this.logger.log('[create] error' + JSON.stringify(e));
    }
  }
}
