import { unitOfTime } from 'Moment';

export interface BbApiResponse<T> {
  success: number;
  data: T;
}

export type Ohlcv = [string, string, string, string, string, number];

export interface CandleStick {
  type: string;
  ohlcv: Ohlcv[];
}

export interface BbCandleStickResponse {
  candlestick: CandleStick[];
  timestamp: number;
}

export interface Series {
  name: number;
  value: number;
}

export interface Chart {
  name: string;
  series: Series[];
}

export enum ChartType {
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year',
}

export const chartTypes: string[] = ['day', 'week', 'month', 'year'];

export type CandleType =
  | '1min'
  | '5min'
  | '15min'
  | '30min'
  | '1hour'
  | '4hour'
  | '8hour'
  | '12hour'
  | '1day'
  | '1week';

export interface CandleStickType {
  requestPeriod: unitOfTime.DurationConstructor;
  candleType: CandleType;
  sincePeriod: 'hours' | 'weeks' | 'months' | 'years';
  defaultSince: number;
}

export type Pair =
  | 'btc_jpy'
  | 'xrp_jpy'
  | 'ltc_btc'
  | 'eth_btc'
  | 'mona_jpy'
  | 'mona_btc'
  | 'bcc_jpy'
  | 'bcc_btc';

export const pairs: Pair[] = [
  'btc_jpy',
  'xrp_jpy',
  'ltc_btc',
  'eth_btc',
  'mona_jpy',
  'mona_btc',
  'bcc_jpy',
  'bcc_btc',
];
