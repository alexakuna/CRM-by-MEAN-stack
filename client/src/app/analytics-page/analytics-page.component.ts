import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {AnalyticsService} from "../shared/services/analytics.service";
import {AnalyticsPage} from "../shared/interfaces";
import {Chart} from "chart.js";


@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain', {static: false}) gainRef: ElementRef;
  @ViewChild('order', {static: false}) orderRef: ElementRef;

  aSub: Subscription;
  average: number;
  pending = true;

  constructor(private service: AnalyticsService) {
  }

  ngAfterViewInit() {
    const gainValue: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)'
    };
    const orderValue: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)'
    };
    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average;

      gainValue.labels = data.chart.map(item => item.label);
      gainValue.data = data.chart.map(item => item.gain);
      orderValue.labels = data.chart.map(item => item.label);
      orderValue.data = data.chart.map(item => item.order);

      // gainValue.labels.push('25.01.2020');
      // gainValue.labels.push('26.01.2020');
      // gainValue.labels.push('26.01.2020');
      // gainValue.data.push(1200);
      // gainValue.data.push(200);
      // gainValue.data.push(2000);
      //
      // orderValue.labels.push('25.01.2020');
      // orderValue.labels.push('26.01.2020');
      // orderValue.labels.push('26.01.2020');
      // orderValue.data.push(3);
      // orderValue.data.push(4);
      // orderValue.data.push(7);


      const gainCtx = this.gainRef.nativeElement.getContext('2d');
      const orderCtx = this.orderRef.nativeElement.getContext('2d');
      gainCtx.canvas.height = '300px';
      orderCtx.canvas.height = '300px';

      new Chart(gainCtx, createChartConf(gainValue));
      new Chart(orderCtx, createChartConf(orderValue));

      this.pending = false
    })
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

}
function createChartConf({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
