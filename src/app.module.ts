import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ChartModule } from './chart/chart.module';
import { ChartService } from './chart/chart.service';
import { CronService } from './cron/cron.service';
import { PrismaModule } from './prisma/prisma.module';
import { RestController } from './rest/rest.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
    ChartModule,
    PrismaModule,
  ],
  controllers: [RestController],
  providers: [ChartService, CronService],
})
export class AppModule {}
