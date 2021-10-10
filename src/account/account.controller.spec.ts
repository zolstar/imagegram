import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { mockProviders } from '../../test';

describe('AccountController', () => {
  let controller: AccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: mockProviders,
    }).compile();

    controller = module.get<AccountController>(AccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
