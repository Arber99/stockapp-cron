import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { ChartService } from 'src/chart/chart.service';
import { PrismaService } from 'src/prisma/prisma.service';

export type Market = {
  ticker: string;
  ap: number;
  bp: number;
};

@Injectable()
export class CronService {
  constructor(
    private chartService: ChartService,
    private prisma: PrismaService,
    private readonly httpService: HttpService,
    private config: ConfigService,
  ) {}

  @Cron('15 30/1 15 * * 1-5')
  marketHalf() {
    this.cronMarketData().catch((error) => {
      console.log(error);
    });
  }

  @Cron('15 */1 16-21 * * 1-5')
  marketFull() {
    this.cronMarketData().catch((error) => {
      console.log(error);
    });
  }

  @Cron('50 45/15 15 * * 1-5')
  chartQuarter() {
    const start = new Date(Date.now());
    start.setHours(15);
    start.setMinutes(30);
    start.setSeconds(0);
    start.setMilliseconds(0);
    const end = new Date(Date.now() - 910000);
    this.chartService.cronMarketData(start.toISOString(), end.toISOString());
  }

  @Cron('50 */15 16-21 * * 1-5')
  chartFull() {
    const start = new Date(Date.now());
    start.setHours(15);
    start.setMinutes(30);
    start.setSeconds(0);
    start.setMilliseconds(0);
    const end = new Date(Date.now() - 910000);
    this.chartService.cronMarketData(start.toISOString(), end.toISOString());
  }

  @Cron('50 0 22 * * 1-5')
  chartClose() {
    const start = new Date(Date.now());
    start.setHours(15);
    start.setMinutes(30);
    start.setSeconds(0);
    start.setMilliseconds(0);
    const end = new Date(Date.now() - 910000);
    this.chartService.cronMarketData(start.toISOString(), end.toISOString());
  }

  @Cron('50 15 22 * * 1-5')
  chartFinal() {
    const start = new Date(Date.now());
    start.setHours(15);
    start.setMinutes(30);
    start.setSeconds(0);
    start.setMilliseconds(0);
    const end = new Date(Date.now() - 910000);
    this.chartService.cronMarketData(start.toISOString(), end.toISOString());
  }

  @Cron('0 0 22 * * *')
  async closeMarket() {
    await this.prisma.status.updateMany({
      where: {
        status: true,
      },
      data: {
        status: false,
      },
    });
  }

  async cronMarketData() {
    await this.getMarketData();
    await this.prisma.status.updateMany({
      where: {
        status: false,
      },
      data: {
        status: true,
      },
    });
  }

  getMarketData() {
    return this.httpService.axiosRef
      .get('https://data.alpaca.markets/v2/stocks/quotes/latest', {
        headers: {
          'Content-Type': 'application/json',
          'APCA-API-KEY-ID': this.config.get('ALPACA_KEY'),
          'APCA-API-SECRET-KEY': this.config.get('ALPACA_SECRET'),
        },
        params: {
          symbols:
            'aapl,msft,goog,amzn,tsla,unh,tsm,jnj,v,meta,nvda,xom,wmt,pg,jpm,ma,hd,cvx,lly,ko,bac,pfe,pep,abbv,nvo,cost,baba,mrk,tmo,asml,avgo,tm,bhp,dis,dhr,azn,orcl,shel,csco,acn,adbe,mcd,abt,nvs,vz,tmus,ups,crm,nke,nee,wfc,cmcsa,qcom,txn,bmy,pm,ms,amd,unp,lin,tte,intc,schw,cop,ptr,ry,rtx,hon,cvs,low,amgn,t,hsbc,eqnr,intu,spgi,amt,bx',
        },
      })
      .then((market) => {
        const marketList = [];
        for (const [key, value] of Object.entries(market.data.quotes)) {
          marketList.push({
            ticker: key,
            ap: value['ap'],
            bp: value['bp'],
          });
        }
        marketList.sort((a, b) => (a.ticker > b.ticker ? 1 : -1));
        marketList.forEach((element) => {
          this.setMarket(element);
        });
      });
  }

  async setMarket(market: Market) {
    if (market.bp > 0 && market.ap > 0) {
      const marketList = await this.prisma.currentStock.upsert({
        where: {
          ticker: market.ticker,
        },
        update: {
          bp: market.bp,
          ap: market.ap,
        },
        create: {
          ticker: market.ticker,
          bp: market.bp,
          ap: market.ap,
        },
      });
      return marketList;
    }
  }
}
