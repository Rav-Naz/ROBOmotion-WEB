import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {

  @Input() group!: FormGroup;
  @Input() controlName!: string;
  @Input() translatePrefix!: string;
  @Input() options!: Array<{value: string, id: any}>;

  get isFormInvalid() {
    return !this.group.get(this.controlName)?.valid && this.group.get(this.controlName)?.touched;
  }

  get getErrors() {
    var control = this.group.get(this.controlName);
    var keys = control?.errors ? Object.keys(control?.errors) : [];
    return keys;
  }

  get isSeleted() {
    if (this.group.get(this.controlName)?.errors !== null && this.group.get(this.controlName)?.errors!["required"]) {
      return false;
    } else {
      return true;
    }
  }

}
