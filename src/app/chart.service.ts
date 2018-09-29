import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { Moment, unitOfTime } from 'Moment';

import {
  ChartType,
  CandleStickType,
  Chart,
  Series,
  BbApiResponse,
  CandleStick,
  BbCandleStickResponse,
} from './types';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private readonly baseUrl = 'https://public.bitbank.cc';

  constructor(private http: HttpClient) {}

  getChart(pair: string, type: ChartType): Observable<Chart> {
    const candlestickType = this.getCandlestickTypeByChartType(type);
    const since = moment().subtract(
      candlestickType.defaultSince,
      candlestickType.sincePeriod
    );
    const days = this.getSinceFromNowPeriodsArray(
      since,
      candlestickType.requestPeriod
    );

    const requests$ = days.map((day) =>
      this.fetchCandlestick(pair, candlestickType.candleType, day)
    );

    return this.fetchAndJoinSeries(pair, since, requests$);
  }

  private getCandlestickTypeByChartType(type: ChartType): CandleStickType {
    switch (type) {
      case ChartType.day: {
        return {
          requestPeriod: 'day',
          candleType: '1hour',
          sincePeriod: 'hours',
          defaultSince: 24,
        };
      }
      case ChartType.week: {
        return {
          requestPeriod: 'year',
          candleType: '8hour',
          sincePeriod: 'weeks',
          defaultSince: 1,
        };
      }
      case ChartType.month: {
        return {
          requestPeriod: 'year',
          candleType: '1day',
          sincePeriod: 'months',
          defaultSince: 1,
        };
      }
      default: {
        return {
          requestPeriod: 'year',
          candleType: '1week',
          sincePeriod: 'years',
          defaultSince: 1,
        };
      }
    }
  }

  private fetchAndJoinSeries(
    pair: string,
    since: Moment,
    requests: Observable<Series[]>[]
  ): Observable<Chart> {
    return forkJoin(...requests).pipe(
      map((data: Series[][]) => data.reduce((pre, cur) => pre.concat(cur))),
      map((series: Series[]) =>
        series.filter((point) => moment(point.name).isSameOrAfter(since))
      ),
      map((data) => this.mapChart(pair, data))
    );
  }

  private fetchCandlestick(
    pair: string,
    unit: string,
    period: string
  ): Observable<Series[]> {
    const url = this.getCnadlestickUrl(pair, unit, period);
    return this.http.get<BbApiResponse<BbCandleStickResponse>>(url).pipe(
      map((data) => data.data.candlestick[0]),
      map((candlestick) => this.mapSeries(candlestick))
    );
  }

  private mapSeries(candleStick: CandleStick): Series[] {
    return candleStick.ohlcv.map((data) => ({
      name: data[5],
      value: +data[0],
    }));
  }

  private mapChart(name: string, series: Series[]): Chart {
    return { name, series };
  }

  private getCnadlestickUrl(
    pair: string,
    unit: string,
    period: string
  ): string {
    return `${this.baseUrl}/${pair}/candlestick/${unit}/${period}`;
  }

  private getSinceFromNowPeriodsArray(
    since: Moment,
    unit: unitOfTime.DurationConstructor = 'day'
  ): string[] {
    const current = moment(since);
    const result: string[] = [];

    while (!current.isSame(moment().add(1, unit), unit)) {
      const format = unit === 'day' ? 'YYYYMMDD' : 'YYYY';
      result.push(current.format(format));
      current.add(1, unit);
    }
    return result;
  }
}
