import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
@Component({
  selector: 'app-competitor-zone',
  templateUrl: './competitor-zone.component.html',
  styleUrls: ['./competitor-zone.component.scss']
})
export class CompetitorZoneComponent implements OnInit{

  form: FormGroup;

  constructor(public translate: TranslateService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required,Validators.minLength(2), Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)]],
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(64)]]
    });
  }

  ngOnInit() {
    // setInterval(() => {
    //   console.log(this.form)
    // }, 2000)
  }

  get isFormGroupValid() {
    return this.form.valid;
  }

}
