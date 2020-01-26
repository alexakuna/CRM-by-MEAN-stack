import {AfterContentInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from "../shared/classes/material.cervise";
import {OrdersService} from "../shared/services/orders.service";
import {Subscription} from "rxjs";
import {Filter, Order} from "../shared/interfaces";

const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterContentInit {

  @ViewChild('tooltip', {static: true}) toolRef: ElementRef;
  tooltip: MaterialInstance;
  isVisible: boolean;
  offset = 0;
  limit = STEP;
  oSub: Subscription;
  orders: Order[] = [];
  loading = false;
  reloading = false;
  zero = false;
  filter: Filter = {};

  constructor(private ordersService: OrdersService) { }

  ngOnInit() {
    this.reloading = true;
    this.fetch()
  }
  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    });
    this.oSub = this.ordersService.fetch(params).subscribe(orders => {
      this.orders = this.orders.concat(orders);
      this.zero = orders.length < STEP;
      this.loading = false;
      this.reloading = false
    })
  }
  ngOnDestroy() {
    this.tooltip.destroy();
    this.oSub.unsubscribe()
  }

  applyFilter(filter: Filter) {
    this.orders = [];
    this.offset = 0;
    this.filter = filter;
    this.reloading = true;
    this.fetch()
  }
  ngAfterContentInit() {
    this.tooltip = MaterialService.initTooltip(this.toolRef)
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.fetch()
  }
}
