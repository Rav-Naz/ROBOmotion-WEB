import { UiService } from './../../../services/ui.service';
import { UserService } from './../../../services/user.service';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmedValidator } from 'src/app/shared/utils/matching';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  host: {
    'class': 'router-flex'
  }
})
export class SettingsComponent {

  formName: FormGroup;
  formPhone: FormGroup;
  formPassword: FormGroup;
  private loadingName: boolean = false;
  private loadingPhone: boolean = false;
  private loadingPassword: boolean = false;
  
  constructor(public translate: TranslateService, private formBuilder: FormBuilder,
    public authService: AuthService, public userService: UserService, private ui: UiService) {
    this.formName = this.formBuilder.group({
      name: [(userService.userDetails as any)?.imie, [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      surname: [(userService.userDetails as any)?.nazwisko, [Validators.required, Validators.minLength(2), Validators.maxLength(40)]]
    });
    this.formPhone = this.formBuilder.group({
      phone: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(15)]],
    });
    this.formPassword = this.formBuilder.group({
      actualPassword: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(64)]],
      newPassword: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(64)]],
      repeatNewPassword: [null, [Validators.required]],
    }, { 
      validator: ConfirmedValidator('newPassword', 'repeatNewPassword')
    });
  }

  onSubmitPasswordForm() {
    if (this.isFormGroupPasswordValid) {
      this.loadingPassword = true;
      this.authService.changeUserPassword(this.formPassword.get('actualPassword')?.value, this.formPassword.get('newPassword')?.value)
      .catch(err => {})
      .then((value) => {
        if(value) {
          this.formPassword.reset();
        }
      }).finally(() => {
        this.loadingPassword = false;
      })
    }
  }
  
  onSubmitNameForm() {
    if (this.isFormGroupNameValid) {
      this.loadingName = true;
      this.userService.editUser(this.formName.get('name')?.value, this.formName.get('surname')?.value)
      .catch(err => {})
      .finally(() => {
        this.loadingName = false;
      })
    }
  }

  copyUUID(){
    let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = this.userService.userUUID;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);

      this.ui.showFeedback('loading', this.translate.instant('competitor-zone.settings.errors.copied'), 3);
    }

  public get isFormGroupNameValid() {
    return this.formName.valid && !this.loadingName && this.authService.canModify && this.isFormNameChanged;
  }
  public get isFormGroupPhoneValid() {
    return this.formPhone.valid && !this.loadingPhone;
  }
  public get isFormGroupPasswordValid() {
    return this.formPassword.valid && !this.loadingPassword;
  }

  public get isFormNameChanged() {
    if (this.userService.userDetails && this.formName) {
      return `${(this.userService.userDetails as any)?.imie} ${(this.userService.userDetails as any)?.nazwisko}` !== `${this.formName.get('name')?.value} ${this.formName.get('surname')?.value}`;
    } else {
      return false;
    }
  }

}
