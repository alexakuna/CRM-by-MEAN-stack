import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild} from '@angular/core';
import {Filter} from "../../shared/interfaces";
import {DatePicker, MaterialService} from "../../shared/classes/material.cervise";

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.css']
})
export class HistoryFilterComponent implements OnDestroy, AfterViewInit {
@Output() onFilter = new EventEmitter<Filter>();
@ViewChild('start', {static: false}) startRef: ElementRef;
@ViewChild('end', {static: false}) endRef: ElementRef;
  order: number;
  start: DatePicker;
  end: DatePicker;
  isValid = true;

  submitFilter() {
    const filter: Filter = {};

    if (this.order) {
      filter.order = this.order
    }
    if (this.start.date) {
      filter.start = this.start.date
    }
    if (this.end.date) {
      filter.end = this.end.date
    }
    this.onFilter.emit(filter)
  }
  ngAfterViewInit(): void {
    this.start = MaterialService.initDatePicker(this.startRef, this.validate.bind(this))
    this.end = MaterialService.initDatePicker(this.endRef, this.validate.bind(this))
  }
  validate() {
    if (!this.start.date || !this.end.date) {
      this.isValid = true;
      return
    }
    this.isValid = this.start.date < this.end.date;
  }
  ngOnDestroy() {
    this.start.destroy();
    this.end.destroy()
  }
}
