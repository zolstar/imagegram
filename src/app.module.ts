import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { SharedModule } from './shared/shared.module';
import { PostModule } from './post/post.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, './', 'public'),
    }),
    SharedModule,
    AccountModule,
    PostModule,
  ],
})
export class AppModule {}
