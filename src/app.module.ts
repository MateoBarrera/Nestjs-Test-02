import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';
import { TasksModule } from './modules/task/tasks.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
