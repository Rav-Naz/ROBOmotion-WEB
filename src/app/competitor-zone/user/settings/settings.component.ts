import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmedValidator } from 'src/app/shared/utils/matching';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  formName: FormGroup;
  formPhone: FormGroup;
  formPassword: FormGroup;
  private loadingName: boolean = false;
  private loadingPhone: boolean = false;
  private loadingPassword: boolean = false;
  
  constructor(public translate: TranslateService, private formBuilder: FormBuilder, private authService: AuthService) {
    this.formName = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      surname: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(40)]]
    });
    this.formPhone = this.formBuilder.group({
      phone: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(15)]],
    });
    this.formPassword = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(64)]],
      repeatPassword: [null, [Validators.required]],
    }, { 
      validator: ConfirmedValidator('password', 'repeatPassword')
    });
  }


  public get isFormGroupNameValid() {
    return this.formName.valid && !this.loadingName && this.authService.canModify;
  }
  public get isFormGroupPhoneValid() {
    return this.formPhone.valid && !this.loadingPhone;
  }
  public get isFormGroupPasswordValid() {
    return this.formPassword.valid && !this.loadingPassword;
  }

}
