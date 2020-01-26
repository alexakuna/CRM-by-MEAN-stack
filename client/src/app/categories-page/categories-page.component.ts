import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../shared/services/category.service";
import {Category} from "../shared/interfaces";
import {Observable} from "rxjs";

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.css']
})
export class CategoriesPageComponent implements OnInit {
  categories$: Observable<Category[]>
  constructor(private category: CategoryService) {
  }

  ngOnInit() {
    this.categories$ = this.category.fetch()
  }

}
