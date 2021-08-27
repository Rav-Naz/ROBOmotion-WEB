import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  // options = [{value: 'controls.category.name', id: 0}, {value: 'controls.password.name', id: 1}];

  constructor(public translate: TranslateService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required,Validators.minLength(2), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)]],
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(64)]],
    });
  }

  ngOnInit() {

  }

  get isFormGroupValid() {
    return this.form.valid;
  }
}
