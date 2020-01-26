import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoryService} from "../../shared/services/category.service";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {MaterialService} from "../../shared/classes/material.cervise";
import {Category} from "../../shared/interfaces";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {
  @ViewChild('input', {static: false}) inputRef: ElementRef
  imgPreview: any
  form: FormGroup
  isNew: boolean = true
  load: boolean = false
  image: File
  category: Category
  constructor(private route: ActivatedRoute, private categoriesService: CategoryService, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })
    this.form.disable()
    this.load = true

    this.route.params.pipe(
      switchMap((params: Params) => {
        if(params['id']) {
          this.isNew = false
          return this.categoriesService.getById(params['id'])
        }
        return of(null)
      })
    )
      .subscribe((category: Category) => {
        if(category) {
          this.category = category
          this.form.patchValue({
            name: category.name
          })
          this.imgPreview = category.imageSrc
        }
        this.form.enable()
        this.load = false
        setTimeout(() =>{
          MaterialService.updateTextInput()
        },0)
      }, error => MaterialService.toast(error.error.message))

  }

  triggerClick() {
    this.inputRef.nativeElement.click()
  }
  onFileUpload(event: any) {
    const file = event.target.files[0]
    this.image = file
    const reader = new FileReader()
    reader.onload = () => {
      this.imgPreview =  reader.result
    }

    reader.readAsDataURL(file)
  }

  onSubmit() {
    let obs$
    this.form.disable()

    if(this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image)
    } else {
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image)

    }

    obs$.subscribe(
      category => {
        this.category = category
        this.form.enable()
        MaterialService.toast('Изменения сохранены.')

      },
      error => {
        this.form.enable()

        MaterialService.toast(error.error.message)

      }
    )
  }

  delCategory() {
    const desision = window.confirm(`Удалить категорию "${this.category.name}"`)
    if(desision) {
      this.load = true
      this.categoriesService.delete(this.category._id).subscribe(
        done => {
          MaterialService.toast(done.message)
          this.load = false
        },
        error => MaterialService.toast(error.error),
        () => this.router.navigate(['/categories'])
      )
    }
  }
}
