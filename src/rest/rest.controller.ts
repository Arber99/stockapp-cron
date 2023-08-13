import { Controller, HttpCode, Post } from '@nestjs/common';
import { CronService } from 'src/cron/cron.service';

@Controller('update')
export class RestController {
  constructor(private cron: CronService) {}

  @Post('market')
  @HttpCode(200)
  updateMarket() {
    this.cron.cronMarketData();

    return 'Updated status successfully';
  }

  @Post('chart')
  @HttpCode(200)
  updateChart() {
    this.cron.chartFull();

    return 'Updated chart successfully';
  }
}
