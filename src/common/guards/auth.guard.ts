import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { IAuthContext } from '../interfaces/context.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accountId = request.header('X-Account-Id');

    if (!accountId) return false;

    const authContext: IAuthContext = await this.cacheManager.get(accountId);
    request.authContext = authContext;
    return !!authContext;
  }
}
