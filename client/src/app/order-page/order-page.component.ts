import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NavigationEnd, Router} from "@angular/router";
import {MaterialInstance, MaterialService} from "../shared/classes/material.cervise";
import {OrderService} from "./order.service";
import {Order, OrderPosition} from "../shared/interfaces";
import {OrdersService} from "../shared/services/orders.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modal', {static: true}) modalRef: ElementRef;
isRoot: boolean;
modalW: MaterialInstance;
pending = false;
oSub: Subscription;
  constructor(private router: Router, private order: OrderService, private ordersService: OrdersService) {
  }

  ngOnInit() {
    this.isRoot = this.router.url === '/order';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order'
      }
    })
  }
  ngOnDestroy() {
    this.modalW.destroy();
    if (this.oSub) {
      this.oSub.unsubscribe()
    }
  }
  ngAfterViewInit(): void {
    this.modalW = MaterialService.initModal(this.modalRef)
  }

  open() {
    this.modalW.open()
  }

  close() {
    this.modalW.close()
  }

  submit() {
    this.pending = true;
    const order: Order = {
      list: this.order.list.map(item => {
        delete item._id;
        return item
      })
    };
    this.oSub = this.ordersService.create(order).subscribe(
      newOrder => {
        MaterialService.toast(`Заказ №${newOrder.order} добавлен`);
        this.order.clear()
      },
      error => MaterialService.toast(error.error.message),
      () => {
        this.modalW.close();
        this.pending = false
      }
    )
  }

  removePosition(item: OrderPosition) {
    this.order.remove(item)
  }
}
