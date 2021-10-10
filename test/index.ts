import { CACHE_MANAGER, Provider } from '@nestjs/common';
import { AccountService } from '../src/account/account.service';
import { PostService } from '../src/post/post.service';

export const mockProviders: Provider[] = [
  {
    provide: CACHE_MANAGER,
    useValue: {},
  },
  {
    provide: AccountService,
    useValue: {},
  },
  {
    provide: PostService,
    useValue: {},
  },
];
