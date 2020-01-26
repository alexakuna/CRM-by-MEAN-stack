import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {Order} from "../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../shared/classes/material.cervise";

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnDestroy, AfterViewInit {

  @Input() orders: Order[];
  @ViewChild('modal', {static: false}) modalRef: ElementRef;
  modal: MaterialInstance;
  selectedOrder: Order;


  computeSum(order: Order): number {
    return order.list.reduce((total,item) => {
      return total += item.quantity * item.cost
    }, 0)
  }

  ngOnDestroy(): void {
    this.modal.destroy()
  }
  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  select(order: Order) {
    this.selectedOrder = order;
    this.modal.open();
  }

  closeM() {
    this.modal.close()
  }
}
