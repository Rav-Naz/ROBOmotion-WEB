import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmedValidator } from 'src/app/shared/utils/matching';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  constructor(public translate: TranslateService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      surname: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      email: [null, [Validators.required,Validators.minLength(2), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)]],
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(64)]],
      repeatPassword: [null, [Validators.required]],
    }, { 
      validator: ConfirmedValidator('password', 'repeatPassword')
    });
  }

  ngOnInit() {

  }

  get isFormGroupValid() {
    return this.form.valid;
  }

}