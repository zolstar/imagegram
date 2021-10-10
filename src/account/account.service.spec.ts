import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { mockProviders } from '../../test';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...mockProviders, AccountService],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
