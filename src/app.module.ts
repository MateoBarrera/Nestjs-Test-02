import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';
import { TasksModule } from './modules/task/tasks.module';
import { AuthModule } from './modules/auth/auth.module';
import { RateLimitGuard } from './common/guards/rate-limit.guard';
import { APP_GUARD } from '@nestjs/core';
import { InMemoryCacheClient } from './common/cache/in-memory-cache.client';
import { RedisCacheClient } from './common/cache/redis-cache.client';
import { CacheInterceptor } from './common/interceptors/cache.interceptor';
import { RequestLoggingMiddleware } from './common/middleware/request-logging.middleware';
import { LoggingModule } from './modules/logging/logging.module';
import { LogsModule } from './modules/logging/logs.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        return {
          type: 'mysql',
          host: configService.dbHost,
          port: configService.dbPort,
          username: configService.dbUsername,
          password: configService.dbPassword,
          database: configService.dbDatabase,
          // Let TypeORM automatically load entities registered with forFeature
          autoLoadEntities: true,
          synchronize: true, // Shouldn't be used in production
        };
      },
    }),
    TasksModule,
    // register auth module so JwtStrategy and JwtModule are available
    AuthModule,
    LoggingModule,
    ...(process.env.NODE_ENV === 'production' ? [] : [LogsModule]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: RateLimitGuard },
    {
      provide: 'CACHE_CLIENT',
      useFactory: () => {
        const host = process.env.REDIS_HOST;
        const port = Number(process.env.REDIS_PORT ?? 6379);
        if (host) {
          try {
            return new RedisCacheClient(host, port);
          } catch (e) {
            // Fail open: log if needed and fallback to in-memory client
            // eslint-disable-next-line no-console
            console.warn('RedisCacheClient build failed, falling back to in-memory cache', e?.message ?? e);
            return new InMemoryCacheClient();
          }
        }
        return new InMemoryCacheClient();
      },
    },
    CacheInterceptor,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
