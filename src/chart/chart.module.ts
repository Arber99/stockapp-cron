import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ChartService } from './chart.service';

@Module({
  imports: [HttpModule],
  providers: [ChartService],
})
export class ChartModule {}
