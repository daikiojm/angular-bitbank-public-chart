import { Component, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSelectChange } from '@angular/material/select';
import * as moment from 'moment';

import { ChartService } from './chart.service';
import { ChartType, pairs, chartTypes } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  chart: any[];

  // chart options
  view = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  autoScale = true;
  schemeType = 'ordinal';
  rangeFillOpacity = 1;
  colorScheme = {
    domain: ['#0d63bd'],
  };

  pairs = pairs;
  chartTypes = chartTypes;
  pair = 'btc_jpy';
  chartType = ChartType;
  currentChartType: ChartType = ChartType.day;

  constructor(private chartServie: ChartService) {}

  ngOnInit(): void {
    this.updateChart();
  }

  formatDate(data): string {
    return moment(data).format('YYYY/MM/DD H:mm');
  }

  getDisplayPairName(pair: string): string {
    return pair
      .toUpperCase()
      .split('_')
      .join('/');
  }

  onChangePair(event: MatSelectChange): void {
    this.pair = event.value;
    this.updateChart();
  }

  onChangeChartTypeToggleButton(event: MatButtonToggleChange): void {
    this.currentChartType = event.value;
    this.updateChart();
  }

  private updateChart(): void {
    this.chartServie
      .getChart(this.pair, this.currentChartType)
      .subscribe((res) => (this.chart = [res]), (error) => console.log(error));
  }
}
