import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

type Chart = {
  ticker: string;
  prices: number[];
};
@Injectable()
export class ChartService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  public chart: Chart[] = [];

  async cronMarketData(start: string, end: string) {
    await this.getChartData(start, end);
  }

  getChartData(start: string, end: string) {
    return this.httpService.axiosRef
      .get('https://data.alpaca.markets/v2/stocks/bars', {
        headers: {
          'Content-Type': 'application/json',
          'APCA-API-KEY-ID': this.config.get('ALPACA_KEY'),
          'APCA-API-SECRET-KEY': this.config.get('ALPACA_SECRET'),
        },
        params: {
          limit: 10000,
          timeframe: '15Min',
          start: start,
          end: end,
          symbols:
            'aapl,msft,goog,amzn,tsla,unh,tsm,jnj,v,meta,nvda,xom,wmt,pg,jpm,ma,hd,cvx,lly,ko,bac,pfe,pep,abbv,nvo,cost,baba,mrk,tmo,asml,avgo,tm,bhp,dis,dhr,azn,orcl,shel,csco,acn,adbe,mcd,abt,nvs,vz,tmus,ups,crm,nke,nee,wfc,cmcsa,qcom,txn,bmy,pm,ms,amd,unp,lin,tte,intc,schw,cop,ptr,ry,rtx,hon,cvs,low,amgn,t,hsbc,eqnr,intu,spgi,amt,bx',
        },
      })
      .then((chart) => {
        const chartList: Chart[] = [];
        for (const [key, value] of Object.entries(chart.data.bars)) {
          const priceList: number[] = [];
          const valueList: any = value;
          valueList.forEach((element) => {
            priceList.push(element['o']);
          });
          chartList.push({
            ticker: key,
            prices: priceList,
          });
        }
        chartList.forEach((element) => {
          this.setChart(element);
        });
      });
  }

  async setChart(chart: Chart) {
    const char = await this.prisma.dailyChart.upsert({
      where: {
        ticker: chart.ticker,
      },
      update: {
        prices: chart.prices,
      },
      create: {
        ticker: chart.ticker,
        prices: chart.prices,
      },
    });
    return char;
  }

  async getChart() {
    return await this.prisma.dailyChart.findMany();
  }
}
