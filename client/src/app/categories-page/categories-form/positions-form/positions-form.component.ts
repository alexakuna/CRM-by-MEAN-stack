import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionService} from "../../../shared/services/position.service";
import {Position} from "../../../shared/interfaces";
import {MaterialInstance, MaterialService} from "../../../shared/classes/material.cervise";
import {FormGroup, Validators, FormControl} from "@angular/forms";

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  positions: Position[] = []
  loading: boolean = false
  modal: MaterialInstance
  form: FormGroup
  positionId = null

  @Input('categoryId') categoryId: string
  @ViewChild('modal', {static: false}) modalRef: ElementRef

  constructor(private positionService: PositionService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)])
    })
    this.loading = true
    this.positionService.fetch(this.categoryId).subscribe(
      position => {
        this.positions = position
        this.loading = false
      }
    )
  }

  ngOnDestroy() {
    this.modal.destroy()
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    this.modal.open()
    MaterialService.updateTextInput()
  }
  onAddPosition(){
    this.positionId = null
    this.form.reset({
      name: null,
      cost: 1
    })
    this.modal.open()
    MaterialService.updateTextInput()
  }
  closeModal(){
    this.modal.close()
  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation()
    const desision = window.confirm(`Удалить позицию "${position.name}"?`)
    if(desision) {
      this.positionService.delete(position).subscribe(
        response => {
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions.splice(idx, 1)
          MaterialService.toast(response.message)
        },
        error => {

        }
      )
    }
  }
  onSubmit (){
    this.form.disable()
    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }
    const completed = () => {
      this.form.reset({name: '', cost: 1})
      this.form.enable()
      this.modal.close()
    }

    if(this.positionId) {

      newPosition._id = this.positionId

      this.positionService.update(newPosition).subscribe(
        position => {
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions[idx] = position
          MaterialService.toast('Именения сохранены.')
        },
        error => {
          MaterialService.toast(error.error.message)
        },
        () => {
          completed()
        }
      )
    } else {
      this.positionService.create(newPosition).subscribe(
        position => {
          MaterialService.toast('Позиция создана.')
          this.positions.push(position)
        },
        error => {
          MaterialService.toast(error.error.message)
        },
        () => {
          completed()
        }
      )
    }

  }
}
