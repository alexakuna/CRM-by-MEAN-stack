import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MaterialService} from "../shared/classes/material.cervise";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  aSub: Subscription


  constructor(private auth: AuthService, private router: Router, private  route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
    this.route.queryParams.subscribe((params: Params) =>{
      if (params['registered']) {
        MaterialService.toast('Вы успешно зарегистрировали аккаунт! Теперь вы можете зайти с помощью ваших данных.')
      } else if (params['accessDenied']) {
        MaterialService.toast('Для начала авторизуйтесь.')
      } else if (params['sessionFiled']) {
        MaterialService.toast('Время сессии истекло. Войдите в систему заново.')
      }
    })
  }

  ngOnDestroy() {
    if(this.aSub) {
      this.aSub.unsubscribe()
    }
  }

  onSubmit() {
    this.form.disable()
    this.aSub = this.auth.login(this.form.value).subscribe(
      () => this.router.navigate(['/overview']),
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }
}
