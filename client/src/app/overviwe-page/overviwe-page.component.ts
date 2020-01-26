import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsService} from "../shared/services/analytics.service";
import {Observable} from "rxjs";
import {OverviewPage} from "../shared/interfaces";
import {MaterialInstance, MaterialService} from "../shared/classes/material.cervise";

@Component({
  selector: 'app-overviwe-page',
  templateUrl: './overviwe-page.component.html',
  styleUrls: ['./overviwe-page.component.css']
})
export class OverviwePageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tapTarget', {static: false}) tapTargetRef: ElementRef;
  data$: Observable<OverviewPage>;
  tapTarget: MaterialInstance;
  yesterday = new Date();

  constructor(private service: AnalyticsService) {
  }

  ngOnInit() {
    this.data$ = this.service.getOverview();

    this.yesterday.setDate(this.yesterday.getDate() - 1)
  }
  ngOnDestroy() {
    this.tapTarget.destroy()
  }
  ngAfterViewInit() {
    this.tapTarget = MaterialService.initInfoWindow(this.tapTargetRef)
  }

  openInfo() {
    this.tapTarget.open()
  }
}
