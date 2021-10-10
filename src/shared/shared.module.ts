import { CacheModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('TYPEORM_HOST'),
          port: +configService.get<number>('TYPEORM_PORT'),
          username: configService.get('TYPEORM_USERNAME'),
          password: configService.get('TYPEORM_PASSWORD'),
          database: configService.get('TYPEORM_DATABASE'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: +configService.get<number>('REDIS_PORT'),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [ConfigModule, TypeOrmModule, CacheModule],
})
export class SharedModule {}
